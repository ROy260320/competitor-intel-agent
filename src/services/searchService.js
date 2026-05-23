/**
 * Search Service for Competitor Intelligence Agent
 * Manages Tavily Search API calls or falls back to custom dynamic Mock engine.
 */

// Custom Mock search template generators to make mock mode feel 100% real and responsive
const generateMockSources = (targetCompany, competitors, focusAreas) => {
  const sources = [];
  const allCompanies = [targetCompany, ...competitors];
  
  // Base categories
  const focusFeatures = focusAreas.includes('features');
  const focusPricing = focusAreas.includes('pricing');
  const focusComplaints = focusAreas.includes('complaints');

  allCompanies.forEach((company, index) => {
    const isTarget = company.toLowerCase() === targetCompany.toLowerCase();
    const domain = company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
    
    // 1. Official Pricing / Updates Source
    if (focusPricing || !focusFeatures) {
      sources.push({
        id: `src-${index}-1`,
        company: company,
        title: `${company} Pricing Plans & Subscription Updates 2026`,
        url: `https://www.compete-intel.ai/mock-site/${domain}/pricing`,
        snippet: `Explore ${company}'s new subscription pricing tier. Details on basic free features, premium expansion packages, and enterprise license costs updated in Q1 2026.`,
        content: `Official Pricing Page for ${company}. \nRecent updates: Introducing the 'Starter Plus' tier priced at $8/month billed annually. Free tier is now restricted to 3 active projects or files. Enterprise contracts require a custom sales quotation. Support for SSO and advanced audit logs are now exclusive to the Enterprise tier.`,
        relevance: 0.95,
        relevanceJustification: `Official pricing structures and subscription terms for ${company}, capturing recent pricing modifications.`
      });
    }

    // 2. Product Update / Changelog Source
    if (focusFeatures || !focusPricing) {
      sources.push({
        id: `src-${index}-2`,
        company: company,
        title: `What's New in ${company} - Changelog & Release Notes`,
        url: `https://www.compete-intel.ai/mock-site/${domain}/changelog`,
        snippet: `${company} releases version 4.2 with major performance improvements, custom integrations, drag-and-drop workflow visualizers, and offline database support.`,
        content: `What's New in ${company} - March 2026. \nWe are excited to launch our brand new Visual Workspace Canvas, enabling real-time diagramming and collaborative node links. Additionally, we have optimized load times by 40% for documents larger than 50MB. Added official integrations with Slack, Figma, and Jira.`,
        relevance: 0.92,
        relevanceJustification: `Core product release notes detailing new collaborative features and integration ecosystems.`
      });
    }

    // 3. User Review / Reddit / G2 Complaints Source
    if (focusComplaints || (!focusPricing && !focusFeatures)) {
      const sourceTitle = isTarget 
        ? `Is anyone else frustrated with the latest ${company} update?`
        : `Honest review: Why we migrated from ${company} to competitor products`;
      const sourceDomain = isTarget ? 'reddit.com/r/' + company.toLowerCase() : 'g2.com/products/' + company.toLowerCase();

      sources.push({
        id: `src-${index}-3`,
        company: company,
        title: `${sourceTitle} - Discussion & Reviews`,
        url: `https://${sourceDomain}/reviews-and-discussions`,
        snippet: `Users complain about ${company}'s recent UI overhaul. Issues with loading speeds, missing tags search features, and steep learning curve for the new editor interface.`,
        content: `Community feedback on ${company}. \nUser review 1: "The new UI is a step backward. They hid the search bar under three clicks, and performance has tanked since the canvas update." \nUser review 2: "Limiting the free tier to 3 projects is forcing us to migrate. We can't justify the $8/user/month cost for our small team."`,
        relevance: 0.88,
        relevanceJustification: `Unfiltered customer feedback capturing user complaints, pricing migration triggers, and UI friction points.`
      });
    }
  });

  return sources;
};

/**
 * Executes a competitor data search.
 * Uses Tavily API if apiKey is provided, otherwise generates dynamic mock data.
 */
export const searchCompetitorData = async (targetCompany, competitors, focusAreas, apiKeys = {}, onProgress = () => {}) => {
  const hasTavilyKey = apiKeys.tavily && apiKeys.tavily.startsWith('tvly-');
  
  if (!hasTavilyKey) {
    // RUN MOCK MODE
    onProgress("⚙️ 初始化 Mock 搜索引擎...", 15);
    await new Promise(r => setTimeout(r, 800));

    onProgress(`🔍 正在构建针对 [${targetCompany}] 和竞品 [${competitors.join(', ')}] 的深度搜索 Query...`, 35);
    await new Promise(r => setTimeout(r, 1200));

    onProgress("🌐 正在通过模拟爬虫获取并清洗官网 Changelog 及 G2 论坛数据...", 65);
    await new Promise(r => setTimeout(r, 1500));

    onProgress("✨ 完成数据预清洗，剥离 HTML 冗余标签，计算信源相关性得分...", 90);
    await new Promise(r => setTimeout(r, 800));

    return generateMockSources(targetCompany, competitors, focusAreas);
  }

  // RUN REAL MODE (Tavily Search API)
  try {
    onProgress("⚡ 初始化 Tavily 实时搜索引擎...", 15);
    const results = [];
    const allCompanies = [targetCompany, ...competitors];
    
    // Construct search queries based on focus areas
    const queries = [];
    allCompanies.forEach(company => {
      if (focusAreas.includes('pricing')) {
        queries.push({ company, query: `${company} pricing changes tiers 2025 2026` });
      }
      if (focusAreas.includes('features')) {
        queries.push({ company, query: `${company} product updates release notes new features` });
      }
      if (focusAreas.includes('complaints')) {
        queries.push({ company, query: `${company} complaints reviews G2 Reddit issues` });
      }
      // If nothing selected, just do a general search
      if (queries.length === 0) {
        queries.push({ company, query: `${company} latest features competitor updates` });
      }
    });

    onProgress(`🔍 生成了 ${queries.length} 个优化搜索 Query，准备执行并行检索...`, 35);
    
    // We run queries sequentially or with small delay to avoid rate limit issues in client-side testing
    for (let i = 0; i < queries.length; i++) {
      const q = queries[i];
      onProgress(`🌐 [${i + 1}/${queries.length}] 正在搜索: "${q.query}"...`, 35 + Math.floor((i / queries.length) * 50));
      
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: apiKeys.tavily,
          query: q.query,
          search_depth: 'advanced',
          max_results: 2 // Keep it to 2 per query to avoid overwhelming context
        })
      });

      if (!response.ok) {
        throw new Error(`Tavily API responded with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        data.results.forEach((res, idx) => {
          results.push({
            id: `real-${q.company.toLowerCase()}-${i}-${idx}`,
            company: q.company,
            title: res.title || `Information regarding ${q.company}`,
            url: res.url,
            snippet: res.snippet || '',
            content: res.raw_content || res.snippet || '',
            relevance: res.score || 0.8,
            relevanceJustification: `匹配检索词: "${q.query}"。信源可信度评分: ${(res.score || 0.8).toFixed(2)}。`
          });
        });
      }
    }

    onProgress("✨ 完成实时抓取，过滤无关页面，完成信源汇聚...", 95);
    return results;
  } catch (error) {
    console.error("Tavily Search Error:", error);
    onProgress(`❌ 搜索失败: ${error.message}。自动降级至模拟数据...`, 95);
    await new Promise(r => setTimeout(r, 1500));
    return generateMockSources(targetCompany, competitors, focusAreas);
  }
};

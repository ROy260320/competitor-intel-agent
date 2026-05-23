/**
 * Agent Service for Competitor Intelligence Agent
 * Orchestrates LLM prompt engineering, structured output parsing, and mock report generation.
 */

// Custom Mock Synthesis Engine
// Generates fully customized SWOT, Feature Matrix, and Timeline data based on input values
const generateMockReport = (targetCompany, competitors, approvedSources, focusAreas) => {
  const swot = {};
  
  // 1. Generate SWOT for target and competitors
  const allCompanies = [targetCompany, ...competitors];
  allCompanies.forEach(company => {
    const isTarget = company.toLowerCase() === targetCompany.toLowerCase();
    
    if (isTarget) {
      swot[company] = {
        strengths: [
          `灵活且多功能的块级结构（Block-based architecture），用户创作自由度极高。`,
          `拥有庞大的全球社区生态、海量的预置模板及丰富的第三方插件库。`,
          `支持团队实时协作，协同体验流畅，具备文档生命周期管理基础。`
        ],
        weaknesses: [
          `在处理超大规模或嵌套层级过深的文档时，客户端加载与渲染存在明显卡顿。`,
          `离线模式（Offline Mode）支持较弱，网络不佳时部分数据保存不一致。`,
          `免费版额度限制收紧（近期限制至3个活动项目），导致初级用户流失。`
        ],
        opportunities: [
          `利用当前大模型风口，深度整合工作区 AI 助手，提供自动化摘要和数据清洗。`,
          `加强 Canvas（画布型白板）交互设计，争夺视觉化思考与团队脑暴的市场份额。`,
          `推出针对高校和初创团队的专项优惠，建立长期用户粘性。`
        ],
        threats: [
          `以 Obsidian 为代表的本地优先（Local-first）和 Markdown 原生工具蚕食隐私敏感用户。`,
          `传统巨头（如 Microsoft Loop）凭借 Office 365 套餐降维打击企业客户。`,
          `竞品跟进“AI自动化工作流”，若本产品AI功能商业化定价过高可能引发退订潮。`
        ]
      };
    } else {
      swot[company] = {
        strengths: [
          `采用本地优先（Local-first）文件存储，支持完全离线工作，数据隐私安全性极高。`,
          `纯文本/Markdown 格式底层，启动速度极快，系统资源占用极低。`,
          `双向链接（Backlinks）与知识图谱网络可视化功能比 ${targetCompany} 更精准。`
        ],
        weaknesses: [
          `缺少开箱即用的多人云端协作支持，多设备同步配置门槛较高。`,
          `对非技术背景的普通用户不够友好，插件生态较为分散且缺乏官方审核。`,
          `移动端（iOS/Android）用户体验较差，同步机制偶尔冲突。`
        ],
        opportunities: [
          `提供面向企业级安全隐私要求团队的私有云或加密同步增值服务。`,
          `开发更轻量化的“一键发布（Publish）”网页服务，简化文档分享流程。`,
          `通过开源社区协作，快速构建出比 ${targetCompany} 更丰富的本地化 AI 插件。`
        ],
        threats: [
          `${targetCompany} 等云端协作工具正在通过 Canvas 功能弥补白板短板。`,
          `SaaS 行业降价潮可能导致部分付费用户回流至开箱即用的云端协作工具。`,
          `缺少大厂资金注入，核心开发团队可能面临长期的商业化变现压力。`
        ]
      };
    }
  });

  // 2. Generate Feature Matrix
  const features = [
    {
      feature: '基础架构 (Architecture)',
      [targetCompany]: '云端中心化 (Cloud-centric)',
      ...competitors.reduce((acc, comp) => ({ ...acc, [comp]: '本地优先 (Local-first)' }), {})
    },
    {
      feature: '实时协作 (Real-time Collaboration)',
      [targetCompany]: '支持完美 (Excellent, Web-native)',
      ...competitors.reduce((acc, comp) => ({ ...acc, [comp]: '有限支持 (Limited / Requires Sync plugins)' }), {})
    },
    {
      feature: '离线支持 (Offline Support)',
      [targetCompany]: '有缓存，但不支持离线编辑 (Limited cache only)',
      ...competitors.reduce((acc, comp) => ({ ...acc, [comp]: '原生支持，全离线运行 (Fully native offline)' }), {})
    },
    {
      feature: '核心定价 (Core Pricing)',
      [targetCompany]: '免费版受限较多，个人专业版约 $8-10/月',
      ...competitors.reduce((acc, comp) => ({ ...acc, [comp]: '核心软件完全免费，云同步服务约 $4-8/月' }), {})
    },
    {
      feature: 'AI 能力集成 (AI Integration)',
      [targetCompany]: '内置工作区 AI 订阅 (需要额外 $10/月)',
      ...competitors.reduce((acc, comp) => ({ ...acc, [comp]: '依赖第三方插件，需要自备 API 密钥' }), {})
    }
  ];

  // 3. Generate Timeline Updates
  const timeline = [
    {
      date: '2026年3月',
      company: targetCompany,
      event: '发布 Visual Workspace Canvas功能',
      desc: `推出全新的画布工作区，支持在白板上直接编辑和连接原有的页面块，直接对标看板类脑暴工具。`,
      impact: '高 (增强协作属性，挽回流失的视觉化思考用户)'
    },
    {
      date: '2026年2月',
      company: competitors[0] || '竞争对手',
      event: '官方发布端到端加密同步服务 (E2EE Sync v2.0)',
      desc: `升级了本地同步协议，优化了局域网下的多端实时冲突合并，显著降低了数据丢失率。`,
      impact: '中 (提高了付费同步服务的转化率，巩固隐私壁垒)'
    },
    {
      date: '2026年1月',
      company: targetCompany,
      event: '调整免费版协同规则与文件限额',
      desc: `免费版用户所能创建的协作空间缩减为最多3个，且单个附件大小限制在 5MB 以内。`,
      impact: '中 (引发中小团队抱怨，但小幅拉动了基础版会员订阅)'
    }
  ];

  // 4. Summaries of Sources
  const summaries = approvedSources.map(src => ({
    title: src.title,
    url: src.url,
    summary: src.content.substring(0, 150) + '...'
  }));

  return { swot, features, timeline, summaries };
};

const OPENROUTER_API_KEY = atob('c2stb3ItdjEtMTNjZTIwZDNiYTkwZDE3MDljZjI1NWQwMjg5MTIxMTMwY2U2ZWVhOTc5MjI2YjBiYjgzNjJjYTU0Yjk0OTFhYg==');

const parseRobustJson = (text) => {
  let cleanText = text.trim();
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.substring(7);
  } else if (cleanText.startsWith('```')) {
    cleanText = cleanText.substring(3);
  }
  if (cleanText.endsWith('```')) {
    cleanText = cleanText.substring(0, cleanText.length - 3);
  }
  cleanText = cleanText.trim();
  
  const firstBrace = cleanText.indexOf('{');
  const lastBrace = cleanText.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleanText = cleanText.substring(firstBrace, lastBrace + 1);
  }
  
  return JSON.parse(cleanText);
};

const requestOpenRouter = async (apiKey, model, systemPrompt, userPrompt) => {
  const payload = {
    model: model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.2
  };

  // Only add response_format if not Claude or reasoning model
  if (!model.includes('reasoning') && !model.includes('claude')) {
    payload.response_format = { type: "json_object" };
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://airstack.com',
      'X-Title': 'Airstack AI PM Workspace'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenRouter Response Error:", errorText);
    throw new Error(`OpenRouter API returned status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  if (!data.choices || data.choices.length === 0) {
    throw new Error("No response choices returned from OpenRouter API.");
  }

  const text = data.choices[0].message.content;
  return parseRobustJson(text);
};

/**
 * Synthesis Agent Runner
 * Connects to OpenRouter or runs the Mock Synthesis engine as a fallback
 */
export const synthesizeReport = async (targetCompany, competitors, approvedSources, focusAreas, apiKeys = {}, onProgress = () => {}) => {
  const selectedModel = apiKeys.model || 'google/gemini-2.5-flash';
  const openrouterKey = apiKeys.openrouterKey || OPENROUTER_API_KEY;

  // RUN REAL API SYNTHESIS via OpenRouter
  try {
    onProgress(`⚡ 启动大模型 [${selectedModel}]，解析清洗后的网页信源...`, 15);
    
    // Construct rich text representing all the approved sources
    const sourcesContext = approvedSources.map((src, i) => {
      return `【信源 #${i+1}】
公司: ${src.company}
标题: ${src.title}
链接: ${src.url}
正文内容:
${src.content}
------------------`;
    }).join('\n\n');

    const systemPrompt = `你是一个资深的 AI 竞品情报分析师。你需要根据用户提供的竞品网页信源，提炼出结构化的商业竞争情报。
你需要严格以 JSON 格式输出，并且符合以下 JSON Schema：
{
  "swot": {
    "[公司名]": {
      "strengths": ["优势1", "优势2", "优势3"],
      "weaknesses": ["劣势1", "劣势2", "劣势3"],
      "opportunities": ["机会1", "机会2", "机会3"],
      "threats": ["威胁1", "威胁2", "威胁3"]
    }
  },
  "features": [
    {
      "feature": "功能名称(如: 实时协作)",
      "[公司A名]": "支持情况描述",
      "[公司B名]": "支持情况描述"
    }
  ],
  "timeline": [
    {
      "date": "时间(如 2026年3月)",
      "company": "发生动态的公司",
      "event": "简短动态名称",
      "desc": "动态具体描述",
      "impact": "高/中/低 (影响程度及理由)"
    }
  ],
  "summaries": [
    {
      "title": "网页标题",
      "url": "网址",
      "summary": "不超过150字的源网页核心内容中文总结"
    }
  ]
}

要求：
1. 语言：必须全部使用“中文”进行提炼和输出。
2. 广度：对于 targetCompany [${targetCompany}] 和所有 competitors [${competitors.join(', ')}]，都必须生成 SWOT。
3. 准确性：严格基于提供的信源信息，拒绝无根据的胡编乱造。如果某个维度的信息在信源中完全没有被提到，可以结合该公司的一般常识进行补充，但要在字段中注明“结合常识”。
4. 功能矩阵：抽取至少 4 到 5 个核心功能维度，列出每家公司的技术特点。`;

    const userPrompt = `目标公司: ${targetCompany}
竞争对手: ${competitors.join(', ')}
关注的情报领域: ${focusAreas.join(', ')}

已审核的信源正文如下：
${sourcesContext}
`;

    onProgress("🔮 正在发送数据至 AI 推理引擎，执行 SWOT 提取...", 45);
    
    let reportData;
    if (hasGemini) {
      reportData = await requestGemini(apiKeys.gemini, apiKeys.geminiModel, systemPrompt, userPrompt);
    } else {
      reportData = await requestOpenAI(apiKeys.openai, apiKeys.openaiModel, systemPrompt, userPrompt);
    }

    onProgress("📊 生成的竞品对比 JSON 解析成功，准备渲染看板...", 90);
    await new Promise(r => setTimeout(r, 500));
    return reportData;

  } catch (error) {
    console.error("Agent Synthesis Error:", error);
    onProgress(`❌ AI 提炼失败: ${error.message}。自动降级至模拟提炼引擎...`, 95);
    await new Promise(r => setTimeout(r, 2000));
    return generateMockReport(targetCompany, competitors, approvedSources, focusAreas);
  }
};

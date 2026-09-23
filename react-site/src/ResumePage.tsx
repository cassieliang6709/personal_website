import './resume.css';

const experience=[
 {date:'2025 — NOW',title:'独立开发者',meta:'AI / iOS / Web 产品',body:'独立完成 MindBridge、1Day、Vance、CorpCheck 等产品的研究、设计、开发与发布。'},
 {date:'2023.06 — 2024.12',title:'Deloitte 德勤',meta:'审计助理',body:'我做了两年审计，服务过医药、奢侈品、互联网大厂和新能源企业，也因此更习惯从证据、流程和风险里理解问题。'},
];

const education=[
 {date:'预计 2027.12',title:'Northeastern University',body:'人工智能硕士 · 生成式 AI 课程研究生助教'},
 {date:'2023.06',title:'上海财经大学',body:'会计学学士 · 华为奖学金 · 人民奖学金'},
];

export function ResumePage(){
 return <div className="resume-page">
  <section className="resume-intro">
   <p className="eyebrow">ABOUT / 简历</p>
   <h1>你好，我是 Cassie <span aria-hidden="true">👋</span></h1>
   <p>我在 San Jose 学习人工智能，也独立设计、开发和发布自己的产品。目前主要做 AI 应用、iOS 和浏览器工具。</p>
   <nav aria-label="联系与简历">
    <a className="resume-primary" href="mailto:liangyue3666@gmail.com">发个邮件 ↗</a>
    <a href="../../assets/resume/Cassie-SDE-CN.pdf" target="_blank">下载完整简历 ↓</a>
    <a href="https://github.com/cassieliang6709" target="_blank" rel="noreferrer">GitHub ↗</a>
   </nav>
  </section>

  <div className="resume-columns">
   <section className="resume-section">
    <h2><span aria-hidden="true">▣</span> 经历</h2>
    <div className="resume-list">{experience.map(item=><article key={item.title}><time>{item.date}</time><div><h3>{item.title}<small>{item.meta}</small></h3><p>{item.body}</p></div></article>)}</div>
    <h2 className="resume-subheading"><span aria-hidden="true">◆</span> 代表作品</h2>
    <div className="resume-projects"><a href="?project=mindbridge#work"><strong>MindBridge</strong><span>本地优先的长期记忆引擎</span></a><a href="?project=1day#work"><strong>1Day</strong><span>协作视频日记 iOS App</span></a><a href="?project=vance#work"><strong>Vance</strong><span>可执行训练计划的 AI 健身搭子</span></a></div>
   </section>

   <aside className="resume-aside">
    <section><h2><span aria-hidden="true">◒</span> 教育</h2>{education.map(item=><article key={item.title}><time>{item.date}</time><h3>{item.title}</h3><p>{item.body}</p></article>)}</section>
    <section><h2><span aria-hidden="true">⌘</span> 常用工具</h2><p>Python · FastAPI · PostgreSQL · TypeScript · React · SwiftUI · Docker · Figma · Codex</p></section>
    <section className="resume-looking"><h2><span aria-hidden="true">◎</span> 正在找工作</h2><p>我正在积极寻找 AI 应用研发或产品工程相关机会。如果你觉得我适合你的团队，欢迎直接联系我。</p><a href="mailto:liangyue3666@gmail.com">联系我 ↗</a><p className="resume-side-quest"><small>SIDE QUEST</small><span>正在进行一轮 50 元天使融资，欢迎 V 我 50。</span></p></section>
    <section><h2><span aria-hidden="true">✦</span> 一直在折腾</h2><p>没有“工作之外”——不是在工作，就是在尝试工作。</p></section>
   </aside>
  </div>
 </div>;
}

import {t} from './i18n';
import './resume.css';

const experience=[
 {date:'2025 — NOW',title:t('独立开发者','Independent developer'),meta:t('AI / iOS / Web 产品','AI / iOS / Web products'),body:t('独立完成 MindBridge、1Day、Vance、CorpCheck 等产品的研究、设计、开发与发布。','Researched, designed, built, and shipped MindBridge, 1Day, Vance, CorpCheck, and more on my own.')},
 {date:'2023.06 — 2024.12',title:t('Deloitte 德勤','Deloitte'),meta:t('审计助理','Audit associate'),body:t('我做了两年审计，服务过医药、奢侈品、互联网大厂和新能源企业，也因此更习惯从证据、流程和风险里理解问题。','Two years in audit across pharma, luxury, big tech, and new energy clients. It taught me to understand problems through evidence, process, and risk.')},
];

const education=[
 {date:t('预计 2027.12','Expected 2027.12'),title:'Northeastern University',body:t('人工智能硕士 · 生成式 AI 课程研究生助教','M.S. Artificial Intelligence · Graduate TA, Generative AI')},
 {date:'2023.06',title:t('上海财经大学','Shanghai University of Finance and Economics'),body:t('会计学学士 · 华为奖学金 · 人民奖学金','B.A. Accounting · Huawei Scholarship · People\'s Scholarship')},
];

export function ResumePage(){
 return <div className="resume-page">
  <section className="resume-intro">
   <p className="eyebrow">{t('ABOUT / 简历','ABOUT / RESUME')}</p>
   <h1>{t('你好，我是 Yue',"Hi, I'm Yue")} <span aria-hidden="true">👋</span></h1>
   <p>{t('我在 San Jose 学习人工智能，也独立设计、开发和发布自己的产品。目前主要做 AI 应用、iOS 和浏览器工具。','I study AI in San Jose and design, build, and ship my own products. Right now that means AI apps, iOS, and browser tools.')}</p>
   <nav aria-label={t('联系与简历','Contact and resume')}>
    <a className="resume-primary" href="mailto:liangyue3666@gmail.com">{t('发个邮件 ↗','Email me ↗')}</a>
    <a href={t('/assets/resume/Cassie-SDE-CN.pdf','/assets/resume/Cassie-SDE-EN.pdf')} target="_blank">{t('下载完整简历 ↓','Download resume ↓')}</a>
    <a href="https://github.com/cassieliang6709" target="_blank" rel="noreferrer">GitHub ↗</a>
   </nav>
  </section>

  <div className="resume-columns">
   <section className="resume-section">
    <h2><span aria-hidden="true">▣</span> {t('经历','Experience')}</h2>
    <div className="resume-list">{experience.map(item=><article key={item.title}><time>{item.date}</time><div><h3>{item.title}<small>{item.meta}</small></h3><p>{item.body}</p></div></article>)}</div>
    <h2 className="resume-subheading"><span aria-hidden="true">◆</span> {t('代表作品','Selected work')}</h2>
    <div className="resume-projects"><a href="#flagship"><strong>1Day</strong><span>{t('协作视频日记 iOS App','Collaborative video diary for iOS')}</span></a><a href="#flagship"><strong>Tabspace</strong><span>{t('把散乱标签页收进一个工作台','Gather scattered tabs into one workspace')}</span></a></div>
   </section>

   <aside className="resume-aside">
    <section><h2><span aria-hidden="true">◒</span> {t('教育','Education')}</h2>{education.map(item=><article key={item.title}><time>{item.date}</time><h3>{item.title}</h3><p>{item.body}</p></article>)}</section>
    <section><h2><span aria-hidden="true">⌘</span> {t('常用工具','Tools')}</h2><p>Python · FastAPI · PostgreSQL · TypeScript · React · SwiftUI · Docker · Figma · Codex</p></section>
    <section className="resume-looking"><h2><span aria-hidden="true">◎</span> {t('正在找工作','Open to work')}</h2><p>{t('我正在积极寻找 AI 应用研发或产品工程相关机会。如果你觉得我适合你的团队，欢迎直接联系我。','I am looking for roles in AI application development or product engineering. If I sound like a fit for your team, reach out directly.')}</p><a href="mailto:liangyue3666@gmail.com">{t('联系我 ↗','Contact me ↗')}</a><p className="resume-side-quest"><small>SIDE QUEST</small><span>{t('正在进行一轮 50 元天使融资，欢迎 V 我 50。','Currently raising a ¥50 angel round. Chip in ¥50.')}</span></p></section>
    <section><h2><span aria-hidden="true">✦</span> {t('一直在折腾','Always tinkering')}</h2><p>{t('没有“工作之外”——不是在工作，就是在尝试工作。','There is no "outside of work". I am either working or trying out new work.')}</p></section>
   </aside>
  </div>
 </div>;
}

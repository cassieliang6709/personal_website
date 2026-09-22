import { useState } from 'react';
import { CompatiblePass } from './App.jsx';
import desk from '../../assets/room-spec/projects-v2.webp';
import timeline from '../../assets/room-spec/timeline.webp';
import './studio-demo.css';

const cities = [
  {name:'哈密', en:'HAMI', date:'18 岁以前', theme:'好奇心', color:'#728068', position:'28% 38%', body:'我在哈密长大。在 B 站学修手机、学日系折纸，也在贴吧给陌生人做动态签名图。对什么好奇，就自己去找来学。', note:'2018 年，我离开新疆去上海读会计。带走的是一种学习方式：碰到感兴趣的东西，就先试着弄懂。'},
  {name:'上海', en:'SHANGHAI', date:'2018—2024', theme:'产品、数据与证据', color:'#8f6871', position:'46% 44%', body:'在上海财经大学读国际会计，先后在盒马、KnowYourself、美团和德勤工作。理解用户、用数据拆解问题，再确认结论有没有证据。', note:'从产品运营到产品经理、商业分析和审计，我第一次把自己写的 Python 工具放进真实工作流。'},
  {name:'杭州', en:'HANGZHOU', date:'2025', theme:'从 0 到 1', color:'#b08451', position:'66% 52%', body:'离开德勤后，我去了杭州，注册公司、开网店、参加创业比赛。开始认真学 coding，把文档里的想法做成真正能打开的产品。', note:'创业社群和黑客松给了我快速反馈，也让我开始练习：完成、交付和维护，再开始下一个想法。'},
  {name:'San Jose', en:'SAN JOSE', date:'2025—现在', theme:'视野与技术', color:'#587e88', position:'86% 61%', body:'在 Northeastern 读人工智能硕士，也在 Smith-Kettlewell 参与 YouDescribe，为盲人和低视力用户生成视频画面描述。', note:'从算法、NLP 和计算机基础重新学习，也让“用户”成为一个具体的人。'}
];
const products = [
  {name:'Tabspace', symbol:'▦', status:'已上架 · Chrome', desc:'把散乱的标签页，收进一个可以预览和整理的工作台。', why:'来自浏览器里越积越多的标签页。', how:'先呈现，再由人决定如何整理，保留对浏览器的控制。', href:'https://cassieliang6709.github.io/tabspace-site/'},
  {name:'1Day', symbol:'◷', status:'App Store · v1.1', desc:'记录几个短瞬间，在设备端拼成属于这一天的短片。', why:'想把一天留住，又不想先学会剪辑。', how:'支持 2 / 5 / 10 秒片段，也可以用邀请码与朋友共同拍摄。', href:'https://apps.apple.com/app/id6794565199'},
  {name:'Cassie Capture', symbol:'▤', status:'发布包已准备', desc:'为长网页文档设计的截图工具，让长内容也能可靠保存。', why:'来自反复崩溃、导出空白的长截图。', how:'截图逐帧写入 IndexedDB，收到确认后再继续，控制内存占用。', href:'https://github.com/cassieliang6709/cassie-capture'},
  {name:'YouDescribe', symbol:'◉', status:'Research · Smith-Kettlewell', desc:'把视频画面转成音频描述，让更多人听见画面里的故事。', why:'描述需要避开原片对话，还要在有限时间里念完。', how:'参与生成链路、FastAPI 服务与 React 审核编辑器，让人保留最终判断。', href:'https://youdescribe.org/'}
];

export default function Studio() {
  const [scene,setScene]=useState('works');
  const [selected,setSelected]=useState(0);
  const [hovered,setHovered]=useState(null);
  const [product,setProduct]=useState(0);
  const c=cities[selected], p=products[product];
  return <div className="portfolio-demo">
    <header className="studio-nav"><a href="https://liangyue.site/" className="studio-brand"><img src="/cassie-avatar.png" alt=""/>Cassie Liang<span>个人工作室</span></a><nav aria-label="场景"><button aria-pressed={scene==='works'} onClick={()=>setScene('works')}>01 工作台</button><button aria-pressed={scene==='travel'} onClick={()=>setScene('travel')}>02 走过的路</button></nav><a className="say-hi" href="mailto:liangyue3666@gmail.com">写信 ↗</a></header>
    <main className="studio-main">
      <div className="studio-heading"><div><p className="eyebrow">{scene==='works'?'THE WORKBENCH / SELECTED WORK':'TRAVEL NOTES / FOUR CHAPTERS'}</p><h1>{scene==='works'?'把想法，做成能用的东西。':'一路走，也一路重新认识自己。'}</h1></div><p>{scene==='works'?'一些从日常问题长出来的产品，和它们还在继续的故事。':'从哈密到上海、杭州，再到 San Jose。选一张卡片，翻开那一段经历。'}</p></div>
      {scene==='works'? <section className="work-layout" aria-label="工作台">
        <div className="work-picture"><img className="desk-image" src={desk} alt="Cassie 的工作桌，桌面陈列着代表作品的物件"/><span className="room-caption">CASSIE'S STUDIO · OPEN FOR IDEAS</span><div className="desk-pass"><CompatiblePass interactive/></div><span className="pass-caption">我的工作牌 · 拖一下</span></div>
        <div className="product-notebook"><p className="eyebrow">ON MY DESK · 04</p><div className="product-tabs" aria-label="选择作品">{products.map((item,i)=><button key={item.name} aria-pressed={product===i} onClick={()=>setProduct(i)}><span>{item.symbol}</span>{item.name}<small>0{i+1}</small></button>)}</div><article key={p.name} className="product-story"><small className="product-status">{p.status}</small><h2>{p.name}</h2><p className="product-desc">{p.desc}</p><dl><dt>为什么做</dt><dd>{p.why}</dd><dt>怎么做</dt><dd>{p.how}</dd></dl><a href={p.href} target="_blank" rel="noreferrer">去看看 {p.name} ↗</a></article></div>
      </section>:<section className="travel-layout" aria-label="城市旅行卡">
        <div className="travel-table"><p className="table-label">PLACES THAT SHAPED ME <span>01 — 04</span></p><div className="bounce-deck" onMouseLeave={()=>setHovered(null)}>{cities.map((item,i)=>{const focus=hovered??selected;return <button key={item.en} className={`travel-ticket ${selected===i?'selected':''}`} style={{'--x':`${(i-1.5)*115+(i<focus?-32:i>focus?32:0)}px`,'--angle':`${i===focus?0:[-12,-5,6,13][i]}deg`,'--lift':i===focus?'-26px':'0px','--order':i,'--accent':item.color,zIndex:i===focus?6:i+1}} aria-pressed={selected===i} onMouseEnter={()=>setHovered(i)} onFocus={()=>setHovered(i)} onBlur={()=>setHovered(null)} onClick={()=>setSelected(i)}><div className="ticket-photo" style={{backgroundImage:`url(${timeline})`,backgroundPosition:item.position}}/><div className="ticket-body"><span className="ticket-number">CHAPTER 0{i+1} <span>↗</span></span><h2>{item.name}</h2><span className="ticket-city">{item.en}</span><div className="ticket-tear"/><p>{item.theme}</p><span className="ticket-date">{item.date}</span></div></button>})}</div><p className="travel-instruction">四座城市，四段经历。<span>点击卡片阅读 →</span></p></div>
        <article className="travel-story" key={c.en} aria-live="polite"><p className="eyebrow">CHAPTER 0{selected+1} / {c.date}</p><h2>{c.name}<span>{c.theme}</span></h2><p>{c.body}</p><p>{c.note}</p><div className="chapter-navigation"><button disabled={selected===0} onClick={()=>setSelected(selected-1)}>← 上一站</button><span>0{selected+1} / 04</span><button disabled={selected===3} onClick={()=>setSelected(selected+1)}>下一站 →</button></div></article>
      </section>}
      <footer className="studio-footer"><span>YUE (CASSIE) LIANG</span><span>有好奇心，也有正在做的事。</span><a href="https://github.com/cassieliang6709" target="_blank" rel="noreferrer">GitHub ↗</a></footer>
    </main>
  </div>;
}

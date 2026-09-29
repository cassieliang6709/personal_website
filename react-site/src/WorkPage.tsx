import {lazy,Suspense,useEffect,useRef,useState,type CSSProperties} from 'react';
import cassieCard from './assets/lanyard/cassie-card.png';
import cassieBand from './assets/lanyard/cassie-band.png';
import cassieCardFront from './assets/lanyard/cassie-card-front.webp';
import {productLogoById} from './productAssets';
import studioHome from '../../assets/room-spec/home-stage-theatre.webp';
import studioAbout from '../../assets/room-spec/about.webp';
import studioTimeline from '../../assets/room-spec/timeline.webp';
import studioProjects from '../../assets/room-spec/projects-v2.webp';
import studioWriting from '../../assets/room-spec/writing-v2.webp';
import {projects} from './projects';
import {lang,t} from './i18n';
import './work.css';

const Lanyard=lazy(()=>import('./Lanyard.jsx'));

function LanyardIdentity(){
 const [interactive,setInteractive]=useState(()=>typeof window!=='undefined'&&!matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setInteractive(!media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 if(!interactive)return <div className="lanyard-wrap is-static" aria-label={t('Yue 的工作身份牌',"Yue's work pass")}><span className="lanyard-line"/><img className="identity-pass-flat" src={cassieCardFront} alt="" width="520" height="785"/></div>;
 return <div className="lanyard-three" aria-label={t('Yue 的 3D 工作身份牌，可以拖动',"Yue's 3D work pass, draggable")}><Suspense fallback={<div className="lanyard-loading">{t('正在挂上工作牌…','Hanging up the pass…')}</div>}><Lanyard position={[0,0,16]} gravity={[0,-40,0]} fov={20} cardImage={cassieCard} lanyardImage={cassieBand}/></Suspense></div>;
}

// Product cards link straight to each project's own website.
const officialSites:Record<string,string>={
 '1day':t('https://1day.liangyue.site/zh','https://1day.liangyue.site/'),
 tabspace:'https://cassieliang6709.github.io/tabspace-site/',
};

// Tilt toward the pointer with a light that follows it (React Bits Tilted Card + Spotlight Card).
function ProductPass({project,index}:{project:(typeof projects)[number];index:number}){
 const ref=useRef<HTMLAnchorElement>(null);
 const move=(e:React.PointerEvent<HTMLAnchorElement>)=>{
  const el=ref.current;if(!el||e.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  el.style.setProperty('--rx',`${(0.5-y)*16}deg`);el.style.setProperty('--ry',`${(x-0.5)*16}deg`);
  el.style.setProperty('--mx',`${x*100}%`);el.style.setProperty('--my',`${y*100}%`);el.classList.add('is-tilting','is-hover');
 };
 const leave=()=>{const el=ref.current;if(!el)return;el.classList.remove('is-tilting','is-hover');el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')};
 return <a ref={ref} className="product-pass" href={officialSites[project.id]} target="_blank" rel="noreferrer" onPointerMove={move} onPointerLeave={leave} style={{'--accent':project.accent,'--tilt':`${index?4:-4}deg`} as CSSProperties}>
  <span className="pass-art"><img src={productLogoById[project.id]} alt=""/></span>
  <small>0{index+1} · {project.category}</small><strong>{project.name}</strong><em>{project.description}</em>
  <span className="pass-link">{t('官网 ↗','Website ↗')}</span>
 </a>;
}

function ProductPasses(){
 const visible=projects.filter(project=>project.id in officialSites);
 return <><div className="product-passes">{visible.map((project,i)=><ProductPass key={project.id} project={project} index={i}/>)}</div></>;
}

const studioRooms=[
 {label:t('主房间','Main room'),caption:t('最初的个人主页：从房间里的物件开始认识我。','My first homepage: meet me through the objects in a room.'),image:studioHome},
 {label:t('床边','Bedside'),caption:t('关于我、好奇心和一路留下来的个人笔记。','About me, curiosity, and personal notes along the way.'),image:studioAbout},
 {label:t('照片墙','Photo wall'),caption:t('哈密、上海、杭州与 San Jose 的时间线。','A timeline of Hami, Shanghai, Hangzhou, and San Jose.'),image:studioTimeline},
 {label:t('工作台','Workbench'),caption:t('产品、工作牌，以及当时做过的各种小东西。','Products, the work pass, and small things I made back then.'),image:studioProjects},
 {label:t('阅读角','Reading nook'),caption:t('文章、漫画和生活记录放在这间书房里。','Articles, comics, and life notes live in this study.'),image:studioWriting},
];

function StudioArchive(){
 const [open,setOpen]=useState(false),[room,setRoom]=useState(0);const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(!open){dialog.current?.close();return}const overflow=document.body.style.overflow;dialog.current?.showModal();document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow}},[open]);
 const close=()=>{dialog.current?.close();setOpen(false)};
 return <><button className="studio-entry" type="button" onClick={()=>setOpen(true)}><img src={studioHome} alt=""/><span><small>FROM THE ARCHIVE</small><strong>{t('打开插画旧工作室','Open the old illustrated studio')}</strong></span><i aria-hidden="true">↗</i></button><dialog ref={dialog} className="studio-dialog" aria-labelledby="studio-title" onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)close()}}><header><div><small>ILLUSTRATED STUDIO · ARCHIVE</small><h2 id="studio-title">{t('以前的奇迹暖暖风格主页','My old dress-up-game style homepage')}</h2></div><button type="button" onClick={close} aria-label={t('关闭旧工作室','Close the old studio')}>×</button></header><div className="studio-dialog-body"><figure><img src={studioRooms[room].image} alt={t(`${studioRooms[room].label}插画场景`,`${studioRooms[room].label} illustration`)}/><figcaption>{studioRooms[room].caption}</figcaption></figure><nav aria-label={t('切换旧工作室房间','Switch studio room')}>{studioRooms.map((item,index)=><button type="button" key={item.label} aria-pressed={room===index} onClick={()=>setRoom(index)}>{item.label}</button>)}</nav></div></dialog></>;
}

export function StudioArchiveFooter(){return <aside className="studio-archive-footer" aria-label={t('旧版主页存档','Old homepage archive')}><StudioArchive/></aside>}

export function WorkPage({showArchive=true}:{showArchive?:boolean}){
 return <div className="work-page">
  <section className="work-hero"><div className="hero-copy"><p className="eyebrow">{t('YUE (CASSIE) LIANG / 梁悦','YUE (CASSIE) LIANG')}</p>{lang==='en'?<h1>AI student.<br/>Indie builder of <em>1Day</em>.</h1>:<h1>AI 学生，<br/><em>1Day</em> 的独立开发者。</h1>}<p>{t('我在 San Jose 学习人工智能，也独立设计、开发和发布自己的产品。现在主要在做 AI 应用、iOS 和浏览器工具。','I study AI in San Jose and design, build, and ship my own products. Right now that means AI apps, iOS, and browser tools.')}</p><nav><a className="button-primary" href="#flagship">{t('看作品 ↓','See my work ↓')}</a><a href="#resume">{t('关于我 ↗','About me ↗')}</a><a href="https://github.com/cassieliang6709" target="_blank" rel="noreferrer">GitHub ↗</a></nav></div><div className="hero-object" aria-label={t('Yue 的工作身份牌',"Yue's work pass")}><LanyardIdentity/></div></section>
  <section id="flagship" className="product-library"><header><p className="eyebrow">PRODUCTS / 01—02</p><h2>{t('先放这两个。','Two to start.')}</h2><span>{t('点卡片去项目官网。','Each card opens the project website.')}</span></header><ProductPasses/></section>
  {showArchive&&<StudioArchiveFooter/>}
 </div>;
}

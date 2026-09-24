import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {cityStories} from './cityStories';
import cities from './assets/albums/travel-cities.webp';
import room from '../../assets/room-spec/writing-v2.webp';
import studioHome from '../../assets/room-spec/home-stage-theatre.webp';
import studioAbout from '../../assets/room-spec/about.webp';
import studioProjects from '../../assets/room-spec/projects-v2.webp';
import studioWriting from '../../assets/room-spec/writing-v2.webp';
import timelineRoom from '../../assets/room-spec/timeline.webp';
import workbench from './assets/albums/workbench.webp';
import captureDetail from './assets/albums/capture-detail.webp';
import worksRoom from './assets/albums/works-room.webp';
import storyRoute from './assets/albums/story-route.webp';
import writingRoom from './assets/albums/writing-room.webp';
import comicOne from '../../assets/comics/mushroom/episode-1/01.webp';
import comicTwo from '../../assets/comics/mushroom/episode-1/03.webp';
import comicThree from '../../assets/comics/mushroom/episode-1/05.webp';
import {ReadingCorner} from './ReadingCorner';
import {PolaroidDesk} from './PolaroidDesk';
import './life.css';

const chapters=[{id:'hami',name:'哈密',en:'HAMI',date:'18 岁以前'},{id:'shanghai',name:'上海',en:'SHANGHAI',date:'2018—2024'},{id:'hangzhou',name:'杭州',en:'HANGZHOU',date:'2025'},{id:'sanjose',name:'San Jose',en:'SAN JOSE',date:'2025—现在'}] as const;

function TravelPassDeck(){
 const [selected,setSelected]=useState<number|null>(null),[hover,setHover]=useState<number|null>(null);const dialog=useRef<HTMLDialogElement>(null);const active=hover;const story=selected===null?null:cityStories[chapters[selected].id];
 useEffect(()=>{if(selected===null){dialog.current?.close();return}const overflow=document.body.style.overflow;dialog.current?.showModal();document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow}},[selected]);
 const close=()=>{dialog.current?.close();setSelected(null)};
 return <><div className="travel-deck" onPointerLeave={()=>setHover(null)}>{chapters.map((item,i)=><button key={item.id} className="city-pass" aria-haspopup="dialog" onClick={()=>setSelected(i)} onPointerEnter={()=>setHover(i)} onFocus={()=>setHover(i)} onBlur={()=>setHover(null)} style={{'--x':`${(i-1.5)*150+(active===null?0:i<active?-18:i>active?18:0)}px`,'--angle':`${i===active?0:[-8,-3,3,8][i]}deg`,'--lift':i===active?'-60px':`${[30,6,6,30][i]}px`,zIndex:i===active?6:i} as CSSProperties}><div className="city-art" style={{backgroundImage:`url(${cities})`,backgroundPosition:`${i%2*100}% ${Math.floor(i/2)*100}%`}}/><small>CHAPTER 0{i+1}</small><strong>{item.name}</strong><span>{item.en}</span><em>{item.date}</em></button>)}</div><p className="travel-instruction">点开一张 Travel Pass，读这一段完整故事。</p><dialog ref={dialog} className="reading-sheet city-sheet" aria-labelledby="city-title" onClose={()=>setSelected(null)} onClick={e=>{if(e.target===e.currentTarget)close()}}>{story&&<><header><div><p className="eyebrow">{story.meta[0]}</p><h2 id="city-title">{story.title[0]}</h2></div><button onClick={close} aria-label="关闭城市故事">×</button></header><div className="reading-sheet-body"><p>{story.body[0]}</p>{story.extra.map((p,i)=><p key={i}>{p[0]}</p>)}<blockquote>{story.quote[0]}</blockquote></div></>}</dialog></>;
}

const memoryAlbums=[
 {id:'places',name:'走过的路',meta:'4 张 · 2018—现在',images:[cities,timelineRoom,studioAbout,studioHome],captions:['四座城市','照片墙','一路留下来的东西','从这里出发']},
 {id:'studio',name:'插画工作室',meta:'4 张 · ARCHIVE',images:[studioHome,studioAbout,studioProjects,studioWriting],captions:['主房间','床边','工作台','阅读角']},
 {id:'making',name:'做东西的痕迹',meta:'4 张 · WIP',images:[workbench,captureDetail,worksRoom,storyRoute],captions:['我的工作台','Cassie Capture','作品房间','故事路线']},
 {id:'stories',name:'小蘑菇',meta:'4 张 · COMIC',images:[writingRoom,comicOne,comicTwo,comicThree],captions:['故事从阅读角开始','第一格','路上遇见的事','还会继续']},
];

export function LifePage({embedded=false}:{embedded?:boolean}={}){return <div className={`life-page${embedded?' is-home-section':''}`}>
 {!embedded&&<section className="life-hero"><div><p className="eyebrow">LIFE / 生活与想法</p><h1>我走过的地方，<br/>也塑造了我做东西的方式。</h1><p>城市、文章和一些不太安静的念头，都收在这里。</p></div><figure><img src={room} alt="Yue 坐在靠窗的阅读角，身边是书架和浅木色书桌"/><figcaption>READING ROOM · 2026</figcaption></figure></section>}
 <section id="life" className="life-section travel-section"><header><p className="eyebrow">01 / PLACES</p><h2>走过的路</h2><span>四座城市，四段把我带到这里的经历。</span></header><TravelPassDeck/></section>
 <section className="life-section memories-section"><header><p className="eyebrow">02 / ALBUMS</p><h2>留下来的画面</h2><span>四本小相册，装着城市、作品和旧工作室。</span></header><PolaroidDesk albums={memoryAlbums}/></section>
 <section className="life-section notes-section"><header><p className="eyebrow">03 / NOTES & STORIES</p><h2>收下来的想法</h2><span>做东西、想事情，也记录生活。</span></header><ReadingCorner embedded/></section>

 </div>}

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
import {lang,pick,t} from './i18n';
import './life.css';

const chapters=[{id:'hami',name:t('哈密','Hami'),en:t('HAMI','哈密'),date:t('18 岁以前','Before 18')},{id:'shanghai',name:t('上海','Shanghai'),en:t('SHANGHAI','上海'),date:'2018—2024'},{id:'hangzhou',name:t('杭州','Hangzhou'),en:t('HANGZHOU','杭州'),date:'2025'},{id:'sanjose',name:'San Jose',en:t('SAN JOSE','圣何塞'),date:t('2025—现在','2025—now')}] as const;

function TravelPassDeck(){
 const [selected,setSelected]=useState<number|null>(null),[hover,setHover]=useState<number|null>(null);const dialog=useRef<HTMLDialogElement>(null);const active=hover??0;const story=selected===null?null:cityStories[chapters[selected].id];
 useEffect(()=>{if(selected===null){dialog.current?.close();return}const overflow=document.body.style.overflow;dialog.current?.showModal();document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow}},[selected]);
 const close=()=>{dialog.current?.close();setSelected(null)};
 return <><div className="travel-deck" onPointerLeave={()=>setHover(null)}>{chapters.map((item,i)=><button key={item.id} className="city-pass" aria-haspopup="dialog" onClick={()=>setSelected(i)} onPointerEnter={()=>setHover(i)} onFocus={()=>setHover(i)} onBlur={()=>setHover(null)} style={{'--x':`${(i-1.5)*115+(i<active?-22:i>active?22:0)}px`,'--angle':`${i===active?0:[-12,-5,6,13][i]}deg`,'--lift':i===active?'-20px':'0px',zIndex:i===active?6:i} as CSSProperties}><div className="city-art" style={{backgroundImage:`url(${cities})`,backgroundPosition:`${i%2*100}% ${Math.floor(i/2)*100}%`}}/><small>CHAPTER 0{i+1}</small><strong>{item.name}</strong><span>{item.en}</span><em>{item.date}</em></button>)}</div><p className="travel-instruction">{t('点开一张 Travel Pass，读这一段完整故事。','Open a travel pass to read the full story.')}</p><dialog ref={dialog} className="reading-sheet city-sheet" aria-labelledby="city-title" onClose={()=>setSelected(null)} onClick={e=>{if(e.target===e.currentTarget)close()}}>{story&&<><header><div><p className="eyebrow">{pick(story.meta)}</p><h2 id="city-title">{pick(story.title)}</h2></div><button onClick={close} aria-label={t('关闭城市故事','Close city story')}>×</button></header><div className="reading-sheet-body"><p>{pick(story.body)}</p>{story.extra.map((p,i)=><p key={i}>{pick(p)}</p>)}<blockquote>{pick(story.quote)}</blockquote></div></>}</dialog></>;
}

const memoryAlbums=[
 {id:'places',name:t('走过的路','Places'),meta:t('4 张 · 2018—现在','4 photos · 2018—now'),images:[cities,timelineRoom,studioAbout,studioHome],captions:[t('四座城市','Four cities'),t('照片墙','Photo wall'),t('一路留下来的东西','What I kept along the way'),t('从这里出发','Where it started')]},
 {id:'studio',name:t('插画工作室','Illustrated studio'),meta:t('4 张 · ARCHIVE','4 photos · ARCHIVE'),images:[studioHome,studioAbout,studioProjects,studioWriting],captions:[t('主房间','Main room'),t('床边','Bedside'),t('工作台','Workbench'),t('阅读角','Reading nook')]},
 {id:'making',name:t('做东西的痕迹','Making things'),meta:t('4 张 · WIP','4 photos · WIP'),images:[workbench,captureDetail,worksRoom,storyRoute],captions:[t('我的工作台','My workbench'),'Cassie Capture',t('作品房间','Work room'),t('故事路线','Story route')]},
 {id:'stories',name:t('小蘑菇','Little Mushroom'),meta:t('4 张 · COMIC','4 photos · COMIC'),images:[writingRoom,comicOne,comicTwo,comicThree],captions:[t('故事从阅读角开始','It starts in the reading nook'),t('第一格','First panel'),t('路上遇见的事','Things on the way'),t('还会继续','To be continued')]},
];

export function LifePage({embedded=false}:{embedded?:boolean}={}){return <div className={`life-page${embedded?' is-home-section':''}`}>
 {!embedded&&<section className="life-hero"><div><p className="eyebrow">{t('LIFE / 生活与想法','LIFE / PLACES & IDEAS')}</p>{lang==='en'?<h1>The places I've lived<br/>shaped how I build.</h1>:<h1>我走过的地方，<br/>也塑造了我做东西的方式。</h1>}<p>{t('城市、文章和一些不太安静的念头，都收在这里。','Cities, writing, and a few restless thoughts, all kept here.')}</p></div><figure><img src={room} alt={t('Yue 坐在靠窗的阅读角，身边是书架和浅木色书桌','Yue in a window-side reading nook with a bookshelf and a light wood desk')}/><figcaption>READING ROOM · 2026</figcaption></figure></section>}
 <section id="life" className="life-section travel-section"><header><p className="eyebrow">01 / PLACES</p><h2>{t('走过的路','Places')}</h2><span>{t('四座城市，四段把我带到这里的经历。','Four cities, four chapters that brought me here.')}</span></header><TravelPassDeck/></section>
 <section className="life-section memories-section"><header><p className="eyebrow">02 / ALBUMS</p><h2>{t('留下来的画面','Albums')}</h2><span>{t('四本小相册，装着城市、作品和旧工作室。','Four small albums: cities, work, and the old studio.')}</span></header><PolaroidDesk albums={memoryAlbums}/></section>
 <section id="stories" className="life-section notes-section"><header><p className="eyebrow">03 / NOTES & STORIES</p><h2>{t('收下来的想法','Notes & stories')}</h2><span>{t('做东西、想事情，也记录生活。','Building, thinking, and everyday life.')}<a className="notes-entry" href="#notes">{t('技术笔记 →','Technical notes →')}</a></span></header><ReadingCorner embedded/></section>

 </div>}

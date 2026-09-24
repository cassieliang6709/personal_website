import {createElement,useEffect,useRef,useState,type ReactNode} from 'react';
import '../../articles.js';
import FolderFloat from './FolderFloat';
import room from '../../assets/room-spec/writing-v2.webp';
import './reading.css';
type Article={id:string;cat:string;title:string[];meta:string[];deck:string[];body:string[][];comicEpisodes?:{title:string[];path:string;pages:number}[]};
const articles=(window as unknown as {CASSIE_ARTICLES:Article[]}).CASSIE_ARTICLES;
function inline(text:string):ReactNode[]{
 const doc=new DOMParser().parseFromString(text,'text/html');
 const render=(node:Node,key:number):ReactNode=>{if(node.nodeType===Node.TEXT_NODE)return node.textContent;const tag=node.nodeName.toLowerCase();const children=Array.from(node.childNodes).map(render);return ['strong','em','code','br'].includes(tag)?createElement(tag,{key},tag==='br'?undefined:children):children};
 return Array.from(doc.body.childNodes).map(render);
}
const images=import.meta.glob('../../assets/comics/mushroom/**/*.webp',{eager:true,query:'?url',import:'default'}) as Record<string,string>;
const groups=[{id:'build',label:'做东西',back:'#547285',front:'#7190a2'},{id:'reflection',label:'想事情',back:'#65745e',front:'#89957b'},{id:'life',label:'生活记录',back:'#a47f58',front:'#bc9971'}];

function ComicReader({episodes}:{episodes:NonNullable<Article['comicEpisodes']>}){
 const [episodeIndex,setEpisodeIndex]=useState(0);const strip=useRef<HTMLDivElement>(null);const episode=episodes[episodeIndex];
 const imageFor=(path:string,index:number)=>images[`../../${path}/${String(index+1).padStart(2,'0')}.webp`];
 const choose=(index:number)=>{setEpisodeIndex(index);strip.current?.scrollTo({left:0,behavior:'smooth'})};
 return <div className="comic-reader"><div className="comic-reader-bar"><div><strong>{episode.title[0]}</strong><span>{episode.pages} 页</span></div><p>横着看，可以左右滑动 →</p></div><div ref={strip} className="comic-strip" tabIndex={0} aria-label={`${episode.title[0]}横向漫画`}>{Array.from({length:episode.pages},(_,index)=><figure key={index}><img src={imageFor(episode.path,index)} alt={`${episode.title[0]}，第 ${index+1} 页`} width="960" height="1280" loading={index<2?'eager':'lazy'}/><figcaption>{String(index+1).padStart(2,'0')} / {String(episode.pages).padStart(2,'0')}</figcaption></figure>)}</div><nav className="comic-episode-nav" aria-label="选择漫画章节">{episodes.map((item,index)=><button key={item.path} className={episodeIndex===index?'active':''} aria-pressed={episodeIndex===index} onClick={()=>choose(index)}><img src={imageFor(item.path,0)} alt=""/><span><small>EP. {String(index+1).padStart(2,'0')}</small><strong>{item.title[0].replace(/^第.+?：/,'')}</strong><em>{item.pages} 页</em></span></button>)}</nav></div>;
}

export function ReadingCorner({embedded=false}:{embedded?:boolean}){
 const [opened,setOpened]=useState<string|null>(null),[pages,setPages]=useState<Record<string,number>>({}),[selected,setSelected]=useState<Article|null>(null);
 const dialog=useRef<HTMLDialogElement>(null),body=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(!selected){dialog.current?.close();return}const previous=document.body.style.overflow;dialog.current?.showModal();document.body.style.overflow='hidden';body.current?.scrollTo(0,0);return()=>{document.body.style.overflow=previous}},[selected]);
 const close=()=>{dialog.current?.close();setSelected(null)};
 return <section className={`reading-corner${embedded?' is-embedded':''}`}>{!embedded&&<><header className="reading-heading"><div><p className="eyebrow">阅读角 / NOTES & STORIES</p><h1>收在这里的一些想法。</h1><p>打开文件夹，挑一篇慢慢读。</p></div><a href="#life">← 回到生活</a></header><div className="reading-room"><img src={room} alt="Yue 的阅读角，书架与浅木书桌"/></div></>}<div className="folder-shelf">{groups.map(g=>{const list=articles.filter(a=>a.cat===g.id),page=pages[g.id]??0;return <section className="folder-slot" key={g.id} aria-label={g.label}><FolderFloat key={`${g.id}-${page}`} items={list.slice(page*4,page*4+4).map(a=>({label:a.title[0],value:a.id}))} label={g.label} sublabel={`${list.length} 篇`} expanded={opened===g.id} trigger="click" closeOnSelect={false} physics={false} spread={150} folderColor={g.back} frontColor={g.front} onOpenChange={open=>setOpened(open?g.id:null)} onSelect={id=>setSelected(articles.find(a=>a.id===id)??null)}/>{opened===g.id&&list.length>4&&<nav className="folder-pagination" aria-label={`${g.label}翻页`}><button disabled={page===0} onClick={()=>setPages({...pages,[g.id]:page-1})}>← 上一组</button><span>{page+1} / {Math.ceil(list.length/4)}</span><button disabled={(page+1)*4>=list.length} onClick={()=>setPages({...pages,[g.id]:page+1})}>下一组 →</button></nav>}</section>})}</div><dialog ref={dialog} className={`reading-dialog${selected?.comicEpisodes?' is-comic':''}`} aria-labelledby="reading-title" onClose={()=>setSelected(null)} onClick={e=>{if(e.target===e.currentTarget)close()}}>{selected&&<><header><div><p className="eyebrow">{selected.meta[0]}</p><h2 id="reading-title">{selected.title[0]}</h2></div><button onClick={close} aria-label="关闭阅读">×</button></header><div ref={body} className={`reading-body${selected.comicEpisodes?' comic-reading-body':''}`}><p className="reading-deck">{selected.deck[0]}</p>{selected.comicEpisodes?<ComicReader key={selected.id} episodes={selected.comicEpisodes}/>:selected.body[0].map((p,i)=>p.startsWith('## ')?<h3 key={i}>{inline(p.slice(3))}</h3>:p.startsWith('> ')?<blockquote key={i}>{inline(p.slice(2))}</blockquote>:<p key={i}>{inline(p)}</p>)}</div></>}</dialog></section>;
}

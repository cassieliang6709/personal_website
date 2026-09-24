import {useLayoutEffect,useRef,useState,type CSSProperties} from 'react';
import {t} from './i18n';
import './polaroid.css';

export type PolaroidAlbum={id:string;name:string;meta:string;images:string[];captions:string[]};

type Placement={x:number;y:number;r:number;s:number;z:number};

const HEADER=64,GAP=16,LABEL=58;

// Stable pseudo-random jitter so stacks look hand-placed but never reshuffle between renders.
const jitter=(seed:number)=>{const v=Math.sin(seed*12.9898)*43758.5453;return v-Math.floor(v)};

function layout(albums:PolaroidAlbum[],width:number,open:string|null,focus:number|null){
 const compact=width<640;
 const stackW=compact?104:120,gridW=compact?100:148;
 const cardH=(w:number)=>w*1.22;
 const cols=compact?2:Math.min(albums.length,4);
 const cellW=width/cols,rowH=cardH(stackW)+LABEL+40;
 const closedHeight=Math.ceil(albums.length/cols)*rowH+24;
 const places:Record<string,Placement[]>={};
 const stacks=albums.map((album,a)=>{
  const cx=(a%cols+.5)*cellW,top=24+Math.floor(a/cols)*rowH;
  return {cx,top,album};
 });
 let height=closedHeight;
 const openAlbum=albums.find(album=>album.id===open);
 const gridCols=Math.max(2,Math.floor((width-2*GAP+GAP)/(gridW+GAP)));
 if(openAlbum){
  const rows=Math.ceil(openAlbum.images.length/gridCols);
  height=Math.max(closedHeight,HEADER+rows*(cardH(gridW)+GAP)+GAP);
  if(focus!==null)height=Math.max(height,HEADER+cardH(Math.min(width*.62,compact?260:380))+GAP*2);
 }
 stacks.forEach(({cx,top,album},a)=>{
  places[album.id]=album.images.map((_,i)=>{
   const seed=a*31+i*7+1;
   if(album.id!==open){
    // Closed stack: every card sits on the same spot with a small offset and tilt.
    return {x:cx-stackW/2+(jitter(seed)-.5)*4,y:top-i*.6,r:(jitter(seed+3)-.5)*9,s:stackW/gridW,z:album.images.length-i};
   }
   if(focus===i){
    const s=Math.min(width*.62,compact?260:380)/gridW;
    return {x:width/2-gridW*s/2,y:Math.max(HEADER,height/2-cardH(gridW)*s/2),r:0,s,z:200};
   }
   const rowCount=Math.min(gridCols,album.images.length);
   const rowWidth=rowCount*gridW+(rowCount-1)*GAP;
   const col=i%gridCols,row=Math.floor(i/gridCols);
   return {x:(width-rowWidth)/2+col*(gridW+GAP),y:HEADER+row*(cardH(gridW)+GAP),r:(jitter(seed+5)-.5)*3,s:1,z:100+i};
  });
 });
 return {places,stacks,height,gridW,stackW,cardH};
}

export function PolaroidDesk({albums}:{albums:PolaroidAlbum[]}){
 const desk=useRef<HTMLDivElement>(null);
 const [width,setWidth]=useState(0);
 const [open,setOpen]=useState<string|null>(null);
 const [focus,setFocus]=useState<number|null>(null);
 useLayoutEffect(()=>{
  const el=desk.current;if(!el)return;
  const observer=new ResizeObserver(([entry])=>setWidth(entry.contentRect.width));
  observer.observe(el);return()=>observer.disconnect();
 },[]);
 const toggle=(id:string)=>{setFocus(null);setOpen(open===id?null:id)};
 const close=()=>{setFocus(null);setOpen(null)};
 const current=albums.find(album=>album.id===open);
 const {places,stacks,height,gridW,stackW,cardH}=layout(albums,width||900,open,focus);
 return <div className="polaroid-block">
  <div ref={desk} className={`polaroid-desk${open?' is-open':''}${focus!==null?' is-focused':''}`} style={{height}} onKeyDown={e=>{if(e.key==='Escape')focus!==null?setFocus(null):close()}}>
   <header className="polaroid-head" aria-hidden={!current}>
    {current&&<><strong>{current.name}</strong><small>{current.meta}</small><button type="button" onClick={close}>{t('收起','Close')}</button></>}
   </header>
   {stacks.map(({cx,top,album})=><button key={album.id} type="button" className="polaroid-label" style={{left:cx,top:top+cardH(stackW)+18}} onClick={()=>toggle(album.id)} aria-expanded={open===album.id} tabIndex={open&&open!==album.id?-1:0}>
    <strong>{album.name}</strong><small>{album.meta}</small>
   </button>)}
   {albums.map(album=>album.images.map((image,i)=>{
    const p=places[album.id][i];const isOpen=open===album.id;
    const style={width:gridW,zIndex:p.z,transform:`translate(${p.x}px,${p.y}px) rotate(${p.r}deg) scale(${p.s})`,transitionDelay:isOpen&&focus===null?`${i*35}ms`:'0ms'} as CSSProperties;
    return <button key={`${album.id}-${i}`} type="button" className={`polaroid-card${isOpen?' is-out':''}${open&&!isOpen?' is-dim':''}${focus===i&&isOpen?' is-focus':''}`} style={style}
     tabIndex={isOpen||(!open&&i===0)?0:-1}
     aria-label={isOpen?`${album.name}: ${album.captions[i]??t(`第 ${i+1} 张`,`Photo ${i+1}`)}`:t(`打开相册 ${album.name}`,`Open album ${album.name}`)}
     onClick={()=>{if(!isOpen){toggle(album.id);return}setFocus(focus===i?null:i)}}>
     <img src={image} alt="" draggable={false} loading={i<3?'eager':'lazy'}/>
     <span>{isOpen?album.captions[i]:''}</span>
    </button>;
   }))}
  </div>
 </div>;
}

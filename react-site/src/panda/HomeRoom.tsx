import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {PixelPlush} from './PixelPlush';
import {setPet,usePetId} from './petStore';
import {renderPng,type Work} from './yarn';
import {t} from '../i18n';

type Action='hop';
// 家园里的摆放位置：中间地毯最大，两边地板，墙上两层架子
const slots:{left:number;bottom:number;w:number;h:number}[]=[
 {left:50,bottom:7,w:40,h:60},
 {left:14,bottom:5,w:20,h:30},{left:86,bottom:5,w:20,h:30},
 {left:15,bottom:52,w:12,h:18},{left:30,bottom:52,w:12,h:18},{left:70,bottom:52,w:12,h:18},{left:85,bottom:52,w:12,h:18},
];

export function HomeRoom({works,currentId,onNew,onClear}:{works:Work[];currentId:string|null;onNew:()=>void;onClear:()=>void}){
 const [acting,setActing]=useState<Record<string,Action>>({});
 const [saveError,setSaveError]=useState(false);
 const svgRef=useRef<SVGSVGElement>(null),timers=useRef<number[]>([]);
 useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
 const current=works.find(w=>w.id===currentId)??null;
 // 刚做好的摆中间，其余按时间从新到旧
 const placed=current?[current,...works.filter(w=>w.id!==current.id)]:works;

 const petId=usePetId(),pet=works.find(w=>w.id===petId)??null;
 // 点一下玩偶：先蹦一下，再跳出家园跟着鼠标去玩
 const poke=(id:string)=>{
  if(acting[id])return;
  setActing(s=>({...s,[id]:'hop'}));
  timers.current.push(window.setTimeout(()=>{setActing(s=>{const n={...s};delete n[id];return n});setPet(id)},450));
 };
 const save=async()=>{
  const w=placed[0],svg=svgRef.current;if(!w||!svg)return;setSaveError(false);
  try{
   const url=URL.createObjectURL(await renderPng(svg,`${w.name} · No.${w.no} · liangyue.site`));
   const a=document.createElement('a');a.href=url;a.download=`plush-${w.no}.png`;a.click();
   window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch{setSaveError(true)}
 };
 const clear=()=>{if(window.confirm(t('清空家园里所有的玩偶？这台设备上的存档会删掉。','Remove every plush from your home? This deletes the save on this device.')))onClear()};

 return <>
  <div className="pw-stage is-home">
   <div className="hr-room" aria-hidden="true"><i className="hr-window"/><i className="hr-shelf is-left"/><i className="hr-shelf is-right"/><i className="hr-rug"/></div>
   <p className="pw-ribbon">{t('我的家园','My home')}</p>
   {current&&<>
    {[[12,18],[86,14],[6,58],[92,50],[50,4]].map(([x,y],i)=><i key={i} className="pw-spark" aria-hidden="true" style={{left:`${x}%`,top:`${y}%`,'--d':`${i*.23}s`} as CSSProperties}/>)}
    <h2 className="pw-title">{t('摆进家园啦！','Home sweet home!')}</h2>
   </>}
   {placed.slice(0,slots.length).map((w,i)=>{const s=slots[i];return <div key={w.id} className={`hr-slot${i===0?' is-main':''}${acting[w.id]?` is-${acting[w.id]}`:''}${i===0&&current?' is-new':''}`} style={{left:`${s.left}%`,bottom:`${s.bottom}%`,width:`${s.w}%`,height:`${s.h}%`}}>
    {w.id===petId?<button type="button" className="hr-away" onClick={()=>setPet(null)}>{t(`${w.name}出去玩了`,`${w.name} is out`)}<small>{t('点这里叫它回家','Tap to call it home')}</small></button>
     :<PixelPlush pattern={w.pattern} svgRef={i===0?svgRef:undefined} role="button" tabIndex={0} label={t(`${w.name}，点一下它会跟着你出去玩`,`${w.name}. Tap to take it out to play`)}
     onClick={()=>poke(w.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();poke(w.id)}}}/>}
    {i===0&&<p className="pw-nametag">{w.name} <small>No.{w.no}</small></p>}
   </div>})}
   {!placed.length&&<p className="hr-empty">{t('家里还空着，去绣一个吧。','Nothing here yet. Go stitch one.')}</p>}
  </div>
  <div className="pw-tray">
   <div className="pw-foot">
    <p>{pet?t(`${pet.name}正跟着你的鼠标到处玩，换页面也跟着。点它的空位或者左下角的按钮叫它回家。`,`${pet.name} is following your cursor around the site. Tap its empty spot or the button at the bottom left to call it home.`)
     :current?t(`「${current.pattern.name}」绣成的${current.name}摆进家园了。点一下玩偶，它会跟着你的鼠标出去玩。`,`${current.name}, made from the ${current.pattern.name} pattern, is home. Tap a plush and it follows your cursor out to play.`)
     :t(`家里有 ${works.length} 个玩偶。点一下，它会跟着你的鼠标出去玩。`,`${works.length} plush friends live here. Tap one to take it out to play.`)}</p>
    <div className="pw-actions">
     {placed.length>0&&<button type="button" className="pw-btn" onClick={save}>{t('保存图片','Save image')}</button>}
     <button type="button" className="pw-btn is-lilac" onClick={onNew}>{t('再绣一个','Stitch another')}</button>
    </div>
   </div>
   {saveError&&<p className="pw-error" role="alert">{t('没能生成图片，可以直接截图保存。','Could not create the image. A screenshot works too.')}</p>}
   {works.length>0&&<button type="button" className="pw-link" onClick={clear}>{t('清空家园','Clear home')}</button>}
  </div>
 </>;
}

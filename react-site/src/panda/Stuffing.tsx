import {useEffect,useRef,useState,type CSSProperties,type KeyboardEvent} from 'react';
import {PixelPlush} from './PixelPlush';
import {type Pattern} from './yarn';
import {t} from '../i18n';

type Note='idle'|'low'|'over'|'ok';
// 棉花量：绿色区间内松手算成功，超过 OVER 会塞爆
const ZONE_MIN=.8,ZONE_MAX=1.02,OVER=1.08,FILL_MS=2400;

export function Stuffing({pattern,onDone}:{pattern:Pattern;onDone:()=>void}){
 const [fill,setFill]=useState(0);
 const [holding,setHolding]=useState(false);
 const [note,setNote]=useState<Note>('idle');
 const [shake,setShake]=useState(false);
 const fillRef=useRef(0),timers=useRef<number[]>([]);
 const later=(fn:()=>void,ms:number)=>{timers.current.push(window.setTimeout(fn,ms))};
 useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);

 const overfill=()=>{fillRef.current=.62;setFill(.62);setHolding(false);setNote('over');setShake(true);later(()=>setShake(false),600)};
 useEffect(()=>{
  if(!holding)return;
  let raf=0,last=performance.now();
  const tick=(now:number)=>{
   // 每帧最多算 50ms，切到后台再回来不会一下子塞爆
   const next=fillRef.current+Math.min(now-last,50)/FILL_MS;last=now;
   if(next>=OVER){overfill();return}
   fillRef.current=next;setFill(next);raf=requestAnimationFrame(tick);
  };
  raf=requestAnimationFrame(tick);
  return()=>cancelAnimationFrame(raf);
 },[holding]);
 const start=()=>{if(note!=='ok'){setHolding(true);setNote('idle')}};
 const end=()=>{
  if(!holding)return;setHolding(false);
  const f=fillRef.current;
  if(f<ZONE_MIN)setNote('low');
  else if(f>ZONE_MAX)overfill();
  else{setNote('ok');later(onDone,800)}
 };
 const key=(e:KeyboardEvent<HTMLButtonElement>,down:boolean)=>{
  if(e.key!==' '&&e.key!=='Enter')return;e.preventDefault();
  if(down&&!e.repeat)start();else if(!down)end();
 };
 const text:Record<Note,string>={
  idle:t('绣好的布片缝上了底布，现在还是扁的。按住按钮塞棉花，松手时要停在绿色区间。','The stitched piece is sewn to its backing, still flat. Hold to stuff it; let go in the green zone.'),
  low:t('还有点瘪，再塞一点。','Still a bit flat. Add some more.'),
  over:t('塞太满了！掏出来一些，再来一次。','Too full! Some stuffing came out. Try again.'),
  ok:t('刚刚好，软乎乎的。','Just right. Nice and squishy.'),
 };

 return <>
  <div className={`pw-stage is-stuff${holding?' is-holding':''}${fill>1?' is-tight':''}${shake?' is-shaking':''}`}>
   <p className="pw-ribbon">{t('塞棉花','Stuffing')}</p>
   <div className="st-plush"><PixelPlush pattern={pattern} puff={fill} label={t('还没塞棉花的玩偶','Plush waiting for stuffing')}/></div>
   <div className="pw-bag" aria-hidden="true"><b>{t('棉花','Cotton')}</b></div>
   {holding&&<div className="pw-cottons" aria-hidden="true">{[0,1,2,3,4,5].map(i=><i key={i} style={{'--d':`${i*.13}s`,'--x':`${(i%3-1)*14}px`} as CSSProperties}/>)}</div>}
  </div>
  <div className="pw-tray">
   <div className="pw-stuff">
    <button type="button" className={`pw-hold${holding?' is-holding':''}`} disabled={note==='ok'}
     onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);start()}} onPointerUp={end} onPointerCancel={end}
     onKeyDown={e=>key(e,true)} onKeyUp={e=>key(e,false)}>{t('按住','Hold')}<small>{t('塞棉花','to stuff')}</small></button>
    <div className="pw-stuff-info">
     <div className="pw-meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(fill/OVER*100)} aria-label={t('棉花量','Stuffing')}>
      <b style={{width:`${Math.min(fill/OVER,1)*100}%`}}/><i style={{left:`${ZONE_MIN/OVER*100}%`,width:`${(ZONE_MAX-ZONE_MIN)/OVER*100}%`}}/>
     </div>
     <p className={`pw-note is-${note}`} aria-live="polite">{text[note]}</p>
    </div>
   </div>
  </div>
 </>;
}

import {useEffect,useMemo,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {PixelPlush} from './PixelPlush';
import {PatternThumb} from './bits';
import {setPet} from './petStore';
import {loadHome} from './yarn';
import {t} from '../i18n';

type Act='hop'|'spin'|'wiggle'|'squish';
const acts:Act[]=['hop','spin','wiggle','squish'];
// 玩偶高度；脚底落在鼠标右下方，不挡住要点的东西
const H=76,GAP_X=22,GAP_Y=18,IDLE_MS=4000;

export default function FollowPet({id}:{id:string}){
 const work=useMemo(()=>loadHome().find(w=>w.id===id)??null,[id]);
 useEffect(()=>{if(!work)setPet(null)},[work]);
 const box=useRef<HTMLDivElement>(null),face=useRef<HTMLDivElement>(null);
 const [walking,setWalking]=useState(false);
 const [act,setAct]=useState<Act|null>(null);
 const [hearts,setHearts]=useState<number[]>([]);

 useEffect(()=>{
  if(!work)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pos={x:innerWidth/2,y:innerHeight-24},target={...pos};
  let raf=0,last=0,running=false,dir=1,moving=false,idleSince=performance.now(),heartId=0;
  const timers:number[]=[];
  const half=()=>(box.current?.offsetWidth??H)/2;
  const clampTarget=()=>{const h=half();target.x=Math.max(h+4,Math.min(innerWidth-h-4,target.x));target.y=Math.max(H+4,Math.min(innerHeight-4,target.y))};
  const draw=()=>{if(box.current)box.current.style.transform=`translate3d(${pos.x-half()}px,${pos.y-H}px,0)`};
  const setMoving=(m:boolean)=>{if(m!==moving){moving=m;setWalking(m)}};
  // 位置每帧往目标靠一点，停下来就不再跑 requestAnimationFrame
  const tick=(now:number)=>{
   const dt=Math.min(now-last,50)/1000;last=now;
   const dx=target.x-pos.x,dy=target.y-pos.y,dist=Math.hypot(dx,dy);
   if(dist<.6){pos.x=target.x;pos.y=target.y;draw();setMoving(false);running=false;return}
   const k=reduce?1:1-Math.exp(-dt*4.5);pos.x+=dx*k;pos.y+=dy*k;
   if(Math.abs(dx)>3){const d=dx>0?1:-1;if(d!==dir&&face.current){dir=d;face.current.style.transform=`scaleX(${d})`}}
   setMoving(dist>8);draw();raf=requestAnimationFrame(tick);
  };
  const go=()=>{idleSince=performance.now();clampTarget();if(!running){running=true;last=performance.now();raf=requestAnimationFrame(tick)}};
  const react=()=>{
   const a=acts[Math.floor(Math.random()*acts.length)];setAct(a);timers.push(window.setTimeout(()=>setAct(null),900));
   const hid=++heartId;setHearts(h=>[...h,hid]);timers.push(window.setTimeout(()=>setHearts(h=>h.filter(x=>x!==hid)),1000));
  };
  const onMove=(e:PointerEvent)=>{if(e.pointerType==='touch')return;target.x=e.clientX+GAP_X+half();target.y=e.clientY+GAP_Y+H;go()};
  // 手机上没有悬停：点哪里就走到哪里；电脑上点一下它会开心地动一下
  const onDown=(e:PointerEvent)=>{if(e.pointerType==='touch'){target.x=e.clientX;target.y=e.clientY+H/2;go()}else react()};
  const onResize=()=>go();
  draw();
  addEventListener('pointermove',onMove,{passive:true});addEventListener('pointerdown',onDown,{passive:true});addEventListener('resize',onResize);
  const idle=window.setInterval(()=>{if(!running&&performance.now()-idleSince>IDLE_MS&&document.visibilityState==='visible')react()},3500);
  return()=>{cancelAnimationFrame(raf);clearInterval(idle);timers.forEach(clearTimeout);removeEventListener('pointermove',onMove);removeEventListener('pointerdown',onDown);removeEventListener('resize',onResize)};
 },[work]);

 if(!work)return null;
 return createPortal(<>
  <div ref={box} className="fp-pet" aria-hidden="true">
   <div ref={face} className="fp-face"><div className={`fp-body${walking?' is-walking':''}${act?` is-${act}`:''}`}><PixelPlush pattern={work.pattern} label=""/></div></div>
   {hearts.map(h=><i key={h} className="fp-heart"/>)}
  </div>
  <button type="button" className="fp-home" onClick={()=>setPet(null)}>
   <PatternThumb pattern={work.pattern} className="fp-home-art"/>
   <span>{t(`${work.name}正跟着你`,`${work.name} is following you`)}<b>{t('叫它回家','Send it home')}</b></span>
  </button>
 </>,document.body);
}

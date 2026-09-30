import {useEffect,useMemo,useRef,useState,type PointerEvent} from 'react';
import {YarnBall} from './bits';
import {YARNS,cellCount,type Pattern} from './yarn';
import {t} from '../i18n';

const CLOTH=20,FRAME=24;

export function StitchFrame({pattern,order,onDone}:{pattern:Pattern;order:number[];onDone:(mistakes:number)=>void}){
 const {w,h,cells}=pattern;
 const S=Math.min(26,Math.floor(440/Math.max(w,h)));
 const OX=FRAME+CLOTH,OY=FRAME+CLOTH,VW=w*S+OX*2,VH=h*S+OY*2;
 const total=useMemo(()=>cellCount(pattern),[pattern]);
 const [stitched,setStitched]=useState(()=>cells.map(()=>false));
 const [wrong,setWrong]=useState(()=>cells.map(()=>false));
 const [sel,setSel]=useState(order[0]);
 const [mistakes,setMistakes]=useState(0);
 const svg=useRef<SVGSVGElement>(null),dragging=useRef(false),last=useRef(-1);

 const left=useMemo(()=>{const m=new Map<number,number>();cells.forEach((c,i)=>{if(c>=0&&!stitched[i])m.set(c,(m.get(c)??0)+1)});return m},[cells,stitched]);
 const done=total-[...left.values()].reduce((a,b)=>a+b,0);
 const finished=done===total;

 // 一种颜色绣完，自动换到下一种还没绣完的
 useEffect(()=>{if(!left.get(sel)){const n=order.find(y=>(left.get(y)??0)>0);if(n!==undefined)setSel(n)}},[left,order,sel]);
 const stitch=(indices:number[])=>{
  if(!indices.length)return;
  setStitched(prev=>{const next=[...prev];indices.forEach(i=>{next[i]=true});return next});
  setWrong(prev=>{const next=[...prev];indices.forEach(i=>{next[i]=false});return next});
 };
 // 点击：颜色不对出红叉；拖动：只绣颜色对的格子，经过别的格子不算错
 const hit=(i:number,tap:boolean)=>{
  if(finished||cells[i]<0||stitched[i])return;
  if(cells[i]===sel)stitch([i]);
  else if(tap&&!wrong[i]){setWrong(prev=>{const next=[...prev];next[i]=true;return next});setMistakes(m=>m+1)}
 };
 const cellAt=(e:{clientX:number;clientY:number})=>{
  const m=svg.current?.getScreenCTM();if(!m)return -1;
  const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse());
  const x=Math.floor((p.x-OX)/S),y=Math.floor((p.y-OY)/S);
  return x>=0&&y>=0&&x<w&&y<h?y*w+x:-1;
 };
 const down=(e:PointerEvent<SVGSVGElement>)=>{
  const i=cellAt(e);if(i<0)return;
  e.currentTarget.setPointerCapture(e.pointerId);dragging.current=true;last.current=i;hit(i,true);
 };
 const move=(e:PointerEvent<SVGSVGElement>)=>{
  if(!dragging.current)return;const i=cellAt(e);
  if(i>=0&&i!==last.current){last.current=i;hit(i,false)}
 };
 const helpColor=()=>stitch(cells.map((c,i)=>c===sel&&!stitched[i]?i:-1).filter(i=>i>=0));

 const inset=S*.18,sw=S*.22;
 return <>
  <div className="pw-stage is-stitch">
   <p className="pw-ribbon">{t('绣工坊','Stitch room')}</p>
   <svg ref={svg} viewBox={`0 0 ${VW} ${VH}`} className="sf-svg" role="application"
    aria-label={t(`绣布，${w} 乘 ${h} 格。先在毛线篮里选颜色，再点同样颜色的格子。`,`Cross-stitch cloth, ${w} by ${h}. Pick a yarn, then tap cells of the same color.`)}
    onPointerDown={down} onPointerMove={move} onPointerUp={()=>{dragging.current=false}} onPointerCancel={()=>{dragging.current=false}}>
    <defs>
     <pattern id="sf-aida" x={OX} y={OY} width={S} height={S} patternUnits="userSpaceOnUse"><rect width={S} height={S} fill="#f6efe0"/>{[[0,0],[S,0],[0,S],[S,S]].map(([x,y])=><circle key={`${x}${y}`} cx={x} cy={y} r={S*.07} fill="#a38b6a" opacity=".45"/>)}</pattern>
     <linearGradient id="sf-wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f0c992"/><stop offset=".5" stopColor="#cf955b"/><stop offset="1" stopColor="#a96d3a"/></linearGradient>
    </defs>
    <rect x={4} y={10} width={VW-8} height={VH-8} rx={18} fill="#2f5d78" opacity={.16}/>
    <rect x={FRAME/2} y={FRAME/2} width={VW-FRAME} height={VH-FRAME} rx={14} fill="url(#sf-aida)" stroke="url(#sf-wood)" strokeWidth={FRAME}/>
    <rect x={FRAME/2} y={FRAME/2} width={VW-FRAME} height={VH-FRAME} rx={14} fill="none" stroke="#7a4a20" strokeOpacity={.3} strokeWidth={1} strokeDasharray="50 14 10 30"/>
    {[[FRAME/2,FRAME/2],[VW-FRAME/2,FRAME/2],[FRAME/2,VH-FRAME/2],[VW-FRAME/2,VH-FRAME/2]].map(([x,y])=><circle key={`${x},${y}`} cx={x} cy={y} r={8} fill="#f4dc92" stroke="#8a6a2a" strokeWidth={2}/>)}
    {cells.map((c,i)=>{
     if(c<0)return null;
     const x=OX+(i%w)*S,y=OY+Math.floor(i/w)*S,yarn=YARNS[c];
     const X=`M${x+inset} ${y+inset}L${x+S-inset} ${y+S-inset}M${x+S-inset} ${y+inset}L${x+inset} ${y+S-inset}`;
     // 绣好的格子整格填满颜色，上面留一点十字纹理；和点错的红叉一眼能分开
     if(stitched[i])return <g key={i} className="sf-x">
      <rect x={x+.6} y={y+1.8} width={S-1.2} height={S-1.2} rx={3} fill="#3b2a1a" opacity={.2}/>
      <rect x={x+.6} y={y+.6} width={S-1.2} height={S-1.2} rx={3} fill={yarn.color} stroke={yarn.line} strokeWidth={1}/>
      <path d={X} stroke={yarn.line} strokeOpacity={.3} strokeWidth={sw*.5} strokeLinecap="round" transform="translate(.6 .8)"/>
      <path d={X} stroke={yarn.light} strokeOpacity={.75} strokeWidth={sw*.4} strokeLinecap="round"/>
     </g>;
     const on=c===sel;
     return <g key={i}>
      <rect x={x+1} y={y+1} width={S-2} height={S-2} rx={2} fill={yarn.color} fillOpacity={on?.38:.16} stroke={yarn.line} strokeOpacity={on?.55:.2} strokeDasharray={on?undefined:'2 2'} strokeWidth={1}/>
      {wrong[i]&&<g className="sf-wrong"><path d={X} stroke="#fff" strokeWidth={S*.24} strokeLinecap="round"/><path d={X} stroke="#e5484d" strokeWidth={S*.13} strokeLinecap="round"/></g>}
     </g>;
    })}
   </svg>
  </div>
  <div className="pw-tray">
   <div className="pw-yarns is-basket" role="radiogroup" aria-label={t('毛线篮','Yarn basket')}>
    {order.map(y=>{const n=left.get(y)??0;return <button type="button" key={y} role="radio" aria-checked={sel===y} className={`pw-yarn${n===0?' is-used':''}`} onClick={()=>setSel(y)}>
     <YarnBall yarn={y} size={40}/><small>{YARNS[y].name}</small><em>{n===0?'✓':n}</em>
    </button>})}
   </div>
   <div className="pw-progress" aria-hidden="true"><b style={{width:`${done/total*100}%`}}/></div>
   <div className="pw-foot">
    <p>{finished?t(`绣好啦！一共 ${total} 针，点错 ${mistakes} 次。`,`All ${total} stitches done, ${mistakes} slips.`)
     :t(`选好颜色，点同色的格子；按住拖动可以连着绣。点错颜色会出红叉。已绣 ${done} / ${total}`,`Pick a yarn and tap matching cells; drag to stitch a run. Wrong color shows a red X. ${done} / ${total}`)}</p>
    {finished?<button type="button" className="pw-btn" onClick={()=>onDone(mistakes)}>{t('拿去塞棉花 →','Stuff it →')}</button>
     :<button type="button" className="pw-btn is-sky" onClick={helpColor}>{t(`帮我绣完${YARNS[sel].name}`,`Finish ${YARNS[sel].name} for me`)}</button>}
   </div>
  </div>
 </>;
}

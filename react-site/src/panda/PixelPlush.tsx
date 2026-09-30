import {useId,useMemo,type KeyboardEvent,type Ref} from 'react';
import {YARNS,feltTexture,type Pattern} from './yarn';

// 一格绣花 S，四周多出一圈底布 B，缝线在底布中间
const S=20,B=8,PAD=22;

function geometry(p:Pattern){
 const filled=(x:number,y:number)=>x>=0&&y>=0&&x<p.w&&y<p.h&&p.cells[y*p.w+x]>=0;
 const h=B/2;let seam='';
 // 横向的边：一段连续的上边/下边合成一条线，凸角往外伸半格底布，凹角往里缩
 for(let y=0;y<p.h;y++)for(const dy of [-1,1]){
  for(let x=0;x<p.w;){
   if(!(filled(x,y)&&!filled(x,y+dy))){x++;continue}
   const a=x;while(x<p.w&&filled(x,y)&&!filled(x,y+dy))x++;const b=x-1;
   const start=filled(a-1,y)?a*S+h:a*S-h,end=filled(b+1,y)?(b+1)*S-h:(b+1)*S+h,Y=dy<0?y*S-h:(y+1)*S+h;
   seam+=`M${PAD+start} ${PAD+Y}H${PAD+end}`;
  }
 }
 for(let x=0;x<p.w;x++)for(const dx of [-1,1]){
  for(let y=0;y<p.h;){
   if(!(filled(x,y)&&!filled(x+dx,y))){y++;continue}
   const a=y;while(y<p.h&&filled(x,y)&&!filled(x+dx,y))y++;const b=y-1;
   const start=filled(x,a-1)?a*S+h:a*S-h,end=filled(x,b+1)?(b+1)*S-h:(b+1)*S+h,X=dx<0?x*S-h:(x+1)*S+h;
   seam+=`M${PAD+X} ${PAD+start}V${PAD+end}`;
  }
 }
 const cells=p.cells.map((c,i)=>({c,x:PAD+(i%p.w)*S,y:PAD+Math.floor(i/p.w)*S})).filter(k=>k.c>=0);
 return {W:p.w*S+PAD*2,H:p.h*S+PAD*2+14,bottom:PAD+p.h*S,seam,cells};
}

export type PixelPlushProps={pattern:Pattern;puff?:number;className?:string;svgRef?:Ref<SVGSVGElement>;label:string;onClick?:()=>void;onKeyDown?:(e:KeyboardEvent<SVGSVGElement>)=>void;role?:string;tabIndex?:number};

export function PixelPlush({pattern,puff=1,className='',svgRef,label,onClick,onKeyDown,role='img',tabIndex}:PixelPlushProps){
 const g=useMemo(()=>geometry(pattern),[pattern]);
 const uid='pp'+useId().replace(/[^a-zA-Z0-9]/g,'');
 const felt=feltTexture(),p=Math.min(puff,1),over=Math.max(0,puff-1);
 const sx=.92+.08*p+over*.5,sy=.85+.15*p+over*.4,cx=g.W/2;
 const backing=(extra:object)=>g.cells.map(k=><rect key={`${k.x},${k.y}`} x={k.x-B} y={k.y-B} width={S+B*2} height={S+B*2} rx={B+2} {...extra}/>);

 return <svg ref={svgRef} viewBox={`0 0 ${g.W} ${g.H}`} className={`pp-svg ${className}`} preserveAspectRatio="xMidYMax meet" role={role} tabIndex={tabIndex} aria-label={label} onClick={onClick} onKeyDown={onKeyDown}>
  <defs>
   {felt&&<pattern id={`${uid}-felt`} width="120" height="120" patternUnits="userSpaceOnUse"><image href={felt} width="120" height="120"/></pattern>}
   <radialGradient id={`${uid}-shade`} cx="36%" cy="28%" r="80%"><stop offset="0" stopColor="#fff" stopOpacity=".5"/><stop offset=".45" stopColor="#fff" stopOpacity="0"/><stop offset="1" stopColor="#3b2410" stopOpacity=".22"/></radialGradient>
   <clipPath id={`${uid}-clip`}>{backing({})}</clipPath>
   <filter id={`${uid}-inner`} x="-10%" y="-10%" width="120%" height="120%"><feFlood floodColor="#3b2410" floodOpacity=".4"/><feComposite in2="SourceAlpha" operator="out"/><feGaussianBlur stdDeviation="6"/><feComposite in2="SourceAlpha" operator="in"/></filter>
   <filter id={`${uid}-blur`} x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
  <ellipse cx={cx} cy={g.bottom+B+4} rx={g.W*.36} ry={7} fill="#3b2a1a" opacity={.22} filter={`url(#${uid}-blur)`}/>
  <g className="pp-pop"><g className="pp-act"><g transform={`translate(${cx} ${g.bottom+B}) scale(${sx.toFixed(3)} ${sy.toFixed(3)}) translate(${-cx} ${-(g.bottom+B)})`}>
   <g fill="#fbf1df" stroke="#b08658" strokeWidth={4}>{backing({})}</g>
   <g fill="#fbf1df">{backing({})}</g>
   {g.cells.map(k=>{const y=YARNS[k.c];return <g key={`${k.x},${k.y}`}>
    <rect x={k.x} y={k.y} width={S+.5} height={S+.5} fill={y.color}/>
    <path d={`M${k.x+4} ${k.y+4}L${k.x+S-4} ${k.y+S-4}M${k.x+S-4} ${k.y+4}L${k.x+4} ${k.y+S-4}`} stroke={y.line} strokeOpacity={.28} strokeWidth={2.6} strokeLinecap="round" transform="translate(.8 1)"/>
    <path d={`M${k.x+4} ${k.y+4}L${k.x+S-4} ${k.y+S-4}M${k.x+S-4} ${k.y+4}L${k.x+4} ${k.y+S-4}`} stroke={y.light} strokeOpacity={.6} strokeWidth={2.2} strokeLinecap="round"/>
   </g>})}
   <g clipPath={`url(#${uid}-clip)`} pointerEvents="none">
    <rect x={0} y={0} width={g.W} height={g.H} fill={`url(#${uid}-felt)`}/>
    <rect x={PAD-B} y={PAD-B} width={g.W-(PAD-B)*2} height={g.bottom-PAD+B*2} fill={`url(#${uid}-shade)`} opacity={.3+.7*p}/>
   </g>
   <g filter={`url(#${uid}-inner)`} opacity={.35+.65*p} pointerEvents="none">{backing({fill:'#000'})}</g>
   <path d={g.seam} fill="none" stroke="#000" strokeOpacity={.22} strokeWidth={2.4} strokeDasharray="5 4" strokeLinecap="round" transform="translate(.8 1)"/>
   <path d={g.seam} fill="none" stroke="#9a6a3a" strokeWidth={2.4} strokeDasharray="5 4" strokeLinecap="round"/>
  </g></g></g>
 </svg>;
}

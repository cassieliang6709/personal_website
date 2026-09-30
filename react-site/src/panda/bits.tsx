import {YARNS,type Pattern} from './yarn';

export function PatternThumb({pattern,className}:{pattern:Pattern;className?:string}){
 return <svg className={className} viewBox={`-1 -1 ${pattern.w+2} ${pattern.h+2}`} aria-hidden="true">
  {pattern.cells.map((c,i)=>c<0?null:<rect key={i} x={i%pattern.w} y={Math.floor(i/pattern.w)} width={1} height={1} fill={YARNS[c].color} stroke={YARNS[c].line} strokeWidth={.08} strokeOpacity={.55}/>)}
 </svg>;
}

// 一团毛线：底色圆 + 几道缠绕的线
export function YarnBall({yarn,size=36}:{yarn:number;size?:number}){
 const y=YARNS[yarn];
 return <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
  <ellipse cx="20" cy="36" rx="13" ry="3" fill="#3b2a1a" opacity=".15"/>
  <circle cx="20" cy="19" r="15" fill={y.color} stroke={y.line} strokeWidth="1.6"/>
  <g fill="none" stroke={y.line} strokeWidth="1.3" strokeLinecap="round" opacity=".55">
   <path d="M8 13q12 4 24-4M6 20q14 5 28-5M8 27q12 4 22-8M14 6q-3 13 4 27M24 5q-6 14 2 28"/>
  </g>
  <path d="M11 12a11 11 0 0 1 9-6" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="2.2" strokeLinecap="round"/>
  <path d="M33 26q5 3 4 9" fill="none" stroke={y.color} strokeWidth="2" strokeLinecap="round"/>
 </svg>;
}

import {useEffect,useMemo,useRef,useState} from 'react';
import {YarnBall} from './bits';
import {YARNS,colorsUsed,type Pattern} from './yarn';
import {t} from '../i18n';

const SPIN_MS=1100;

function Wheel({yarn}:{yarn:number|null}){
 const strand=yarn===null?'#efe6d6':YARNS[yarn].color;
 return <svg viewBox="0 0 260 240" className={`lm-wheel${yarn!==null?' is-spinning':''}`} aria-hidden="true">
  <defs><linearGradient id="lm-wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f0c992"/><stop offset=".55" stopColor="#cf955b"/><stop offset="1" stopColor="#a96d3a"/></linearGradient></defs>
  <ellipse cx="130" cy="226" rx="104" ry="9" fill="#2f5d78" opacity=".15"/>
  <path d="M70 222L112 120M190 222L148 120M58 222H202" stroke="url(#lm-wood)" strokeWidth="11" strokeLinecap="round"/>
  <g className="lm-rotor">
   <circle cx="130" cy="98" r="78" fill="none" stroke="url(#lm-wood)" strokeWidth="11"/>
   <circle cx="130" cy="98" r="78" fill="none" stroke="#7a4a20" strokeOpacity=".3" strokeWidth="1" strokeDasharray="30 12 8 20"/>
   {Array.from({length:8},(_,i)=><line key={i} x1="130" y1="98" x2={130+72*Math.cos(i*Math.PI/4)} y2={98+72*Math.sin(i*Math.PI/4)} stroke="#b97d45" strokeWidth="5" strokeLinecap="round"/>)}
  </g>
  <circle cx="130" cy="98" r="13" fill="#f4dc92" stroke="#8a6a2a" strokeWidth="2.5"/>
  {/* 左边一团羊毛，右边线轴 */}
  <g className="lm-wool"><circle cx="30" cy="150" r="17" fill="#fff"/><circle cx="46" cy="140" r="15" fill="#fff"/><circle cx="44" cy="160" r="14" fill="#fff"/><circle cx="24" cy="164" r="12" fill="#fff"/></g>
  <path d="M52 150Q92 128 130 98T236 150" fill="none" stroke={strand} strokeWidth="3" strokeLinecap="round" className="lm-strand"/>
  <rect x="222" y="140" width="28" height="44" rx="6" fill="#d9b98a" stroke="#9a6a3a" strokeWidth="2.5"/>
  <rect x="226" y="150" width="20" height="24" rx="4" fill={strand} className="lm-bobbin"/>
 </svg>;
}

function Vat({yarn}:{yarn:number}){
 const y=YARNS[yarn];
 return <svg viewBox="0 0 60 52" width="54" height="47" aria-hidden="true">
  <ellipse cx="30" cy="48" rx="22" ry="3.5" fill="#3b2a1a" opacity=".15"/>
  <path d="M8 16h44l-4 28a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4Z" fill="#c98f55" stroke="#8a5a2b" strokeWidth="2"/>
  <path d="M10 26h40M11 36h38" stroke="#8a5a2b" strokeOpacity=".5" strokeWidth="2"/>
  <ellipse cx="30" cy="16" rx="23" ry="6" fill="#a86d3a" stroke="#8a5a2b" strokeWidth="2"/>
  <ellipse cx="30" cy="16.5" rx="19" ry="4.2" fill={y.color}/>
  <ellipse cx="24" cy="15.5" rx="6" ry="1.4" fill="#fff" opacity=".5"/>
 </svg>;
}

export function Loom({pattern,onDone}:{pattern:Pattern;onDone:(order:number[])=>void}){
 const needs=useMemo(()=>colorsUsed(pattern),[pattern]);
 const [spun,setSpun]=useState<number[]>([]);
 const [spinning,setSpinning]=useState<number|null>(null);
 const timer=useRef(0);
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 const spin=(yarn:number)=>{
  if(spinning!==null||spun.includes(yarn))return;
  setSpinning(yarn);
  timer.current=window.setTimeout(()=>{setSpun(s=>[...s,yarn]);setSpinning(null)},SPIN_MS);
 };
 const all=needs.every(n=>spun.includes(n.yarn));

 return <>
  <div className="pw-stage is-spin">
   <p className="pw-ribbon">{t('美好纺织机','Spinning wheel')}</p>
   <div className="lm-scene">
    <Wheel yarn={spinning}/>
    <div className="lm-basket" aria-label={t('毛线篮','Yarn basket')}>
     <div className="lm-balls">{spun.map(y=><span key={y} className="lm-ball"><YarnBall yarn={y} size={52}/></span>)}</div>
    </div>
   </div>
  </div>
  <div className="pw-tray">
   <p className="pw-rule">{t(`这张图纸要 ${needs.length} 种毛线。点一个染料缸，纺织机会把羊毛纺成线，再染成这个颜色。`,`This pattern needs ${needs.length} yarns. Tap a dye pot and the wheel spins wool into yarn of that color.`)}</p>
   <div className="lm-vats">
    {needs.map(n=>{const done=spun.includes(n.yarn);return <button type="button" key={n.yarn} className={`lm-vat${done?' is-done':''}${spinning===n.yarn?' is-busy':''}`} disabled={done||spinning!==null} onClick={()=>spin(n.yarn)}>
     <Vat yarn={n.yarn}/><strong>{YARNS[n.yarn].name}</strong><small>{done?t('纺好了 ✓','Done ✓'):t(`${n.cells} 格`,`${n.cells} cells`)}</small>
    </button>})}
   </div>
   <div className="pw-foot">
    <p>{spinning!==null?t(`正在纺${YARNS[spinning].name}毛线…`,`Spinning ${YARNS[spinning].name}…`):t(`已纺 ${spun.length} / ${needs.length} 团`,`Spun ${spun.length} / ${needs.length}`)}</p>
    <button type="button" className="pw-btn" disabled={!all} onClick={()=>onDone(needs.map(n=>n.yarn))}>{t('去绣工坊 →','To the stitch room →')}</button>
   </div>
  </div>
 </>;
}

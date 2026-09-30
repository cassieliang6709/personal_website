import {useState,type CSSProperties} from 'react';
import {PatternThumb,YarnBall} from './bits';
import {PRESETS,YARNS,cellCount,colorsUsed,type Pattern} from './yarn';
import {t} from '../i18n';

export function Shop({customs,homeCount,onPick,onDraw,onDelete,onHome}:{customs:Pattern[];homeCount:number;onPick:(p:Pattern)=>void;onDraw:()=>void;onDelete:(id:string)=>void;onHome:()=>void}){
 const all=[...PRESETS,...customs];
 const [selId,setSelId]=useState(PRESETS[0].id);
 const sel=all.find(p=>p.id===selId)??PRESETS[0];
 const needs=colorsUsed(sel);

 return <>
  <div className="pw-stage is-shop">
   <p className="pw-ribbon">{t('爱绣小店','Stitch shop')}</p>
   <div className="pw-shelf" role="radiogroup" aria-label={t('图纸','Patterns')}>
    {all.map((p,i)=><div key={p.id} className="pw-sheet-wrap" style={{'--tilt':`${(i%3-1)*1.5}deg`} as CSSProperties}>
     <button type="button" role="radio" aria-checked={p.id===sel.id} className="pw-sheet" onClick={()=>setSelId(p.id)}>
      <PatternThumb pattern={p} className="pw-sheet-art"/>
      <strong>{p.name}</strong>
      <small>{t(`${colorsUsed(p).length} 色 · ${cellCount(p)} 格`,`${colorsUsed(p).length} colors · ${cellCount(p)} cells`)}</small>
      {p.custom&&<em>{t('我画的','Mine')}</em>}
     </button>
     {p.custom&&<button type="button" className="pw-sheet-del" aria-label={t(`删掉图纸「${p.name}」`,`Delete pattern ${p.name}`)} onClick={()=>onDelete(p.id)}>×</button>}
    </div>)}
    <div className="pw-sheet-wrap"><button type="button" className="pw-sheet is-new" onClick={onDraw}><span aria-hidden="true">＋</span><strong>{t('自己画图纸','Draw your own')}</strong><small>{t('16 × 16 格','16 × 16 grid')}</small></button></div>
   </div>
  </div>
  <div className="pw-tray">
   <div className="pw-pick">
    <PatternThumb pattern={sel} className="pw-pick-art"/>
    <div>
     <p className="pw-pick-name">{t(`「${sel.name}」图纸`,`${sel.name} pattern`)}</p>
     <p className="pw-pick-needs">{t('要用的毛线：','Yarn needed:')}{needs.map(n=><span key={n.yarn}><YarnBall yarn={n.yarn} size={22}/>{YARNS[n.yarn].name}</span>)}</p>
    </div>
   </div>
   <div className="pw-foot">
    <p>{t('选一张图纸，也可以自己画一张。','Pick a pattern, or draw your own.')}</p>
    <div className="pw-actions">
     {homeCount>0&&<button type="button" className="pw-btn is-lilac" onClick={onHome}>{t(`我的家园（${homeCount}）`,`My home (${homeCount})`)}</button>}
     <button type="button" className="pw-btn" onClick={()=>onPick(sel)}>{t('用这张图纸 →','Use this pattern →')}</button>
    </div>
   </div>
  </div>
 </>;
}

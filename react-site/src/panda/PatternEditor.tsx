import {useRef,useState,type PointerEvent} from 'react';
import {YarnBall} from './bits';
import {YARNS,cropCells,newId,type Pattern} from './yarn';
import {t} from '../i18n';

const W=16,H=16,C=26,P=12,MIN_CELLS=6;
type Tool='pen'|'eraser'|'fill';
const tools:{id:Tool;name:string}[]=[{id:'pen',name:t('画笔','Pen')},{id:'eraser',name:t('橡皮','Eraser')},{id:'fill',name:t('油漆桶','Fill')}];
const blank=()=>Array<number>(W*H).fill(-1);

function floodFill(cells:number[],start:number,value:number){
 const from=cells[start];if(from===value)return cells;
 const next=[...cells],stack=[start];
 while(stack.length){
  const i=stack.pop()!;if(next[i]!==from)continue;next[i]=value;
  const x=i%W,y=Math.floor(i/W);
  if(x>0)stack.push(i-1);if(x<W-1)stack.push(i+1);if(y>0)stack.push(i-W);if(y<H-1)stack.push(i+W);
 }
 return next;
}

export function PatternEditor({onSave,onCancel}:{onSave:(p:Pattern)=>void;onCancel:()=>void}){
 const [cells,setCells]=useState(blank);
 const [tool,setTool]=useState<Tool>('pen');
 const [color,setColor]=useState(0);
 const [mirror,setMirror]=useState(true);
 const [name,setName]=useState('');
 const history=useRef<number[][]>([]),drawing=useRef(false),svg=useRef<SVGSVGElement>(null);
 const used=cells.filter(c=>c>=0).length;

 const cellAt=(e:{clientX:number;clientY:number})=>{
  const m=svg.current?.getScreenCTM();if(!m)return null;
  const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse());
  const x=Math.floor((p.x-P)/C),y=Math.floor((p.y-P)/C);
  return x>=0&&y>=0&&x<W&&y<H?y*W+x:null;
 };
 // 画笔和橡皮开着对称时，左右两边一起画
 const paint=(i:number)=>setCells(prev=>{
  if(tool==='fill')return floodFill(prev,i,color);
  const v=tool==='pen'?color:-1,x=i%W,mi=i-x+(W-1-x),next=[...prev];
  next[i]=v;if(mirror)next[mi]=v;return next;
 });
 const down=(e:PointerEvent<SVGSVGElement>)=>{
  const i=cellAt(e);if(i===null)return;
  history.current.push(cells);if(history.current.length>40)history.current.shift();
  e.currentTarget.setPointerCapture(e.pointerId);drawing.current=tool!=='fill';paint(i);
 };
 const move=(e:PointerEvent<SVGSVGElement>)=>{if(!drawing.current)return;const i=cellAt(e);if(i!==null)paint(i)};
 const undo=()=>{const last=history.current.pop();if(last)setCells(last)};
 const clear=()=>{history.current.push(cells);setCells(blank())};
 const save=()=>{
  const crop=cropCells(W,H,cells);if(used<MIN_CELLS)return;
  onSave({id:newId(),name:name.trim()||t('我的图纸','My pattern'),...crop,custom:true});
 };

 return <>
  <div className="pw-stage is-draw">
   <p className="pw-ribbon">{t('画图纸','Draw a pattern')}</p>
   <svg ref={svg} viewBox={`0 0 ${W*C+P*2} ${H*C+P*2}`} className="pe-svg" role="application" aria-label={t('图纸画板，16 乘 16 格','Pattern canvas, 16 by 16')}
    onPointerDown={down} onPointerMove={move} onPointerUp={()=>{drawing.current=false}} onPointerCancel={()=>{drawing.current=false}}>
    <rect x={P-6} y={P-6} width={W*C+12} height={H*C+12} rx={10} fill="#fffdf6" stroke="#d8b889" strokeWidth={3}/>
    {cells.map((c,i)=>c<0?null:<rect key={i} x={P+(i%W)*C+.5} y={P+Math.floor(i/W)*C+.5} width={C-1} height={C-1} rx={3} fill={YARNS[c].color} stroke={YARNS[c].line} strokeWidth={1.2}/>)}
    <g stroke="#9fcbe6" pointerEvents="none">
     {Array.from({length:W+1},(_,i)=><line key={`v${i}`} x1={P+i*C} y1={P} x2={P+i*C} y2={P+H*C} strokeWidth={i%4?.6:1.3} opacity={i%4?.6:.9}/>)}
     {Array.from({length:H+1},(_,i)=><line key={`h${i}`} x1={P} y1={P+i*C} x2={P+W*C} y2={P+i*C} strokeWidth={i%4?.6:1.3} opacity={i%4?.6:.9}/>)}
    </g>
    {mirror&&<line x1={P+W*C/2} y1={P-4} x2={P+W*C/2} y2={P+H*C+4} stroke="#f39a4b" strokeWidth={1.6} strokeDasharray="6 5" pointerEvents="none"/>}
   </svg>
  </div>
  <div className="pw-tray">
   <div className="pw-row">
    {tools.map(k=><button type="button" key={k.id} className="pw-chip" aria-pressed={tool===k.id} onClick={()=>setTool(k.id)}>{k.name}</button>)}
    <button type="button" className="pw-chip" aria-pressed={mirror} onClick={()=>setMirror(m=>!m)}>{t('左右对称','Mirror')}</button>
    <button type="button" className="pw-chip" onClick={undo}>{t('撤销','Undo')}</button>
    <button type="button" className="pw-chip" onClick={clear}>{t('清空','Clear')}</button>
   </div>
   <div className="pw-yarns" role="radiogroup" aria-label={t('毛线颜色','Yarn colors')}>
    {YARNS.map((y,i)=><button type="button" key={y.id} role="radio" aria-checked={color===i} className="pw-yarn" onClick={()=>{setColor(i);if(tool==='eraser')setTool('pen')}}><YarnBall yarn={i} size={34}/><small>{y.name}</small></button>)}
   </div>
   <div className="pw-foot">
    <label className="pw-name">{t('图纸名字','Name')}<input value={name} maxLength={8} placeholder={t('我的图纸','My pattern')} onChange={e=>setName(e.target.value)}/></label>
    <div className="pw-actions">
     <button type="button" className="pw-btn is-lilac" onClick={onCancel}>{t('不画了','Cancel')}</button>
     <button type="button" className="pw-btn" disabled={used<MIN_CELLS} onClick={save}>{used<MIN_CELLS?t(`至少画 ${MIN_CELLS} 格`,`Draw ${MIN_CELLS}+ cells`):t('保存图纸 →','Save pattern →')}</button>
    </div>
   </div>
  </div>
 </>;
}

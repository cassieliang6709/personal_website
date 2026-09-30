import {useState} from 'react';
import {Shop} from './panda/Shop';
import {PatternEditor} from './panda/PatternEditor';
import {Loom} from './panda/Loom';
import {StitchFrame} from './panda/StitchFrame';
import {Stuffing} from './panda/Stuffing';
import {HomeRoom} from './panda/HomeRoom';
import {MAX_CUSTOM,MAX_HOME,loadCustom,loadHome,newId,randomTag,saveCustom,saveHome,type Pattern,type Work} from './panda/yarn';
import {setPet} from './panda/petStore';
import {t} from './i18n';

// 照奥比岛网页版淘宝街的爱绣坊：爱绣小店买图纸 → 美好纺织机纺线染色 → 绣工坊十字绣，最后塞棉花摆进家园
type Stage='shop'|'draw'|'spin'|'stitch'|'stuff'|'home';
const steps:{name:string;stages:Stage[]}[]=[
 {name:t('选图纸','Pattern'),stages:['shop','draw']},{name:t('纺线','Spin'),stages:['spin']},{name:t('刺绣','Stitch'),stages:['stitch']},
 {name:t('塞棉花','Stuff'),stages:['stuff']},{name:t('家园','Home'),stages:['home']},
];

export default function PandaSewing(){
 const [stage,setStage]=useState<Stage>('shop');
 const [pattern,setPattern]=useState<Pattern|null>(null);
 const [order,setOrder]=useState<number[]>([]);
 const [customs,setCustoms]=useState(loadCustom);
 const [works,setWorks]=useState(loadHome);
 const [currentId,setCurrentId]=useState<string|null>(null);
 // 每次换图纸都换一个 key，让各步从头开始
 const [run,setRun]=useState(0);

 const pick=(p:Pattern)=>{setPattern(p);setRun(r=>r+1);setStage('spin')};
 const saveDrawing=(p:Pattern)=>{const list=[p,...customs].slice(0,MAX_CUSTOM);setCustoms(list);saveCustom(list);pick(p)};
 const removeDrawing=(id:string)=>{const list=customs.filter(p=>p.id!==id);setCustoms(list);saveCustom(list)};
 const finish=()=>{
  if(!pattern)return;
  const work:Work={id:newId(),pattern,...randomTag(),at:Date.now()};
  const list=[work,...works].slice(0,MAX_HOME);
  setWorks(list);saveHome(list);setCurrentId(work.id);setStage('home');
 };
 const openHome=()=>{setCurrentId(null);setStage('home')};
 const clearHome=()=>{setWorks([]);saveHome([]);setCurrentId(null);setPet(null)};
 const current=steps.findIndex(s=>s.stages.includes(stage));

 return <div className="pw-board">
  <ol className="pw-steps" aria-label={t('制作步骤','Steps')}>
   {steps.map((s,i)=><li key={s.name} className={i<current?'is-done':i===current?'is-current':undefined} aria-current={i===current?'step':undefined}><span>{i<current?'✓':i+1}</span>{s.name}</li>)}
  </ol>
  {stage==='shop'&&<Shop customs={customs} homeCount={works.length} onPick={pick} onDraw={()=>setStage('draw')} onDelete={removeDrawing} onHome={openHome}/>}
  {stage==='draw'&&<PatternEditor onSave={saveDrawing} onCancel={()=>setStage('shop')}/>}
  {stage==='spin'&&pattern&&<Loom key={run} pattern={pattern} onDone={o=>{setOrder(o);setStage('stitch')}}/>}
  {stage==='stitch'&&pattern&&<StitchFrame key={run} pattern={pattern} order={order} onDone={()=>setStage('stuff')}/>}
  {stage==='stuff'&&pattern&&<Stuffing key={run} pattern={pattern} onDone={finish}/>}
  {stage==='home'&&<HomeRoom works={works} currentId={currentId} onNew={()=>{setCurrentId(null);setStage('shop')}} onClear={clearHome}/>}
 </div>;
}

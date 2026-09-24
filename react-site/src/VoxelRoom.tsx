import {useMemo,useRef,useState} from 'react';
import {Canvas,useFrame,useThree,type ThreeEvent} from '@react-three/fiber';
import {Bvh,Html,useTexture} from '@react-three/drei';
import {EffectComposer,N8AO,Outline,Select,Selection,TiltShift2} from '@react-three/postprocessing';
import {easing} from 'maath';
import * as THREE from 'three';
import oneDayIcon from './assets/1day-icon.png';
import tabspaceIcon from './assets/tabspace-icon.png';
import cities from './assets/albums/travel-cities.webp';

type Vec3=[number,number,number];
type Block={p:Vec3;s:Vec3;c:string};
type Spot={id:string;label:string;hint:string;href:string;stand:[number,number];blocks:Block[]};

const HALF=5,WALK=HALF-0.7;
const b=(p:Vec3,s:Vec3,c:string):Block=>({p,s,c});

// 房间骨架：地板格子 + 两面墙 + 窗户 + 地毯
const shell:Block[]=[
 ...Array.from({length:100},(_,i)=>{const x=i%10-4.5,z=Math.floor(i/10)-4.5;return b([x,-0.25,z],[1,0.5,1],(i%10+Math.floor(i/10))%2?'#e8cfa6':'#dfc193')}),
 b([0,2,-HALF-0.25],[10,4.5,0.5],'#fbf1e2'),
 b([-HALF-0.25,2,0],[0.5,4.5,10],'#f6e7d2'),
 b([0,-0.25,-HALF-0.25],[10.01,0.5,0.52],'#b98a5e'),
 b([1.5,2.3,-HALF+0.02],[2.2,1.6,0.08],'#9fd3ea'),
 b([1.5,2.3,-HALF+0.07],[0.1,1.6,0.06],'#fff'),
 b([1.5,2.3,-HALF+0.07],[2.2,0.1,0.06],'#fff'),
 b([0.6,0.02,0.6],[3.2,0.06,2.4],'#f2a79a'),
 b([0.6,0.05,0.6],[2.4,0.06,1.6],'#f7c6b8'),
];

const spots:Spot[]=[
 {id:'bed',label:'床边 · 关于我',hint:'我是谁、在学什么、一路怎么走过来。',href:'#resume',stand:[-2.2,0.8],blocks:[
  b([-3.6,0.3,-0.6],[2.2,0.6,3.4],'#c8956a'),b([-3.6,0.7,-0.6],[2,0.3,3.2],'#fffaf2'),b([-3.6,0.9,-1.8],[1.6,0.25,0.7],'#fff'),b([-3.6,0.88,0.2],[2.05,0.3,1.8],'#8fb8de'),b([-3.6,0.9,-2.35],[2.2,1.4,0.2],'#b07d52')]},
 {id:'desk',label:'工作桌 · 作品',hint:'1Day、Tabspace 和我正在做的产品。',href:'#flagship',stand:[3,-1.8],blocks:[
  b([3.2,1,-4.2],[2.8,0.15,1.2],'#d9a978'),b([2,0.5,-4.2],[0.15,1,1],'#b98a5e'),b([4.4,0.5,-4.2],[0.15,1,1],'#b98a5e'),
  b([3.2,1.3,-4.4],[1,0.45,0.06],'#333'),b([3.2,1.3,-4.36],[0.9,0.36,0.02],'#7cc4f0'),b([3.2,1.1,-4],[1,0.04,0.5],'#555'),
  b([2.2,1.2,-4.3],[0.2,0.25,0.2],'#e07a5f'),b([3.2,0.35,-3.1],[0.7,0.1,0.7],'#6d8fb3'),b([3.2,0.7,-3.4],[0.7,0.7,0.1],'#6d8fb3')]},
 {id:'shelf',label:'书架 · 文章与漫画',hint:'做东西的笔记、想法和小蘑菇漫画。',href:'#life',stand:[-2.8,-2.6],blocks:[
  b([-4.55,1.5,-3.2],[0.8,3,2],'#a8744a'),
  ...[0.45,1.25,2.05].flatMap(y=>[b([-4.3,y,-3.2],[0.35,0.03,1.8],'#8a5d3a'),...[0,1,2,3,4].map(k=>b([-4.3,y+0.3,-3.95+k*0.35],[0.3,0.55,0.25],['#e07a5f','#81b29a','#f2cc8f','#3d405b','#9fd3ea'][(k+Math.round(y))%5]))])]},
 {id:'jar',label:'存钱罐 · V 我 50',hint:'约我聊 30 分钟，或者支持我读完研究生。',href:'#support',stand:[2.6,2.4],blocks:[
  b([3.8,0.35,3.6],[0.9,0.7,0.9],'#b98a5e'),b([3.8,0.95,3.6],[0.6,0.5,0.6],'#ffd6de'),b([3.8,1.25,3.6],[0.3,0.08,0.06],'#6b4a3a'),b([3.5,0.95,3.6],[0.12,0.2,0.2],'#ffb8c6')]},
];

const decor:Block[]=[
 b([4.3,0.35,-1],[0.6,0.7,0.6],'#c17c56'),b([4.3,1,-1],[0.9,0.7,0.9],'#6aa56e'),b([4.3,1.5,-1],[0.5,0.4,0.5],'#86c08a'),
];

function Boxes({blocks}:{blocks:Block[]}){
 return <>{blocks.map((k,i)=><mesh key={i} position={k.p} castShadow receiveShadow><boxGeometry args={k.s}/><meshStandardMaterial color={k.c} roughness={0.85}/></mesh>)}</>;
}

function Avatar({target,onArrive}:{target:React.MutableRefObject<THREE.Vector3>;onArrive:()=>void}){
 const group=useRef<THREE.Group>(null),legL=useRef<THREE.Mesh>(null),legR=useRef<THREE.Mesh>(null);const moving=useRef(false);
 useFrame((state,dt)=>{
  const g=group.current;if(!g)return;const delta=target.current.clone().sub(g.position);delta.y=0;const dist=delta.length();
  if(dist>0.05){moving.current=true;const step=Math.min(dist,dt*2.8);g.position.addScaledVector(delta.normalize(),step);g.rotation.y=THREE.MathUtils.lerp(g.rotation.y,Math.atan2(delta.x,delta.z),0.25)}
  else if(moving.current){moving.current=false;onArrive()}
  const swing=moving.current?Math.sin(state.clock.elapsedTime*12)*0.5:0;
  if(legL.current)legL.current.rotation.x=swing;if(legR.current)legR.current.rotation.x=-swing;
  g.position.y=moving.current?Math.abs(Math.sin(state.clock.elapsedTime*12))*0.05:0;
 });
 const box=(p:Vec3,size:Vec3,c:string,ref?:React.Ref<THREE.Mesh>)=><mesh ref={ref} position={p} castShadow><boxGeometry args={size}/><meshStandardMaterial color={c} roughness={0.8}/></mesh>;
 return <group ref={group} position={[0,0,1.5]}>
  {box([-0.12,0.25,0],[0.18,0.5,0.2],'#4a6fa5',legL)}
  {box([0.12,0.25,0],[0.18,0.5,0.2],'#4a6fa5',legR)}
  {box([0,0.62,0],[0.5,0.26,0.3],'#4a6fa5')}
  {box([0,0.92,0],[0.5,0.36,0.3],'#f4ead8')}
  {box([0,0.86,0.155],[0.3,0.24,0.02],'#4a6fa5')}
  {box([-0.16,1.04,0.16],[0.06,0.2,0.02],'#4a6fa5')}
  {box([0.16,1.04,0.16],[0.06,0.2,0.02],'#4a6fa5')}
  {box([-0.3,0.9,0],[0.12,0.36,0.14],'#f4ead8')}
  {box([0.3,0.9,0],[0.12,0.36,0.14],'#f4ead8')}
  {box([0,1.38,0],[0.5,0.48,0.46],'#f8dcc4')}
  {box([0,1.64,-0.02],[0.6,0.14,0.56],'#3a2a24')}
  {box([0,1.54,0.25],[0.56,0.12,0.06],'#3a2a24')}
  {box([-0.29,1.3,-0.02],[0.08,0.5,0.56],'#3a2a24')}
  {box([0.29,1.3,-0.02],[0.08,0.5,0.56],'#3a2a24')}
  {box([0,1.3,-0.27],[0.6,0.56,0.08],'#3a2a24')}
  {box([0.22,1.56,0.22],[0.14,0.1,0.04],'#f4c542')}
  {box([-0.11,1.36,0.235],[0.07,0.09,0.02],'#2b2220')}
  {box([0.11,1.36,0.235],[0.07,0.09,0.02],'#2b2220')}
  {box([-0.16,1.26,0.235],[0.08,0.04,0.01],'#f2a79a')}
  {box([0.16,1.26,0.235],[0.08,0.04,0.01],'#f2a79a')}
 </group>;
}

// 墙上的画：两个产品图标和四座城市
function Posters(){
 const [day,tab,city]=useTexture([oneDayIcon,tabspaceIcon,cities]);
 [day,tab,city].forEach(t=>{t.colorSpace=THREE.SRGBColorSpace});
 const frames:[number,number,number,number,THREE.Texture][]=[[-2.6,2.7,1.2,1.2,city],[-1.1,3,0.7,0.7,day],[-1.1,2.1,0.7,0.7,tab]];
 return <>{frames.map(([x,y,w,h,map],i)=><group key={i} position={[x,y,-HALF+0.02]}>
  <mesh castShadow><boxGeometry args={[w+0.14,h+0.14,0.06]}/><meshStandardMaterial color="#fffaf2" roughness={0.9}/></mesh>
  <mesh position={[0,0,0.035]}><planeGeometry args={[w,h]}/><meshBasicMaterial map={map} toneMapped={false}/></mesh>
 </group>)}</>;
}

// 可点的家具上方浮着一个小标记
function Marker({position,hidden}:{position:Vec3;hidden:boolean}){
 const ref=useRef<THREE.Mesh>(null);
 useFrame(state=>{const m=ref.current;if(!m)return;m.position.y=position[1]+Math.sin(state.clock.elapsedTime*2.4+position[0])*0.12;m.rotation.y+=0.02;m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x,hidden?0:1,0.15))});
 return <mesh ref={ref} position={position}><octahedronGeometry args={[0.16]}/><meshBasicMaterial color="#0066cc"/></mesh>;
}

function Scene({onSpot,active,hover,setHover}:{onSpot:(id:string|null)=>void;active:string|null;hover:string|null;setHover:(id:string|null)=>void}){
 const target=useRef(new THREE.Vector3(0,0,1.5));const pending=useRef<string|null>(null);
 const walkTo=(x:number,z:number,spot:string|null)=>{target.current.set(THREE.MathUtils.clamp(x,-WALK,WALK),0,THREE.MathUtils.clamp(z,-WALK,WALK));pending.current=spot;onSpot(null)};
 const floorClick=(e:ThreeEvent<MouseEvent>)=>{e.stopPropagation();walkTo(e.point.x,e.point.z,null)};
 const spot=useMemo(()=>spots.find(s=>s.id===active),[active]);
 return <>
  <ambientLight intensity={1.1}/>
  <directionalLight position={[6,10,6]} intensity={1.6} castShadow shadow-mapSize={[2048,2048]} shadow-bias={-0.0004} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8}/>
  <group onClick={floorClick}><Boxes blocks={shell}/></group>
  <Boxes blocks={decor}/>
  {spots.map(s=><group key={s.id} onClick={e=>{e.stopPropagation();walkTo(s.stand[0],s.stand[1],s.id)}} onPointerOver={e=>{e.stopPropagation();setHover(s.id);document.body.style.cursor='pointer'}} onPointerOut={()=>{setHover(null);document.body.style.cursor=''}}>
   <Select enabled={hover===s.id||active===s.id}><Boxes blocks={s.blocks}/></Select>
  </group>)}
  {spots.map(s=>{const n=s.blocks.length,x=s.blocks.reduce((t,k)=>t+k.p[0],0)/n,z=s.blocks.reduce((t,k)=>t+k.p[2],0)/n,top=Math.max(...s.blocks.map(k=>k.p[1]+k.s[1]/2));return <Marker key={s.id} position={[x,top+0.38,z]} hidden={active===s.id}/>})}
  <Posters/>
  <Avatar target={target} onArrive={()=>{if(pending.current){onSpot(pending.current);pending.current=null}}}/>
  {spot&&<Html position={[spot.stand[0],3.6,spot.stand[1]]} center className="voxel-bubble"><strong>{spot.label}</strong><p>{spot.hint}</p><a href={spot.href}>去看看 →</a></Html>}
  <CameraRig/>
 </>;
}

// 镜头跟着鼠标轻微移动，做法来自 pmndrs/examples 的 shopping
function CameraRig(){
 const {size}=useThree();const far=Math.max(1,1.3/(size.width/size.height));// 竖屏时拉远，让整个房间都在画面里
 useFrame((state,dt)=>{easing.damp3(state.camera.position,[(17+state.pointer.x*1.5)*far,(14+state.pointer.y*1.2)*far,(17-state.pointer.x*1.5)*far],0.35,dt);state.camera.lookAt(0,0.6,0)});
 return null;
}

function Effects(){
 const {size}=useThree();
 return <EffectComposer stencilBuffer autoClear={false} multisampling={4}>
  <N8AO halfRes aoSamples={5} aoRadius={0.5} distanceFalloff={0.75} intensity={1.2}/>
  <Outline visibleEdgeColor={0xffffff} hiddenEdgeColor={0xffffff} blur width={size.width*1.25} edgeStrength={10}/>
  <TiltShift2 samples={5} blur={0.05}/>
 </EffectComposer>;
}

export default function VoxelRoom({onHover}:{onHover?:(label:string|null)=>void}){
 const [active,setActive]=useState<string|null>(null),[hover,setHoverState]=useState<string|null>(null);
 const setHover=(id:string|null)=>{setHoverState(id);onHover?.(spots.find(s=>s.id===id)?.label??null)};
 return <Canvas shadows flat dpr={[1,1.5]} gl={{antialias:false}} camera={{position:[17,14,17],fov:25,near:1,far:120}} onPointerMissed={()=>setActive(null)}>
  <color attach="background" args={['#f7efe4']}/>
  <Bvh firstHitOnly><Selection><Effects/><Scene onSpot={setActive} active={active} hover={hover} setHover={setHover}/></Selection></Bvh>
 </Canvas>;
}

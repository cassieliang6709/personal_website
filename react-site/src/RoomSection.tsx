import {lazy,Suspense,useState} from 'react';
import './voxel-room.css';

const VoxelRoom=lazy(()=>import('./VoxelRoom'));

export function RoomEntry({onOpen}:{onOpen:()=>void}){
 return <aside className="room-entry-wrap" aria-label="3D 房间入口"><button type="button" className="room-entry" onClick={onOpen}><span className="room-entry-cube" aria-hidden="true"/><span><small>SIDE QUEST</small><strong>来我的 3D 房间逛逛</strong></span><i aria-hidden="true">↗</i></button></aside>;
}

export function RoomPage({onExit}:{onExit:()=>void}){
 const [label,setLabel]=useState<string|null>(null);
 return <section className="room-page" aria-label="Yue 的 3D 房间">
  <Suspense fallback={<div className="room-loading">正在搭房间…</div>}><VoxelRoom onHover={setLabel}/></Suspense>
  <header className="room-overlay"><p className="eyebrow">YUE'S ROOM</p><h1>{label??'欢迎来我房间'}</h1><p>点地板走过去，点家具看看它通向哪里。</p></header>
  <button type="button" className="room-exit" onClick={onExit}>← 回主页</button>
 </section>;
}

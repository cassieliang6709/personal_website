import {lazy,Suspense,useState,type ReactNode} from 'react';
import {t} from './i18n';
import './voxel-room.css';

const VoxelRoom=lazy(()=>import('./VoxelRoom'));

// 主页底部的小入口：3D 房间和缝熊猫共用这一种胶囊按钮
export function SideQuestEntry({icon,title,label,onOpen}:{icon:ReactNode;title:string;label:string;onOpen:()=>void}){
 return <aside className="room-entry-wrap" aria-label={label}><button type="button" className="room-entry" onClick={onOpen}>{icon}<span><small>SIDE QUEST</small><strong>{title}</strong></span><i aria-hidden="true">↗</i></button></aside>;
}

export function RoomEntry({onOpen}:{onOpen:()=>void}){
 return <SideQuestEntry icon={<span className="room-entry-cube" aria-hidden="true"/>} title={t('来我的 3D 房间逛逛','Walk around my 3D room')} label={t('3D 房间入口','3D room entrance')} onOpen={onOpen}/>;
}

export function RoomPage({onExit}:{onExit:()=>void}){
 const [label,setLabel]=useState<string|null>(null);
 return <section className="room-page" aria-label={t('Yue 的 3D 房间',"Yue's 3D room")}>
  <Suspense fallback={<div className="room-loading">{t('正在搭房间…','Building the room…')}</div>}><VoxelRoom onHover={setLabel}/></Suspense>
  <header className="room-overlay"><p className="eyebrow">YUE'S ROOM</p><h1>{label??t('欢迎来我房间','Welcome to my room')}</h1><p>{t('点地板走过去，点家具看看它通向哪里。','Click the floor to walk. Click furniture to see where it leads.')}</p></header>
  <button type="button" className="room-exit" onClick={onExit}>{t('← 回主页','← Back home')}</button>
 </section>;
}

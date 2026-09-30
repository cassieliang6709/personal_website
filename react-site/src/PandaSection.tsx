import {lazy,Suspense} from 'react';
import {SideQuestEntry} from './RoomSection';
import {t} from './i18n';
import './panda-sewing.css';

const PandaSewing=lazy(()=>import('./PandaSewing'));

function PandaIcon(){
 return <span className="panda-entry-icon" aria-hidden="true"><svg viewBox="0 0 36 36"><circle cx="9" cy="10" r="5" fill="#2f2b2e"/><circle cx="27" cy="10" r="5" fill="#2f2b2e"/><ellipse cx="18" cy="20" rx="13" ry="11" fill="#fbf5ea"/><ellipse cx="13" cy="20" rx="3.2" ry="4.2" transform="rotate(30 13 20)" fill="#2f2b2e"/><ellipse cx="23" cy="20" rx="3.2" ry="4.2" transform="rotate(-30 23 20)" fill="#2f2b2e"/><ellipse cx="18" cy="25" rx="2" ry="1.4" fill="#2f2b2e"/></svg></span>;
}

export function PandaEntry({onOpen}:{onOpen:()=>void}){
 return <SideQuestEntry icon={<PandaIcon/>} title={t('去爱绣坊绣个玩偶','Stitch a plush friend')} label={t('爱绣坊小游戏入口','Stitch shop game entrance')} onOpen={onOpen}/>;
}

export function PandaPage({onExit}:{onExit:()=>void}){
 return <section className="panda-page" aria-labelledby="panda-title">
  <header className="panda-head"><div><p className="eyebrow">SIDE QUEST · 致敬奥比岛</p><h1 id="panda-title">{t('爱绣坊','Stitch shop')}</h1><p>{t('照着奥比岛网页版淘宝街的爱绣坊做的：选一张图纸或者自己画，纺线、十字绣、塞棉花，做好的玩偶会摆进你的家园。','A tribute to the cross-stitch shop in the old Aobi Island web game: pick or draw a pattern, spin yarn, cross-stitch, stuff it, and keep your plush at home.')}</p></div><button type="button" className="panda-exit" onClick={onExit}>{t('← 回主页','← Back home')}</button></header>
  <Suspense fallback={<div className="panda-loading">{t('正在铺布…','Laying out the fabric…')}</div>}><PandaSewing/></Suspense>
 </section>;
}

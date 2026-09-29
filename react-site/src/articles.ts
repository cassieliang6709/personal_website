import {createElement,type ReactNode} from 'react';
import '../../articles.js';
import {t} from './i18n';

// articles.js at the repo root is shared with the static site; it stores copy as [zh, en] pairs.
export type Article={id:string;cat:string;title:string[];meta:string[];deck:string[];body:string[][];comicEpisodes?:{title:string[];path:string;pages:number}[]};
export const articles=(window as unknown as {CASSIE_ARTICLES:Article[]}).CASSIE_ARTICLES;
export const categories=[{id:'build',label:t('做东西','Building')},{id:'reflection',label:t('想事情','Thinking')},{id:'life',label:t('生活记录','Life')}];

// Article bodies allow only a few inline tags; everything else renders as its text.
export function inline(text:string):ReactNode[]{
 const doc=new DOMParser().parseFromString(text,'text/html');
 const render=(node:Node,key:number):ReactNode=>{if(node.nodeType===Node.TEXT_NODE)return node.textContent;const tag=node.nodeName.toLowerCase();const children=Array.from(node.childNodes).map(render);return ['strong','em','code','br'].includes(tag)?createElement(tag,{key},tag==='br'?undefined:children):children};
 return Array.from(doc.body.childNodes).map(render);
}

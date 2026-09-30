import {useSyncExternalStore} from 'react';

// 正在跟着鼠标的玩偶 id。存在 localStorage，换页面、刷新之后还跟着。
// 这个文件会进主包，所以不引用游戏里的其他模块。
const KEY='aixiu:pet',EVENT='aixiu:pet';

// 存不进 localStorage（隐私模式等）时退回内存，只在这次打开时有效
let memory:string|null=null,storageOk=true;
const read=()=>{if(!storageOk)return memory;try{return localStorage.getItem(KEY)}catch{return memory}};
export function setPet(id:string|null){
 memory=id;
 try{if(id)localStorage.setItem(KEY,id);else localStorage.removeItem(KEY)}catch{storageOk=false}
 window.dispatchEvent(new Event(EVENT));
}
const subscribe=(cb:()=>void)=>{
 window.addEventListener(EVENT,cb);window.addEventListener('storage',cb);
 return()=>{window.removeEventListener(EVENT,cb);window.removeEventListener('storage',cb)};
};
export const usePetId=()=>useSyncExternalStore(subscribe,read,()=>null);

import {t} from '../i18n';

// ---- 毛线颜色 ----
const hex=(h:string)=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const mix=(a:string,b:string,k:number)=>{const x=hex(a),y=hex(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,'0')).join('')};
const luminance=(h:string)=>{const [r,g,b]=hex(h).map(v=>v/255);return .2126*r+.7152*g+.0722*b};

export type Yarn={id:string;name:string;color:string;dark:boolean;line:string;light:string};
const seeds:[string,string,string][]=[
 ['ink',t('炭黑','Charcoal'),'#2e2a2b'],['milk',t('奶白','Cream'),'#fbf6ec'],['gray',t('雾灰','Mist'),'#a9a4a0'],
 ['pink',t('樱花粉','Blossom'),'#f6b3c0'],['rose',t('桃红','Rose'),'#e8647a'],['orange',t('橘子','Orange'),'#f39a4b'],
 ['yellow',t('鹅黄','Butter'),'#f7d56b'],['green',t('草绿','Grass'),'#8cc86a'],['mint',t('薄荷','Mint'),'#a6dbc6'],
 ['sky',t('天蓝','Sky'),'#8cc8ee'],['navy',t('海蓝','Sea'),'#4a6fb5'],['grape',t('葡萄紫','Grape'),'#a58ad8'],
 ['tea',t('奶茶','Milk tea'),'#d6ad84'],['brown',t('可可','Cocoa'),'#8a5a3a'],
];
// 描边取毛线自己的深色，不用纯黑
export const YARNS:Yarn[]=seeds.map(([id,name,color])=>{
 const dark=luminance(color)<.4;
 return {id,name,color,dark,line:dark?mix(color,'#000000',.45):mix(color,'#4a2c16',.4),light:mix(color,'#ffffff',.4)};
});
const yarnIndex=(id:string)=>YARNS.findIndex(y=>y.id===id);

// ---- 图纸：cells 是毛线下标，-1 表示空格 ----
export type Pattern={id:string;name:string;w:number;h:number;cells:number[];custom?:boolean};

function fromArt(id:string,name:string,rows:string[],legend:Record<string,string>):Pattern{
 return {id,name,w:rows[0].length,h:rows.length,cells:rows.flatMap(r=>[...r].map(ch=>legend[ch]?yarnIndex(legend[ch]):-1))};
}
export const PRESETS:Pattern[]=[
 fromArt('panda',t('熊猫','Panda'),[
  '..KKK.....KKK..',
  '.KKKKWWWWWKKKK.',
  '.KKWWWWWWWWWKK.',
  '..WWWWWWWWWWW..',
  '.WWWWWWWWWWWWW.',
  '.WWKKWWWWWKKWW.',
  '.WKKKKWWWKKKKW.',
  '.WKKWKWWWKWKKW.',
  '.WWKKWWWWWKKWW.',
  '..PWWWWKWWWWP..',
  '...WWWWWWWWW...',
  '.KKWWWWWWWWWKK.',
  'KKKWWWWWWWWWKKK',
  'KKKWWWWWWWWWKKK',
  '.KKWWWWWWWWWKK.',
  '..KKKWWWWWKKK..',
  '.KKKKK...KKKKK.',
  '.KKKKK...KKKKK.',
 ],{K:'ink',W:'milk',P:'pink'}),
 fromArt('mushroom',t('小蘑菇','Mushroom'),[
  '....RRRRRR....',
  '..RRRRRRRRRR..',
  '.RRWWRRRRRRWR.',
  '.RWWWRRRRRWWR.',
  'RRRWRRRWWRRRRR',
  'RRRRRRWWWWRRRR',
  '.RRRRRRRRRRRR.',
  '...WWWWWWWW...',
  '...WKWWWWKW...',
  '...PWWKKWWP...',
  '...WWWWWWWW...',
  '....WWWWWW....',
 ],{R:'rose',W:'milk',K:'ink',P:'pink'}),
 fromArt('cat',t('橘猫','Ginger cat'),[
  'O.........O',
  'OO.......OO',
  'OPO.....OPO',
  'OOOOBOBOOOO',
  'OOOOOOOOOOO',
  'OOKOOOOOKOO',
  'OOKOOOOOKOO',
  'OPOOOPOOOPO',
  'OOOOKOKOOOO',
  '.OOOOOOOOO.',
  '..OOOOOOO..',
 ],{O:'orange',P:'pink',K:'ink',B:'brown'}),
 fromArt('berry',t('草莓','Strawberry'),[
  '...GGGG...',
  '..GGGGGG..',
  '.RRGRRGRR.',
  'RRRRRRRRRR',
  'RYRRRRYRRR',
  'RRRRYRRRRR',
  'RRYRRRRYRR',
  '.RRRRYRRR.',
  '..RRRRRR..',
  '...RRRR...',
  '....RR....',
 ],{G:'green',R:'rose',Y:'yellow'}),
];

// 用到的颜色和格数，格数多的排前面
export function colorsUsed(p:Pattern){
 const count=new Map<number,number>();
 p.cells.forEach(c=>{if(c>=0)count.set(c,(count.get(c)??0)+1)});
 return [...count.entries()].sort((a,b)=>b[1]-a[1]).map(([yarn,cells])=>({yarn,cells}));
}
export const cellCount=(p:Pattern)=>p.cells.filter(c=>c>=0).length;

// 自己画的图纸存盘前裁掉四周空白
export function cropCells(w:number,h:number,cells:number[]){
 let x0=w,y0=h,x1=-1,y1=-1;
 cells.forEach((c,i)=>{if(c<0)return;const x=i%w,y=Math.floor(i/w);x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)});
 if(x1<0)return {w:0,h:0,cells:[]};
 const W=x1-x0+1,H=y1-y0+1;
 return {w:W,h:H,cells:Array.from({length:W*H},(_,i)=>cells[(y0+Math.floor(i/W))*w+x0+i%W])};
}

// ---- 本地存档：自己的图纸、家园里的玩偶 ----
export type Work={id:string;pattern:Pattern;name:string;no:string;at:number};
const isPattern=(v:unknown):v is Pattern=>{
 const p=v as Pattern;
 return !!p&&typeof p.id==='string'&&typeof p.name==='string'&&Number.isInteger(p.w)&&Number.isInteger(p.h)&&p.w>0&&p.h>0&&p.w<=32&&p.h<=32
  &&Array.isArray(p.cells)&&p.cells.length===p.w*p.h&&p.cells.every(c=>Number.isInteger(c)&&c>=-1&&c<YARNS.length);
};
const isWork=(v:unknown):v is Work=>{const w=v as Work;return !!w&&typeof w.id==='string'&&typeof w.name==='string'&&typeof w.no==='string'&&typeof w.at==='number'&&isPattern(w.pattern)};
function load<T>(key:string,guard:(v:unknown)=>v is T):T[]{
 try{const raw=JSON.parse(localStorage.getItem(key)??'[]');return Array.isArray(raw)?raw.filter(v=>guard(v)):[]}catch{return []}
}
function save(key:string,list:unknown[]){try{localStorage.setItem(key,JSON.stringify(list))}catch{/* 隐私模式或存满了：只是不存档 */}}
const PATTERN_KEY='aixiu:patterns',HOME_KEY='aixiu:home';
export const MAX_CUSTOM=6,MAX_HOME=7;
export const loadCustom=()=>load(PATTERN_KEY,isPattern);
export const saveCustom=(list:Pattern[])=>save(PATTERN_KEY,list.slice(0,MAX_CUSTOM));
export const loadHome=()=>load(HOME_KEY,isWork);
export const saveHome=(list:Work[])=>save(HOME_KEY,list.slice(0,MAX_HOME));
export const newId=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);

const names=[t('团团','Tuan'),t('圆圆','Yuan'),t('豆包','Bao'),t('糯米','Mochi'),t('汤圆','Dumpling'),t('芝麻','Sesame'),t('棉花糖','Marshmallow'),t('小笼包','Bun')];
export const randomTag=()=>({name:names[Math.floor(Math.random()*names.length)],no:String(Math.floor(Math.random()*900)+100)});

// ---- 毛毡纹理：canvas 上随机画短纤维，只生成一次 ----
let feltUrl='';
export function feltTexture(){
 if(feltUrl||typeof document==='undefined')return feltUrl;
 const s=120,c=document.createElement('canvas');c.width=c.height=s;const g=c.getContext('2d');if(!g)return '';
 for(let i=0;i<800;i++){
  const x=Math.random()*s,y=Math.random()*s,a=Math.random()*Math.PI,l=2+Math.random()*5;
  g.strokeStyle=Math.random()<.5?`rgba(255,255,255,${.06+Math.random()*.08})`:`rgba(60,40,20,${.03+Math.random()*.04})`;
  g.lineWidth=.5+Math.random()*.7;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke();
 }
 return feltUrl=c.toDataURL('image/png');
}

// 把玩偶 SVG 画到 canvas 上导出 PNG；SVG 的颜色都写在属性上，序列化后样子不变
export async function renderPng(svg:SVGSVGElement,caption:string){
 const vb=svg.viewBox.baseVal,scale=Math.min(700/vb.width,760/vb.height),W=Math.round(vb.width*scale),H=Math.round(vb.height*scale);
 const clone=svg.cloneNode(true) as SVGSVGElement;
 clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('width',String(W));clone.setAttribute('height',String(H));
 const img=new Image();
 img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(clone));
 await img.decode();
 const canvas=document.createElement('canvas');canvas.width=800;canvas.height=960;
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('canvas-unavailable');
 const bg=ctx.createRadialGradient(400,440,60,400,440,620);bg.addColorStop(0,'#fff8e1');bg.addColorStop(1,'#f7d89a');
 ctx.fillStyle=bg;ctx.fillRect(0,0,800,960);ctx.drawImage(img,(800-W)/2,40+(800-H)/2,W,H);
 ctx.fillStyle='#7a4a1c';ctx.font='700 30px -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif';ctx.textAlign='center';
 ctx.fillText(caption,400,915);
 return new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('png-encode-failed')),'image/png'));
}

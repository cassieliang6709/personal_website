import {useEffect,useRef,useState} from 'react';
import {ALIPAY_QR,CALENDLY_URL,FUND_AMOUNT} from './siteConfig';
import './support.css';

function useDialog(open:boolean){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(!open){ref.current?.close();return}const overflow=document.body.style.overflow;ref.current?.showModal();document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow}},[open]);
 return ref;
}

function CalendlyCard(){
 const [open,setOpen]=useState(false);const dialog=useDialog(open);const close=()=>{dialog.current?.close();setOpen(false)};
 const embed=CALENDLY_URL?`${CALENDLY_URL}${CALENDLY_URL.includes('?')?'&':'?'}hide_gdpr_banner=1`:'';
 return <article className="support-card calendly-card"><small>CHAT · 30 MIN</small><h3>约我聊 30 分钟</h3><p>聊 AI 应用、产品、求职，或者你手上一个想做的东西。选一个你方便的时间就行。</p><button type="button" className="support-primary" disabled={!CALENDLY_URL} onClick={()=>setOpen(true)}>{CALENDLY_URL?'选一个时间 ↗':'日程链接准备中'}</button>
  <dialog ref={dialog} className="reading-sheet support-sheet calendly-sheet" aria-labelledby="calendly-title" onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)close()}}><header><div><p className="eyebrow">CALENDLY</p><h2 id="calendly-title">约一个时间</h2></div><button onClick={close} aria-label="关闭日程">×</button></header>{open&&embed&&<iframe src={embed} title="Calendly 预约"/>}<footer><a href={CALENDLY_URL} target="_blank" rel="noreferrer">在新标签页打开 ↗</a></footer></dialog>
 </article>;
}

function FundCard(){
 const [open,setOpen]=useState(false);const dialog=useDialog(open);const close=()=>{dialog.current?.close();setOpen(false)};
 return <article className="support-card fund-card"><small>FUND PLAN · 研究生学业</small><h3>V 我 {FUND_AMOUNT}，<br/>助我读完研究生。</h3><p>我在 San Jose 读研究生，学 AI，学费和生活费都不便宜。如果这里的东西对你有一点用，可以请我吃顿饭。每一笔我都会认真收下。</p><button type="button" className="support-primary fund-button" onClick={()=>setOpen(true)}>支付宝 · V 我 {FUND_AMOUNT} ↗</button>
  <dialog ref={dialog} className="reading-sheet support-sheet fund-sheet" aria-labelledby="fund-title" onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)close()}}><header><div><p className="eyebrow">ALIPAY</p><h2 id="fund-title">V 我 {FUND_AMOUNT}</h2></div><button onClick={close} aria-label="关闭支付宝二维码">×</button></header><div className="fund-qr">{ALIPAY_QR?<img src={ALIPAY_QR} alt={`Yue 的支付宝收款码，建议金额 ${FUND_AMOUNT} 元`}/>:<div className="qr-placeholder">收款码准备中</div>}<p>打开支付宝扫一扫。建议 ¥{FUND_AMOUNT}，多少都行，备注里留个名字我会记得。</p></div></dialog>
 </article>;
}

export function SupportSection(){
 return <section id="support" className="life-section support-section"><header><p className="eyebrow">05 / SUPPORT</p><h2>聊一聊，或者 V 我 {FUND_AMOUNT}</h2><span>两种方式都欢迎。</span></header><div className="support-grid"><CalendlyCard/><FundCard/></div></section>;
}

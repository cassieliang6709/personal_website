import {useEffect,useRef,useState} from 'react';
import {ALIPAY_QR,BOOKING_URL,FUND_AMOUNT} from './siteConfig';
import {t} from './i18n';
import './support.css';

function useDialog(open:boolean){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(!open){ref.current?.close();return}const overflow=document.body.style.overflow;ref.current?.showModal();document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow}},[open]);
 return ref;
}

function BookingCard(){
 const label=t('约我聊 15 分钟','Book a 15-minute chat');
 return <article className="support-card booking-card"><small>GOOGLE MEET · 15 MIN</small><h3>{label}</h3><p>{t('聊 AI 应用、产品、求职，或者你手上一个想做的东西。选一个你方便的时间就行。','AI apps, products, job search, or something you want to build. Pick any time that works for you.')}</p>
  {BOOKING_URL?<a className="support-primary" href={BOOKING_URL} target="_blank" rel="noreferrer">{t('选一个时间 ↗','Pick a time ↗')}</a>:<button type="button" className="support-primary" disabled>{t('日程链接准备中','Booking link coming soon')}</button>}
 </article>;
}

function FundCard(){
 const [open,setOpen]=useState(false);const dialog=useDialog(open);const close=()=>{dialog.current?.close();setOpen(false)};
 return <article className="support-card fund-card"><small>{t('FUND PLAN · 研究生学业','FUND PLAN · GRAD SCHOOL')}</small><h3>{t(`V 我 ${FUND_AMOUNT}，`,`Chip in ¥${FUND_AMOUNT},`)}<br/>{t('助我读完研究生。','help me finish grad school.')}</h3><p>{t('我在 San Jose 读研究生，学 AI，学费和生活费都不便宜。如果这里的东西对你有一点用，可以请我吃顿饭。每一笔我都会认真收下。','I study AI as a grad student in San Jose, and tuition and rent add up. If something here helped you, you can buy me a meal. I read every note.')}</p><button type="button" className="support-primary fund-button" onClick={()=>setOpen(true)}>{t(`支付宝 · V 我 ${FUND_AMOUNT} ↗`,`Alipay · ¥${FUND_AMOUNT} ↗`)}</button>
  <dialog ref={dialog} className="reading-sheet support-sheet fund-sheet" aria-labelledby="fund-title" onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)close()}}><header><div><p className="eyebrow">ALIPAY</p><h2 id="fund-title">{t(`V 我 ${FUND_AMOUNT}`,`Chip in ¥${FUND_AMOUNT}`)}</h2></div><button onClick={close} aria-label={t('关闭支付宝二维码','Close Alipay QR code')}>×</button></header><div className="fund-qr">{ALIPAY_QR?<img src={ALIPAY_QR} alt={t(`Yue 的支付宝收款码，建议金额 ${FUND_AMOUNT} 元`,`Yue's Alipay QR code, suggested ¥${FUND_AMOUNT}`)}/>:<div className="qr-placeholder">{t('收款码准备中','QR code coming soon')}</div>}<p>{t(`打开支付宝扫一扫。建议 ¥${FUND_AMOUNT}，多少都行，备注里留个名字我会记得。`,`Scan with Alipay. ¥${FUND_AMOUNT} is a suggestion; any amount is fine. Leave your name in the note.`)}</p></div></dialog>
 </article>;
}

export function SupportSection(){
 return <section id="support" className="life-section support-section"><header><p className="eyebrow">04 / SUPPORT</p><h2>{t(`聊一聊，或者 V 我 ${FUND_AMOUNT}`,`Chat, or chip in ¥${FUND_AMOUNT}`)}</h2><span>{t('两种方式都欢迎。','Either is welcome.')}</span></header><div className="support-grid"><BookingCard/><FundCard/></div></section>;
}

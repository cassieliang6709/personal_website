import { lazy, Suspense, useEffect, useState } from 'react';
import frontImage from './assets/card-front.svg';
import backImage from './assets/card-back.svg';
import bandImage from './assets/lanyard-band.svg';

const FALLBACK_QUERY = '(max-width: 760px), (prefers-reduced-motion: reduce)';
const Lanyard = lazy(() => import('./Lanyard.jsx'));

function useStaticFallback() {
  const [isStatic, setIsStatic] = useState(() =>
    typeof window === 'undefined' ? true : window.matchMedia(FALLBACK_QUERY).matches
  );

  useEffect(() => {
    const media = window.matchMedia(FALLBACK_QUERY);
    const update = () => setIsStatic(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return isStatic;
}

function StaticPass() {
  return (
    <div className="static-lanyard" aria-label="Cassie 的 Builder Pass 静态预览">
      <div className="static-band" aria-hidden="true" />
      <img src={frontImage} alt="Yue Cassie Liang 的 Builder Pass" />
    </div>
  );
}

export default function App() {
  const isStatic = useStaticFallback();

  return (
    <div className="demo-shell">
      <header className="demo-topbar">
        <a className="wordmark" href="../index.html" aria-label="返回 Cassie 的主页">
          <img src="/cassie-avatar.png" alt="" />
          <span>
            <strong>Yue(Cassie) Liang</strong>
            <small>AI 硕士在读 · 独立开发者</small>
          </span>
        </a>
        <span className="demo-tag">INTERACTION STUDY · 01</span>
      </header>

      <main>
        <section className="demo-intro" aria-labelledby="demo-title">
          <div>
            <p className="eyebrow">BUILDER PASS · CONCEPT DEMO</p>
            <h1 id="demo-title">让自我介绍变成一件可以碰的舞台道具。</h1>
          </div>
          <div className="intro-note">
            <p>
              工作牌从微缩舞台上方垂下来。它不是另一个导航，而是一张带着名字、身份和当前状态的“入场证”。
            </p>
            <p className="interaction-note">
              {isStatic ? '当前使用静态预览。桌面端可拖动工作牌。' : '抓住工作牌拖动；松手后它会自然落回舞台。'}
            </p>
          </div>
        </section>

        <section className="stage-shell" aria-label="Builder Pass 在首页舞台中的效果预览">
          <img
            className="stage-art"
            src="/home-stage-theatre.webp"
            alt="暖色微缩舞台房间，工作牌从舞台上沿垂下"
          />
          <div className="stage-wash" aria-hidden="true" />
          <div className="scene-label" aria-hidden="true">
            <span>SCENE 01</span>
            <strong>BUILDER PASS</strong>
          </div>

          <div className={`lanyard-host${isStatic ? ' is-static' : ''}`}>
            {isStatic ? (
              <StaticPass />
            ) : (
              <Suspense fallback={<div className="loading-pass">正在挂上工作牌…</div>}>
                <Lanyard
                  position={[0, 0, 25]}
                  gravity={[0, -34, 0]}
                  fov={22}
                  frontImage={frontImage}
                  backImage={backImage}
                  imageFit="cover"
                  lanyardImage={bandImage}
                  lanyardWidth={0.78}
                />
              </Suspense>
            )}
          </div>

          <p className="stage-hint">
            <span aria-hidden="true">↖</span>
            DRAG THE PASS
          </p>
        </section>

        <aside className="design-note">
          <span>WHY HERE</span>
          <p>它占用的是舞台左侧的空气，不盖住 Cassie、工作桌或原有的房间入口。</p>
          <p>真正接入主页时，只需把这一块做成独立 React island；其他页面仍然保持原生 HTML。</p>
        </aside>
      </main>
    </div>
  );
}

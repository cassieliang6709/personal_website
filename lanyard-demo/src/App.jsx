import { lazy, Suspense, useEffect, useRef, useState } from 'react';
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

export function CompatiblePass({ interactive = false }) {
  const hostRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0, dx: 0, dy: 0 });
  const [size, setSize] = useState({ width: 320, height: 520 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const cardTop = size.height * 0.34;
  const bandLength = Math.max(40, Math.hypot(offset.x, cardTop + offset.y));
  const bandAngle = Math.atan2(-offset.x, cardTop + offset.y);
  const rotation = Math.max(-10, Math.min(10, offset.x * 0.035));

  const release = event => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={hostRef}
      className={`compatible-pass${isDragging ? ' is-dragging' : ''}`}
      aria-label={`Cassie 的 Builder Pass${interactive ? '，可以拖动' : '静态预览'}`}
    >
      <div
        className="compatible-band"
        aria-hidden="true"
        style={{
          height: `${bandLength}px`,
          transform: `translateX(-50%) rotate(${bandAngle}rad)`
        }}
      />
      <div
        className="compatible-card"
        style={{
          top: `${cardTop}px`,
          transform: `translate(-50%, 0) translate(${offset.x}px, ${offset.y}px) rotate(${rotation - 3}deg)`
        }}
        onPointerDown={event => {
          if (!interactive) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          dragStart.current = {
            x: event.clientX,
            y: event.clientY,
            dx: offset.x,
            dy: offset.y
          };
          setIsDragging(true);
        }}
        onPointerMove={event => {
          if (!isDragging) return;
          const nextX = dragStart.current.dx + event.clientX - dragStart.current.x;
          const nextY = dragStart.current.dy + event.clientY - dragStart.current.y;
          setOffset({
            x: Math.max(-size.width * 0.4, Math.min(size.width * 0.4, nextX)),
            y: Math.max(-size.height * 0.2, Math.min(size.height * 0.3, nextY))
          });
        }}
        onPointerUp={release}
        onPointerCancel={release}
      >
        <img src={frontImage} alt="Yue Cassie Liang 的 Builder Pass" draggable="false" />
      </div>
    </div>
  );
}

export default function App() {
  const isStatic = useStaticFallback();
  const [mode, setMode] = useState('compatible');
  const showThreeD = mode === '3d' && !isStatic;

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
              {isStatic
                ? '当前使用静态预览。桌面端可拖动工作牌。'
                : showThreeD
                  ? '当前为 3D 物理模式；如未显示，可切回兼容模式。'
                  : '抓住工作牌拖动；松手后它会弹回舞台上方。'}
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

          {!isStatic && (
            <div className="render-mode" aria-label="工作牌渲染模式">
              <button
                type="button"
                className={mode === 'compatible' ? 'is-active' : ''}
                aria-pressed={mode === 'compatible'}
                onClick={() => setMode('compatible')}
              >
                兼容预览
              </button>
              <button
                type="button"
                className={mode === '3d' ? 'is-active' : ''}
                aria-pressed={mode === '3d'}
                onClick={() => setMode('3d')}
              >
                3D 物理
              </button>
            </div>
          )}

          <div className={`lanyard-host${showThreeD ? ' is-three-d' : ' is-compatible'}`}>
            {showThreeD ? (
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
            ) : (
              <CompatiblePass interactive={!isStatic} />
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

import { useEffect, useRef } from 'react';

export default function Cursor() {
  const curRef = useRef(null);
  const curRRef = useRef(null);
  const mx = useRef(0), my = useRef(0), rx = useRef(0), ry = useRef(0);

  useEffect(() => {
    const onMove = (e) => {
      mx.current = e.clientX; my.current = e.clientY;
      if (curRef.current) {
        curRef.current.style.left = mx.current + 'px';
        curRef.current.style.top = my.current + 'px';
      }
    };
    document.addEventListener('mousemove', onMove);

    let raf;
    const loop = () => {
      rx.current += (mx.current - rx.current) * 0.11;
      ry.current += (my.current - ry.current) * 0.11;
      if (curRRef.current) {
        curRRef.current.style.left = rx.current + 'px';
        curRRef.current.style.top = ry.current + 'px';
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const els = () => document.querySelectorAll('a,button,.m-card,.svc-card,.stat-card,.process-card,.testi-card');
    const enterFn = () => {
      if (curRef.current) Object.assign(curRef.current.style, { width: '18px', height: '18px', background: 'transparent', border: '2px solid var(--coral)' });
      if (curRRef.current) Object.assign(curRRef.current.style, { width: '54px', height: '54px', borderColor: 'rgba(232,96,58,.4)' });
    };
    const leaveFn = () => {
      if (curRef.current) Object.assign(curRef.current.style, { width: '14px', height: '14px', background: 'var(--coral)', border: 'none' });
      if (curRRef.current) Object.assign(curRRef.current.style, { width: '40px', height: '40px', borderColor: 'var(--coral)' });
    };

    const attach = () => {
      els().forEach((el) => { el.addEventListener('mouseenter', enterFn); el.addEventListener('mouseleave', leaveFn); });
    };
    attach();
    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div id="cur" ref={curRef} />
      <div id="cur-r" ref={curRRef} />
    </>
  );
}

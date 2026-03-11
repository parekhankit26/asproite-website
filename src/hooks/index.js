import { useEffect, useRef, useState } from 'react';

// ── useScrollReveal ──────────────────────────────────────
// Uses MutationObserver to catch .reveal elements that appear
// AFTER async data loads — not just the ones present on mount.
export function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    // Register any element not yet visible
    const register = () => {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
        if (!el.classList.contains('visible')) io.observe(el);
      });
    };

    register(); // pick up elements already in DOM

    // Watch for elements added after async data loads
    const mo = new MutationObserver(register);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, []); // runs once — MutationObserver handles everything after that
}

// ── useCounter ───────────────────────────────────────────
export function useCounter(target, duration = 1800) {
  const [count, setCount]     = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return [count, ref];
}

// ── useNeuralCanvas ──────────────────────────────────────
// Optimised: squared-distance culling, fewer nodes, no sqrt in hot path
export function useNeuralCanvas(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, animId;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Reduced from 85 → 55 nodes (O(n²) = 55*54/2 = 1485 vs 3570 checks)
    const nodes = Array.from({ length: 55 }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 1.6 + 0.6,
    }));

    // Only update mouse ref, no state changes (passive listener)
    const onMouse = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    document.addEventListener('mousemove', onMouse, { passive: true });

    // Pre-compute squared thresholds — avoids sqrt in hot path
    const CONNECT_DIST_SQ = 130 * 130; // squared connection distance
    const MOUSE_DIST_SQ   = 120 * 120; // squared mouse repulsion distance
    const MAX_SPEED_SQ    = 1.3 * 1.3;
    let lastTs = 0;
    const TARGET_FPS = 40;
    const FRAME_MS   = 1000 / TARGET_FPS;

    const draw = (ts) => {
      animId = requestAnimationFrame(draw);
      if (ts - lastTs < FRAME_MS) return; // throttle to 40fps
      lastTs = ts;
      ctx.clearRect(0, 0, W, H);

      // Update positions & mouse repulsion
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;

        // Mouse repulsion — use squared distance
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const dSq = dx * dx + dy * dy;
        if (dSq < MOUSE_DIST_SQ && dSq > 0) {
          const d = Math.sqrt(dSq); // sqrt only when within range (~few nodes at most)
          n.vx += (dx / d) * 0.05;
          n.vy += (dy / d) * 0.05;
        }

        // Speed cap — squared comparison
        const spSq = n.vx * n.vx + n.vy * n.vy;
        if (spSq > MAX_SPEED_SQ) {
          const sp = Math.sqrt(spSq);
          n.vx = (n.vx / sp) * 1.3;
          n.vy = (n.vy / sp) * 1.3;
        }
      }

      // Draw connections — use squared distance to skip sqrt on most pairs
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dSq = dx * dx + dy * dy;
          if (dSq < CONNECT_DIST_SQ) {
            const alpha = (1 - dSq / CONNECT_DIST_SQ) * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,212,255,${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes (batch all in one path for fewer ctx state changes)
      ctx.fillStyle = 'rgba(0,212,255,0.7)';
      ctx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        ctx.moveTo(nodes[i].x + nodes[i].r, nodes[i].y);
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
      }
      ctx.fill();
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', onMouse);
    };
  }, []); // stable ref — run once on mount
}

// ── useTyping ─────────────────────────────────────────────
export function useTyping(phrases, speed = 90, deleteSpeed = 55, pauseTime = 1800) {
  const [text, setText] = useState('');
  const state = useRef({ pi: 0, ci: 0, deleting: false });
  const phrasesKey = phrases.join('||');

  useEffect(() => {
    state.current = { pi: 0, ci: 0, deleting: false };
    setText('');
    let timeout;
    const tick = () => {
      const { pi, ci, deleting } = state.current;
      const word = phrases[pi];
      if (!word) return;
      if (!deleting) {
        setText(word.slice(0, ci + 1));
        state.current.ci++;
        if (state.current.ci === word.length) {
          state.current.deleting = true;
          timeout = setTimeout(tick, pauseTime);
          return;
        }
      } else {
        setText(word.slice(0, ci - 1));
        state.current.ci--;
        if (state.current.ci === 0) {
          state.current.deleting = false;
          state.current.pi = (pi + 1) % phrases.length;
        }
      }
      timeout = setTimeout(tick, deleting ? deleteSpeed : speed);
    };
    timeout = setTimeout(tick, speed);
    return () => clearTimeout(timeout);
  }, [phrasesKey]);

  return text;
}

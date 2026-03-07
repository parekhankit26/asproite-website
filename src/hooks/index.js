import { useEffect, useRef, useState } from 'react';

// ── useScrollReveal ──────────────────────────────────────
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });
}

// ── useCounter ───────────────────────────────────────────
export function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return [count, ref];
}

// ── useNeuralCanvas ──────────────────────────────────────
export function useNeuralCanvas(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let W, H, animId;
    const mouse = { x: -999, y: -999 };

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 85; i++) {
      nodes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.8 + 0.8,
      });
    }

    const onMouse = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    document.addEventListener('mousemove', onMouse);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) { n.vx += (dx / d) * 0.06; n.vy += (dy / d) * 0.06; }
        const sp = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (sp > 1.4) { n.vx /= sp * 0.9; n.vy /= sp * 0.9; }
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,212,255,${(1 - d / 140) * 0.28})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,212,255,0.75)';
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', onMouse);
    };
  }, [canvasRef]);
}

// ── useTyping ─────────────────────────────────────────────
export function useTyping(phrases, speed = 90, deleteSpeed = 55, pauseTime = 1800) {
  const [text, setText] = useState('');
  const state = useRef({ pi: 0, ci: 0, deleting: false });
  // Use a stable key derived from the phrases so the effect restarts
  // when phrases change (e.g. after admin saves new typing phrases)
  const phrasesKey = phrases.join('||');

  useEffect(() => {
    // Reset state so we start fresh with the new phrases
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
  }, [phrasesKey]); // re-run whenever phrases content changes

  return text;
}

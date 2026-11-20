import { useEffect, useRef } from 'react';

import { neural, type NeuralBurst } from '@/features/neural/neuralBus';
import { useTheme, type ColorScheme } from '@/theme';

/**
 * A living neural network behind the whole app: ~1,000 neurons wired to their
 * nearest neighbours. Neurons fire on their own now and then, sending pulses
 * down their connections in small cascades; a tap fires the neurons under the
 * finger, and app events (neural.burst) set off bigger waves.
 *
 * Drawn on a single <canvas>: the static network is painted once to an
 * offscreen canvas, and each frame only adds the pulses and glows on top.
 */

type Palette = {
  edge: string;
  node: string;
  hub: string;
  pulses: string[];
  additive: boolean;
  /** Soft background washes: [color, x, y, radius] as fractions of the field. */
  washes: [string, number, number, number][];
};

const PALETTES: Record<ColorScheme, Palette> = {
  dark: {
    edge: 'rgba(160, 148, 255, 0.085)',
    node: 'rgba(190, 178, 255, 0.32)',
    hub: 'rgba(214, 204, 255, 0.55)',
    pulses: ['#9C88FF', '#FF5CAD', '#47BCFF', '#CDBDFF'],
    additive: true,
    washes: [
      ['rgba(108, 77, 255, 0.22)', 0.82, 0.18, 0.55],
      ['rgba(255, 79, 163, 0.13)', 0.1, 0.05, 0.45],
      ['rgba(56, 182, 255, 0.10)', 0.15, 0.92, 0.5],
    ],
  },
  light: {
    edge: 'rgba(108, 77, 255, 0.10)',
    node: 'rgba(108, 77, 255, 0.24)',
    hub: 'rgba(108, 77, 255, 0.42)',
    pulses: ['#6C4DFF', '#FF4FA3', '#2FA8FF'],
    additive: false,
    washes: [
      ['rgba(255, 79, 163, 0.12)', 0.08, 0.04, 0.45],
      ['rgba(108, 77, 255, 0.10)', 0.85, 0.3, 0.5],
      ['rgba(255, 210, 63, 0.16)', 0.12, 0.95, 0.45],
    ],
  },
};

const MARGIN = 28; // extra field around the viewport for the slow drift
const NEIGHBOURS = 3;
const SPEED = 0.15; // px per ms along a connection
const REFRACTORY_MS = 1600;
const GLOW_MS = 1100;
const TRAIL = 0.45; // trail length as a fraction of the connection
const MAX_GENERATIONS = 12;

type Network = {
  count: number;
  width: number;
  height: number;
  xs: Float32Array;
  ys: Float32Array;
  sizes: Float32Array;
  adjacency: number[][];
  edges: number[];
};

type Pulse = { from: number; to: number; t: number; duration: number; generation: number; power: number; color: number };

function buildNetwork(viewWidth: number, viewHeight: number, target: number): Network {
  const width = viewWidth + MARGIN * 2;
  const height = viewHeight + MARGIN * 2;
  const cols = Math.max(1, Math.round(Math.sqrt((target * width) / height)));
  const rows = Math.max(1, Math.ceil(target / cols));
  const cellW = width / cols;
  const cellH = height / rows;
  const count = cols * rows;
  const xs = new Float32Array(count);
  const ys = new Float32Array(count);
  const sizes = new Float32Array(count);

  // Jittered grid: evenly spread but organic-looking.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      xs[i] = (c + 0.1 + Math.random() * 0.8) * cellW;
      ys[i] = (r + 0.1 + Math.random() * 0.8) * cellH;
      sizes[i] = Math.random() < 0.06 ? 1.7 + Math.random() * 0.9 : 0.7 + Math.random() * 0.55;
    }
  }

  // Connect each neuron to its nearest neighbours (searching nearby grid cells).
  const adjacency: number[][] = Array.from({ length: count }, () => []);
  const edges: number[] = [];
  const linked = new Set<number>();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const nearest: { j: number; d: number }[] = [];
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const rr = r + dr;
          const cc = c + dc;
          if ((dr === 0 && dc === 0) || rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue;
          const j = rr * cols + cc;
          const dx = xs[j] - xs[i];
          const dy = ys[j] - ys[i];
          nearest.push({ j, d: dx * dx + dy * dy });
        }
      }
      nearest.sort((a, b) => a.d - b.d);
      for (const { j } of nearest.slice(0, NEIGHBOURS)) {
        const key = i < j ? i * count + j : j * count + i;
        if (linked.has(key)) continue;
        linked.add(key);
        adjacency[i].push(j);
        adjacency[j].push(i);
        edges.push(i, j);
      }
    }
  }

  return { count, width, height, xs, ys, sizes, adjacency, edges };
}

function paintBase(base: HTMLCanvasElement, net: Network, palette: Palette, dpr: number) {
  base.width = Math.ceil(net.width * dpr);
  base.height = Math.ceil(net.height * dpr);
  const g = base.getContext('2d');
  if (!g) return;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);

  for (const [color, fx, fy, fr] of palette.washes) {
    const radius = fr * Math.max(net.width, net.height);
    const wash = g.createRadialGradient(fx * net.width, fy * net.height, 0, fx * net.width, fy * net.height, radius);
    wash.addColorStop(0, color);
    wash.addColorStop(1, 'rgba(0, 0, 0, 0)');
    g.fillStyle = wash;
    g.fillRect(0, 0, net.width, net.height);
  }

  g.strokeStyle = palette.edge;
  g.lineWidth = 0.7;
  g.beginPath();
  for (let e = 0; e < net.edges.length; e += 2) {
    const a = net.edges[e];
    const b = net.edges[e + 1];
    g.moveTo(net.xs[a], net.ys[a]);
    g.lineTo(net.xs[b], net.ys[b]);
  }
  g.stroke();

  for (const hubs of [false, true]) {
    g.fillStyle = hubs ? palette.hub : palette.node;
    g.beginPath();
    for (let i = 0; i < net.count; i++) {
      const s = net.sizes[i];
      if (s >= 1.6 !== hubs) continue;
      g.moveTo(net.xs[i] + s, net.ys[i]);
      g.arc(net.xs[i], net.ys[i], s, 0, Math.PI * 2);
    }
    g.fill();
  }
}

export function NeuralBackground() {
  const { scheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const palette = PALETTES[scheme];
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const base = document.createElement('canvas');

    let viewW = 0;
    let viewH = 0;
    let dpr = 1;
    let net: Network;
    let refractory = new Float64Array(0);
    let glowStart = new Float64Array(0);
    let glowColor = new Uint8Array(0);
    let pulses: Pulse[] = [];
    let maxPulses = 480;
    let offsetX = -MARGIN;
    let offsetY = -MARGIN;

    const setup = () => {
      viewW = canvas.clientWidth || window.innerWidth;
      viewH = canvas.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, viewW < 700 ? 1.5 : 2);
      const target = viewW < 700 ? 750 : viewW * viewH > 2_000_000 ? 1200 : 1000;
      net = buildNetwork(viewW, viewH, target);
      refractory = new Float64Array(net.count);
      glowStart = new Float64Array(net.count).fill(-1e9);
      glowColor = new Uint8Array(net.count);
      pulses = [];
      canvas.width = Math.ceil(viewW * dpr);
      canvas.height = Math.ceil(viewH * dpr);
      paintBase(base, net, palette, dpr);
    };

    const fire = (i: number, generation: number, power: number, color: number, now: number) => {
      if (now < refractory[i]) return;
      refractory[i] = now + REFRACTORY_MS;
      glowStart[i] = now;
      glowColor[i] = color;
      if (generation >= MAX_GENERATIONS) return;
      const chance = power * Math.pow(0.8, generation);
      for (const j of net.adjacency[i]) {
        if (pulses.length >= maxPulses || Math.random() > chance) continue;
        const dx = net.xs[j] - net.xs[i];
        const dy = net.ys[j] - net.ys[i];
        pulses.push({ from: i, to: j, t: 0, duration: Math.hypot(dx, dy) / SPEED, generation: generation + 1, power, color });
      }
    };

    const burstAt = (x: number, y: number, strength: number) => {
      if (!net) return;
      const now = performance.now();
      const wx = x - offsetX;
      const wy = y - offsetY;
      const radius = 34 + 34 * strength;
      const color = Math.floor(Math.random() * palette.pulses.length);
      const power = Math.min(0.95, 0.5 + 0.3 * strength);
      for (let i = 0; i < net.count; i++) {
        const dx = net.xs[i] - wx;
        const dy = net.ys[i] - wy;
        if (dx * dx + dy * dy < radius * radius) fire(i, 0, power, color, now);
      }
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, viewW, viewH);
      if (!reduceMotion) {
        offsetX = -MARGIN + Math.sin(now / 9000) * 12;
        offsetY = -MARGIN + Math.cos(now / 12000) * 9;
      }
      ctx.translate(offsetX, offsetY);
      ctx.drawImage(base, 0, 0, net.width, net.height);
      if (reduceMotion) return;

      ctx.globalCompositeOperation = palette.additive ? 'lighter' : 'source-over';

      // Neurons that just fired: a soft halo and a bright core.
      for (let i = 0; i < net.count; i++) {
        const age = now - glowStart[i];
        if (age >= GLOW_MS) continue;
        const k = 1 - age / GLOW_MS;
        ctx.fillStyle = palette.pulses[glowColor[i]];
        ctx.globalAlpha = 0.16 * k;
        ctx.beginPath();
        ctx.arc(net.xs[i], net.ys[i], 3 + 8 * (1 - k * 0.6), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.9 * k;
        ctx.beginPath();
        ctx.arc(net.xs[i], net.ys[i], 1.2 + net.sizes[i], 0, Math.PI * 2);
        ctx.fill();
      }

      // Pulses, batched per color: a fading trail plus a bright head.
      for (let c = 0; c < palette.pulses.length; c++) {
        ctx.strokeStyle = palette.pulses[c];
        ctx.fillStyle = palette.pulses[c];
        ctx.lineWidth = 1.3;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        for (const p of pulses) {
          if (p.color !== c) continue;
          const ax = net.xs[p.from];
          const ay = net.ys[p.from];
          const bx = net.xs[p.to];
          const by = net.ys[p.to];
          const tail = Math.max(0, p.t - TRAIL);
          ctx.moveTo(ax + (bx - ax) * tail, ay + (by - ay) * tail);
          ctx.lineTo(ax + (bx - ax) * p.t, ay + (by - ay) * p.t);
        }
        ctx.stroke();
        ctx.globalAlpha = 0.95;
        ctx.beginPath();
        for (const p of pulses) {
          if (p.color !== c) continue;
          const x = net.xs[p.from] + (net.xs[p.to] - net.xs[p.from]) * p.t;
          const y = net.ys[p.from] + (net.ys[p.to] - net.ys[p.from]) * p.t;
          ctx.moveTo(x + 1.5, y);
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    setup();

    let raf = 0;
    let last = performance.now();
    let nextSpontaneous = 300;
    let frameCost = 16;
    let budgetCheck = 0;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(64, now - last);
      last = now;
      if (document.hidden) return;

      // Spontaneous activity: a neuron somewhere fires every so often.
      nextSpontaneous -= dt;
      if (nextSpontaneous <= 0) {
        fire(Math.floor(Math.random() * net.count), 0, 0.33, Math.floor(Math.random() * palette.pulses.length), now);
        nextSpontaneous = 260 + Math.random() * 520;
      }

      const arrived: Pulse[] = [];
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += dt / p.duration;
        if (p.t >= 1) {
          arrived.push(p);
          pulses[i] = pulses[pulses.length - 1];
          pulses.pop();
        }
      }
      for (const p of arrived) fire(p.to, p.generation, p.power, p.color, now);

      draw(now);

      // Keep it smooth on slower phones: fewer simultaneous pulses if frames lag.
      frameCost = frameCost * 0.95 + dt * 0.05;
      budgetCheck += dt;
      if (budgetCheck > 2000) {
        budgetCheck = 0;
        if (frameCost > 24) maxPulses = Math.max(140, Math.floor(maxPulses * 0.7));
        else if (frameCost < 18) maxPulses = Math.min(480, maxPulses + 40);
      }
    };

    if (reduceMotion) draw(performance.now());
    else raf = requestAnimationFrame(tick);

    const onPointerDown = (event: PointerEvent) => burstAt(event.clientX, event.clientY, 0.7);
    const unsubscribe = neural.subscribe(({ x, y, strength = 1 }: NeuralBurst) => {
      burstAt(x ?? viewW / 2, y ?? viewH * 0.38, strength);
      if (strength >= 1.2) {
        // Big moments ripple out from a few places at once.
        burstAt(viewW * (0.15 + Math.random() * 0.2), viewH * (0.65 + Math.random() * 0.2), strength * 0.7);
        burstAt(viewW * (0.65 + Math.random() * 0.2), viewH * (0.15 + Math.random() * 0.2), strength * 0.7);
      }
    });
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setup();
        if (reduceMotion) draw(performance.now());
      }, 200);
    };

    if (!reduceMotion) window.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      unsubscribe();
      window.removeEventListener('pointerdown', onPointerDown, { capture: true });
      window.removeEventListener('resize', onResize);
    };
  }, [scheme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  delay: number;
};

const ParticleText = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const parent = canvas.parentElement!;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const text = "JS Portfolio";

    // =========================
    // 文字描画
    // =========================
    ctx.fillStyle = "white";
    ctx.font = "bold 120px 'SF Pro Display', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imageData = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles: Particle[] = [];

    // =========================
    // 粒子生成（余白大きめ）
    // =========================
    for (let y = 0; y < imageData.height; y += 2) {
      for (let x = 0; x < imageData.width; x += 2) {
        const i = (y * imageData.width + x) * 4;

        if (imageData.data[i + 3] > 128) {
          particles.push({
            x: x + (Math.random() - 0.5) * 1200,
            y: y + (Math.random() - 0.5) * 1200,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
            delay: Math.random() * 120,
          });
        }
      }
    }

    // =========================
    // マウス（場の歪み）
    // =========================
    const mouse = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      prevX: 0,
      prevY: 0,
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      mouse.x = e.clientX;
      mouse.y = e.clientY;

      mouse.vx = mouse.x - mouse.prevX;
      mouse.vy = mouse.y - mouse.prevY;
    };

    window.addEventListener("mousemove", onMouseMove);

    const startTime = performance.now();
    let animationId = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const t = performance.now() - startTime;

      particles.forEach((p) => {
        // =========================
        // 出現波（stagger）
        // =========================
        let progress = (t - p.delay) / 700;
        progress = Math.max(0, Math.min(1, progress));
        progress = 1 - Math.pow(1 - progress, 3);

        // =========================
        // ① 自己復帰（超ソフト）
        // =========================
        const dx = p.baseX - p.x;
        const dy = p.baseY - p.y;

        const restoreForce = 0.045;

        p.vx += dx * restoreForce;
        p.vy += dy * restoreForce;

        // =========================
        // ② マウス（場の歪み：Apple風）
        // =========================
        const dxm = p.x - mouse.x;
        const dym = p.y - mouse.y;

        const dist = Math.sqrt(dxm * dxm + dym * dym);
        const radius = 180;

        if (dist < radius) {
          const force = (radius - dist) / radius;

          // “押す”ではなく“流れを歪める”
          const angle = Math.atan2(dym, dxm);

          const swirl = 1.6 * force;

          p.vx += Math.cos(angle) * swirl;
          p.vy += Math.sin(angle) * swirl;

          // マウスの慣性だけ少し伝える
          p.vx += mouse.vx * 0.02;
          p.vy += mouse.vy * 0.02;
        }

        // =========================
        // ③ 進行度による滑らかさ
        // =========================
        const smooth = 0.07 + progress * 0.08;

        p.x += p.vx * smooth;
        p.y += p.vy * smooth;

        // =========================
        // ④ 粘性（Appleっぽさの核心）
        // =========================
        p.vx *= 0.84;
        p.vy *= 0.84;

        // =========================
        // ⑤ 速度制限（重要）
        // =========================
        const maxSpeed = 1.4;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);

        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        const burst = Math.min(1, t / 300);

        p.vx += (Math.random() - 0.5) * burst * 2;
        p.vy += (Math.random() - 0.5) * burst * 2;

        // =========================
        // 描画（少し柔らかい粒子）
        // =========================
        ctx.fillStyle = "white";
        ctx.fillRect(p.x, p.y, 2, 2);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
};

export default ParticleText;
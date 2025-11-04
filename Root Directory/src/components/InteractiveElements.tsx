import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TrailDot {
  x: number;
  y: number;
  age: number;
  color: string;
}

export function InteractiveElements() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trailDotsRef = useRef<TrailDot[]>([]);
  const requestRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update canvas size
    const updateCanvasSize = () => {
      const navbarHeight = window.innerWidth < 768 ? 64 : 0; // mobile navbar
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - navbarHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 3 + 1;
        this.color = `rgba(0, 255, 209, ${Math.random()})`;
        this.speedX = (Math.random() - 0.5) * 3;
        this.speedY = (Math.random() - 0.5) * 3;
        this.opacity = 1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.02;
      }
    }

    // Animate
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      trailDotsRef.current = trailDotsRef.current
        .map(dot => ({ ...dot, age: dot.age + 1 }))
        .filter(dot => dot.age < 25);

      trailDotsRef.current.forEach(dot => {
        const opacity = 1 - dot.age / 25;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 209, ${opacity})`;
        ctx.fill();
      });

      particlesRef.current = particlesRef.current
        .filter(p => p.opacity > 0)
        .map(p => {
          p.update();
          p.draw(ctx);
          return p;
        });

      requestRef.current = requestAnimationFrame(animate);
    };

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      trailDotsRef.current.push({ x: e.clientX, y: e.clientY, age: 0, color: 'rgba(0, 255, 209, 1)' });
      if (Math.random() < 0.5) particlesRef.current.push(new Particle(e.clientX, e.clientY));
    };

    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < 20; i++) particlesRef.current.push(new Particle(e.clientX, e.clientY));
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-16 md:bottom-0 pointer-events-none z-[9999]">
      <canvas ref={canvasRef} className="absolute inset-0 mix-blend-screen" />
      <div className="scanline absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-grid-subtle pointer-events-none" />
    </div>
  );
}

export default InteractiveElements;

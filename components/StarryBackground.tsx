import React, { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { BlogPost } from '../types';
import { MOCK_BLOGS, AMBIENT_STARS } from '../constants';

interface StarryBackgroundProps {
  onStarClick: (blog: BlogPost) => void;
  clusterMode?: 'none' | 'category' | 'date';
}

export interface StarryBackgroundHandle {
  resetView: () => void;
}

// Component for an individual interactive star
const InteractiveStar: React.FC<{ blog: BlogPost; onClick: () => void; isAmbient?: boolean }> = ({ blog, onClick, isAmbient = false }) => {
  const [hovered, setHovered] = useState(false);

  // Wrapper style for positioning and floating movement
  const wrapperStyle: React.CSSProperties = {
    left: `${blog.x}%`,
    top: `${blog.y}%`,
    animationDuration: `${blog.speed}s`,
    animationDelay: `-${blog.delay}s`,
    zIndex: 20,
    cursor: isAmbient ? 'default' : 'pointer',
    opacity: isAmbient ? 0.5 : 1,
  };

  // Calculate dimensions for the star parts based on the blog.size prop
  const coreSize = Math.max(2, blog.size * 0.2);
  const spikeLength = isAmbient ? blog.size * 1.5 : blog.size * 2.5;
  const spikeThickness = Math.max(0.5, coreSize * 0.3);
  const diagonalScale = 0.7;

  return (
    <div
      className="absolute animate-float group flex items-center justify-center transition-all duration-500"
      style={wrapperStyle}
      onClick={!isAmbient ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role={isAmbient ? "presentation" : "button"}
      aria-label={isAmbient ? "" : `Open blog post: ${blog.title}`}
    >
      <div className={`relative flex items-center justify-center transition-transform duration-500 ${!isAmbient && hovered ? 'animate-hover-pulse scale-110' : 'animate-twinkle'}`}>

        {/* 1. Cardinal Diffraction Spikes (The Cross +) */}
        <div
          className="absolute bg-white rounded-full"
          style={{
            width: `${spikeLength}px`,
            height: `${spikeThickness}px`,
            background: `linear-gradient(90deg, transparent 0%, #ffffff 50%, transparent 100%)`,
            opacity: 0.9,
            boxShadow: `0 0 4px ${blog.color}`
          }}
        />
        <div
          className="absolute bg-white rounded-full"
          style={{
            width: `${spikeThickness}px`,
            height: `${spikeLength}px`,
            background: `linear-gradient(180deg, transparent 0%, #ffffff 50%, transparent 100%)`,
            opacity: 0.9,
            boxShadow: `0 0 4px ${blog.color}`
          }}
        />

        {/* 2. Diagonal Diffraction Spikes (The X) - Only for 8-point stars */}
        <div
          className="absolute bg-white rounded-full"
          style={{
            width: `${spikeLength * diagonalScale}px`,
            height: `${spikeThickness}px`,
            transform: 'rotate(45deg)',
            background: `linear-gradient(90deg, transparent 0%, #ffffff 50%, transparent 100%)`,
            opacity: 0.7,
            boxShadow: `0 0 4px ${blog.color}`
          }}
        />
        <div
          className="absolute bg-white rounded-full"
          style={{
            width: `${spikeLength * diagonalScale}px`,
            height: `${spikeThickness}px`,
            transform: 'rotate(-45deg)',
            background: `linear-gradient(90deg, transparent 0%, #ffffff 50%, transparent 100%)`,
            opacity: 0.7,
            boxShadow: `0 0 4px ${blog.color}`
          }}
        />

        {/* 3. The Core Glow (The Star Body) */}
        <div
          className="absolute rounded-full bg-white"
          style={{
            width: `${coreSize}px`,
            height: `${coreSize}px`,
            boxShadow: `
                        0 0 ${coreSize * 2}px ${coreSize}px ${blog.color},       
                        0 0 ${coreSize * 4}px ${coreSize * 2}px ${blog.color}80 
                    `
          }}
        />
      </div>

      {/* Tooltip - Only for main blogs */}
      {!isAmbient && (
        <div
          className={`absolute top-8 left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-slate-800/90 border border-slate-600 text-white text-xs rounded whitespace-nowrap transition-opacity duration-300 pointer-events-none z-30
                ${hovered ? 'opacity-100' : 'opacity-0'}`}
        >
          {blog.title}
        </div>
      )}
    </div>
  );
};

const StarryBackground = forwardRef<StarryBackgroundHandle, StarryBackgroundProps>(({ onStarClick, clusterMode = 'none' }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Viewport State for Pan and Zoom
  const [viewState, setViewState] = useState({ x: 0, y: 0, scale: 1 });
  const isDragging = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ w: typeof window !== 'undefined' ? window.innerWidth : 1024, h: typeof window !== 'undefined' ? window.innerHeight : 768 });

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useImperativeHandle(ref, () => ({
    resetView: () => setViewState({ x: 0, y: 0, scale: 1 })
  }));

  const groups = useMemo(() => {
    const m = new Map<string, BlogPost[]>();
    if (clusterMode === 'none') return m;
    MOCK_BLOGS.forEach(b => {
      const key = clusterMode === 'category' ? b.category : (b.date.match(/\b(\d{4})\b/)?.[1] || 'Unknown');
      const arr = m.get(key) || [];
      arr.push(b);
      m.set(key, arr);
    });
    return m;
  }, [clusterMode]);

  const centers = useMemo(() => {
    const keys = Array.from(groups.keys());
    const n = keys.length || 1;
    const base = viewport.w < 640 ? 22 : viewport.w < 1024 ? 28 : 32;
    return keys.reduce<Map<string, { x: number; y: number }>>((acc, key, i) => {
      const angle = (i / n) * Math.PI * 2;
      const x = 50 + Math.cos(angle) * base;
      const y = 50 + Math.sin(angle) * base;
      acc.set(key, { x, y });
      return acc;
    }, new Map<string, { x: number; y: number }>());
  }, [groups, viewport]);

  const getClusteredPosition = (blog: BlogPost) => {
    if (clusterMode === 'none') return { x: blog.x, y: blog.y };
    const key = clusterMode === 'category' ? blog.category : (blog.date.match(/\b(\d{4})\b/)?.[1] || 'Unknown');
    const center = centers.get(key) || { x: blog.x, y: blog.y };
    const group = groups.get(key) || [];
    const index = Math.max(group.findIndex(b => b.id === blog.id), 0);
    const count = Math.max(group.length, 1);
    const angle = (index / count) * Math.PI * 2;
    const radius = viewport.w < 640 ? 10 : viewport.w < 1024 ? 12 : 14;
    return { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
  };

  // --- Interaction Handlers ---

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - lastMousePosition.current.x;
    const deltaY = e.clientY - lastMousePosition.current.y;

    setViewState(prev => ({
      ...prev,
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));

    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    const newScale = Math.min(Math.max(0.5, viewState.scale + delta), 3); // Clamp zoom 0.5x to 3x

    setViewState(prev => ({
      ...prev,
      scale: newScale
    }));
  };


  // OPTIMIZED LOOP:
  const viewStateRef = useRef(viewState);
  useEffect(() => { viewStateRef.current = viewState; }, [viewState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize particles once
    const particles: { x: number; y: number; size: number; alpha: number }[] = [];
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Large field of stars
    for (let i = 0; i < 400; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 4000, // -2000 to 2000 coordinate space
        y: (Math.random() - 0.5) * 4000,
        size: Math.random() * 1.5,
        alpha: Math.random() * 0.8
      });
    }

    const render = () => {
      const { x, y, scale } = viewStateRef.current;

      // Clear
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Background Gradient (Fixed to Viewport)
      const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height));
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 1.5 Draw Galaxy Patterns (Nebula/Spiral)
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Parallax for galaxy (moves slower than stars)
      ctx.translate(x * 0.2, y * 0.2);
      ctx.scale(scale * 0.5, scale * 0.5); // Galaxy is far away

      // Draw Spiral Arms
      const time = Date.now() * 0.00005;
      ctx.rotate(time);

      for (let arm = 0; arm < 3; arm++) {
        ctx.save();
        ctx.rotate((arm * Math.PI * 2) / 3);

        // Create a gradient for the arm
        const armGradient = ctx.createRadialGradient(200, 0, 0, 200, 0, 300);
        armGradient.addColorStop(0, 'rgba(139, 92, 246, 0.1)'); // Purple
        armGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.05)'); // Blue
        armGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = armGradient;

        // Draw elliptical arm
        ctx.beginPath();
        ctx.ellipse(200, 0, 400, 120, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Add some bright spots (clusters)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        for (let k = 0; k < 5; k++) {
          ctx.beginPath();
          ctx.arc(150 + Math.random() * 200, (Math.random() - 0.5) * 100, Math.random() * 2 + 1, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Core
      const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      coreGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(0, 0, 100, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 2. Draw Stars with Transform
      ctx.save();
      // Move origin to center of screen
      ctx.translate(canvas.width / 2, canvas.height / 2);
      // Apply scale
      ctx.scale(scale, scale);
      // Apply Pan (Inverse because we are moving the camera)
      // But we mapped mouse drag to +x/y, so we translate the world by x/y
      ctx.translate(x * 0.5, y * 0.5); // 0.5 Parallax factor

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);


  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Background Canvas (Dust) */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Interactive World Container */}
      {/* We translate this container based on viewState */}
      <div
        className="absolute w-full h-full pointer-events-none transition-transform duration-75 ease-out origin-center"
        style={{
          transform: `translate(${viewState.x}px, ${viewState.y}px) scale(${viewState.scale})`,
          transformOrigin: '50% 50%'
        }}
      >
        {/* Pointer events auto on children to allow clicking */}
        <div className="relative w-full h-full pointer-events-auto">

          {/* Render Ambient Stars (Faint, Background) */}
          {AMBIENT_STARS.slice(0, Math.round(AMBIENT_STARS.length * (viewport.w < 640 ? 0.6 : viewport.w < 1024 ? 0.8 : 1) * (window.devicePixelRatio && window.devicePixelRatio > 1.5 ? 0.85 : 1))).map((blog) => (
            <InteractiveStar
              key={blog.id}
              blog={blog}
              onClick={() => { }}
              isAmbient={true}
            />
          ))}

          {/* Render Main Blog Stars */}
          {MOCK_BLOGS.map((blog) => {
            const pos = getClusteredPosition(blog);
            const displayBlog: BlogPost = { ...blog, x: pos.x, y: pos.y };
            return (
              <InteractiveStar
                key={blog.id}
                blog={displayBlog}
                onClick={() => onStarClick(blog)}
              />
            );
          })}
        </div>
      </div>

      {/* Navigation Hint */}
      <div className="absolute bottom-6 right-6 text-xs text-slate-500 pointer-events-none opacity-50">
        Drag to explore • Scroll to zoom
      </div>
    </div>
  );
});

export default StarryBackground;
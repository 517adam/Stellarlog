import React, { useEffect, useRef, useState } from 'react';
import { BlogPost } from '../types';
import { MOCK_BLOGS, AMBIENT_STARS } from '../constants';

interface StarryBackgroundProps {
  onStarClick: (blog: BlogPost) => void;
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
      className="absolute animate-float group flex items-center justify-center"
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

const StarryBackground: React.FC<StarryBackgroundProps> = ({ onStarClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Viewport State for Pan and Zoom
  const [viewState, setViewState] = useState({ x: 0, y: 0, scale: 1 });
  const isDragging = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });

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
    // Prevent default page scroll
    // Note: React event handlers are passive by default, might need ref listener for true preventDefault if body scrolls.
    // Since body overflow is hidden, we are okay.
    
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    const newScale = Math.min(Math.max(0.5, viewState.scale + delta), 3); // Clamp zoom 0.5x to 3x
    
    setViewState(prev => ({
        ...prev,
        scale: newScale
    }));
  };

  // --- Canvas Logic for "Dust" (Non-interactive background stars) ---
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

    // Dust particles
    const particles: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
    const particleCount = 300; // Increased density

    const initParticles = () => {
      particles.length = 0;
      // Generate particles over a larger area to support panning parallax
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w * 3 - w, // Spread -width to 2*width
          y: Math.random() * h * 3 - h,
          size: Math.random() * 1.5, 
          alpha: Math.random() * 0.8,
          speed: Math.random() * 0.05,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw deep space gradient overlay (Fixed to screen)
      const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
      gradient.addColorStop(0, '#0f172a'); 
      gradient.addColorStop(0.6, '#020617'); 
      gradient.addColorStop(1, '#000000'); 
      
      ctx.save();
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Apply Parallax Transform to Dust
      // Dust moves at 50% speed of the foreground to create depth
      ctx.save();
      ctx.translate(viewState.x * 0.5, viewState.y * 0.5);
      ctx.scale(viewState.scale, viewState.scale); // Dust also zooms, but maybe less? Let's zoom it same for consistency.

      // Draw particles
      particles.forEach((p) => {
        // Basic twinkle
        if (Math.random() > 0.99) p.alpha = Math.random();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      });

      // Add some distant static "cross" stars painted on canvas for depth
      // Just a few random static ones
      ctx.restore();

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initParticles();
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [viewState]); // Re-run not needed for animation loop, but we read viewState in render. 
  // Actually, for performance, we should use a ref for viewState in the animation loop, 
  // but React state update triggers re-render which is fine for this complexity.
  // However, the useEffect dependency on viewState might restart the loop.
  // Better: Use the state directly in the render loop since `draw` closes over the scope?
  // No, `draw` needs fresh state.
  // For this demo, restarting the loop on state change is acceptable but inefficient. 
  // Optimization: Use refs for animation loop state reading.
  
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
       for(let i=0; i<400; i++) {
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
           const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height));
           gradient.addColorStop(0, '#0f172a'); 
           gradient.addColorStop(1, '#000000');
           ctx.fillStyle = gradient;
           ctx.fillRect(0, 0, canvas.width, canvas.height);

           // 2. Draw Stars with Transform
           ctx.save();
           // Move origin to center of screen
           ctx.translate(canvas.width/2, canvas.height/2);
           // Apply scale
           ctx.scale(scale, scale);
           // Apply Pan (Inverse because we are moving the camera)
           // But we mapped mouse drag to +x/y, so we translate the world by x/y
           ctx.translate(x * 0.5, y * 0.5); // 0.5 Parallax factor

           particles.forEach(p => {
               ctx.beginPath();
               ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
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
            {AMBIENT_STARS.map((blog) => (
                <InteractiveStar 
                    key={blog.id} 
                    blog={blog} 
                    onClick={() => {}}
                    isAmbient={true}
                />
            ))}

            {/* Render Main Blog Stars */}
            {MOCK_BLOGS.map((blog) => (
            <InteractiveStar 
                key={blog.id} 
                blog={blog} 
                onClick={() => onStarClick(blog)} 
            />
            ))}
        </div>
      </div>
      
      {/* Navigation Hint */}
      <div className="absolute bottom-6 right-6 text-xs text-slate-500 pointer-events-none opacity-50">
          Drag to explore • Scroll to zoom
      </div>
    </div>
  );
};

export default StarryBackground;
import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
    isActive: boolean;
    techScore: number; // 0-100
    artScore: number; // 0-100
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive, techScore, artScore }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const timeRef = useRef(0);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Handle high-DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const render = () => {
            if (!isActive) {
                // Flat line when muted
                ctx.clearRect(0, 0, rect.width, rect.height);
                ctx.beginPath();
                ctx.moveTo(0, rect.height / 2);
                ctx.lineTo(rect.width, rect.height / 2);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 2;
                ctx.stroke();
                return;
            }

            ctx.clearRect(0, 0, rect.width, rect.height);
            
            const width = rect.width;
            const height = rect.height;
            const centerY = height / 2;

            // Parameters derived from props
            const normalizedTech = techScore / 100; // 0 to 1
            const normalizedArt = artScore / 100;   // 0 to 1

            // Speed: Higher Music = Faster flow
            const speed = 0.05 + (normalizedArt * 0.15);
            timeRef.current += speed;

            // Amplitude: Base size
            const amplitude = height * 0.3;

            // Wave characteristics
            // Tech adds "noise" or "jaggedness"
            // Art adds "smoothness" or harmonic complexity
            
            ctx.beginPath();
            ctx.moveTo(0, centerY);

            for (let x = 0; x < width; x += 2) {
                const relativeX = x / width;
                
                // Base Sine Wave
                // Frequency increases slightly with Art
                const frequency = 5 + (normalizedArt * 5);
                const sineBase = Math.sin((relativeX * frequency * Math.PI * 2) - timeRef.current);

                // Tech Distortion (The "Saw" effect)
                // We add high frequency noise or sharp edges based on tech score
                const noiseFreq = 50;
                const noise = Math.sin((relativeX * noiseFreq) + timeRef.current) * normalizedTech;
                
                // Combine: Low tech is smooth sine, High tech is jagged
                // We blend the pure sine with the noisy sine
                const yOffset = (sineBase * (1 - normalizedTech * 0.5)) + (noise * normalizedTech * 0.8);
                
                const y = centerY + (yOffset * amplitude);
                ctx.lineTo(x, y);
            }

            // Dynamic Styling
            // Color shifts from Purple (Music) to Blue (Tech)
            const r = 168 - (normalizedTech * 109); // 168 -> 59
            const g = 85 + (normalizedTech * 45);   // 85 -> 130
            const b = 247 - (normalizedTech * 1);   // 247 -> 246
            
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
            ctx.lineWidth = 2 + (normalizedTech * 1); // Thicker line for more "tech" presence
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();

            // Glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
            ctx.stroke();
            ctx.shadowBlur = 0; // Reset

            animationFrameRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isActive, techScore, artScore]);

    return (
        <canvas 
            ref={canvasRef} 
            className="w-full h-full pointer-events-none"
            style={{ width: '100%', height: '100%' }}
        />
    );
};
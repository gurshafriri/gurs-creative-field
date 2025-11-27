import React from 'react';
import { ProcessedProject } from '../types';

interface ProjectTileProps {
    project: ProcessedProject;
    onClick: (project: ProcessedProject) => void;
}

export const ProjectTile: React.FC<ProjectTileProps> = ({ project, onClick }) => {
    const baseUrl = import.meta.env?.BASE_URL || '/';
        
    const mediaPath = (filename: string) => {
        const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
        return `${baseUrl}media/${cleanFilename}`.replace('//', '/');
    };

    return (
        <div 
            className="absolute group cursor-pointer"
            style={{
                width: '240px',
                transform: 'translate(-50%, -50%)'
            }}
            onClick={(e) => {
                e.stopPropagation();
                onClick(project);
            }}
        >
            {/* Album Art Container */}
            <div className="relative w-full aspect-square rounded-sm border border-white/10 bg-neutral-900 shadow-2xl group-hover:scale-105 group-hover:border-blue-400/50 transition-all duration-300 overflow-hidden">
                
                {/* Background Image */}
                {project.imageUrl ? (
                    <div className="absolute inset-0 z-0">
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                            style={{ backgroundImage: `url(${mediaPath(project.imageUrl)})` }}
                        />
                        {/* Vignette for "Physical Record" feel + Text Legibility in corners */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] opacity-60" />
                    </div>
                ) : (
                    <div className="absolute inset-0 z-0 bg-neutral-800" />
                )}

                {/* Title - Always visible, Bottom Right */}
                <div className="absolute bottom-2 right-2 z-20 max-w-[85%] text-right">
                     <h3 className="text-[10px] font-bold text-gray-300 lowercase tracking-widest leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                        {project.title}
                    </h3>
                </div>
                
                {/* Hover Overlay (Tags & Bars) */}
                <div className="relative z-30 flex flex-col justify-between h-full p-3 opacity-0 group-hover:opacity-75 transition-opacity duration-300">
                    
                    <div className="flex flex-wrap gap-1.5 justify-end">
                        {project.tags.slice(0, 2).map((tag, i) => (
                            <span 
                                key={i} 
                                className="text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded-full bg-black/60 text-white/90 border border-white/10 backdrop-blur-sm"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    
                    {/* Bars - Push them slightly up so they frame the title or sit above/below? 
                        If bars are at bottom, they overlap title. 
                        Let's put bars *above* the title area or just let them overlay (they are thin).
                    */}
                    <div className="mt-auto w-full flex flex-col gap-1 pb-6"> 
                        <div className="h-0.5 bg-white/30 w-full overflow-hidden">
                            <div className="h-full bg-blue-400" style={{ width: `${project.techScore}%` }}></div>
                        </div>
                        <div className="h-0.5 bg-white/30 w-full overflow-hidden">
                            <div className="h-full bg-purple-400" style={{ width: `${project.musicScore}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
import React, { useRef, useState, useEffect } from 'react';
import { useEditorContext } from '@/lib/editorContext';
import { cn } from '@/lib/utils';
import { TimelineClip } from '@shared/schema';
import { useIsMobile } from '@/hooks/use-mobile';

interface TimelineProps {
  zoomLevel: number;
}

interface TimeMarker {
  position: number;
  label: string;
}

const Timeline: React.FC<TimelineProps> = ({ zoomLevel }) => {
  const isMobile = useIsMobile();
  const { 
    clips, 
    currentTime, 
    duration,
    selectedClipId,
    setCurrentTime,
    selectClip,
    updateClipTiming
  } = useEditorContext();
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const [draggingClip, setDraggingClip] = useState<{ id: string, startOffset: number } | null>(null);
  const [resizingClip, setResizingClip] = useState<{ id: string, edge: 'start' | 'end' } | null>(null);
  
  // Pixel-to-time conversion based on zoom level
  const pixelsPerMs = 0.04 * zoomLevel; // 1 second = 40px * zoom level
  
  const handlePlayheadClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    
    // Convert pixels to time
    const clickedTimeMs = offsetX / pixelsPerMs;
    setCurrentTime(Math.min(Math.max(0, clickedTimeMs), duration));
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    
    // Handle clip dragging
    if (draggingClip) {
      const offsetX = e.clientX - rect.left;
      const newStartTime = Math.max(0, offsetX / pixelsPerMs - draggingClip.startOffset);
      
      const clip = clips.find(c => c.id === draggingClip.id);
      if (clip) {
        const clipDuration = clip.end - clip.start;
        updateClipTiming(draggingClip.id, newStartTime, newStartTime + clipDuration);
      }
    }
    
    // Handle clip resizing
    if (resizingClip) {
      const offsetX = e.clientX - rect.left;
      const newTime = Math.max(0, offsetX / pixelsPerMs);
      
      const clip = clips.find(c => c.id === resizingClip.id);
      if (clip) {
        if (resizingClip.edge === 'start') {
          updateClipTiming(resizingClip.id, Math.min(newTime, clip.end - 100), clip.end);
        } else {
          updateClipTiming(resizingClip.id, clip.start, Math.max(newTime, clip.start + 100));
        }
      }
    }
  };
  
  const handleMouseUp = () => {
    setDraggingClip(null);
    setResizingClip(null);
  };
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingClip, resizingClip]);
  
  // Generate time markers based on duration and zoom level
  const generateTimeMarkers = (): TimeMarker[] => {
    const markers: TimeMarker[] = [];
    const step = 2000; // 2 seconds between markers
    
    for (let time = 0; time <= duration; time += step) {
      markers.push({
        position: time * pixelsPerMs,
        label: formatTimeLabel(time)
      });
    }
    
    return markers;
  };
  
  const formatTimeLabel = (timeMs: number): string => {
    const seconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };
  
  const timeMarkers = generateTimeMarkers();
  
  const startClipDrag = (clip: TimelineClip, e: React.MouseEvent) => {
    e.stopPropagation();
    const clipEl = e.currentTarget as HTMLDivElement;
    const rect = clipEl.getBoundingClientRect();
    const clickOffset = e.clientX - rect.left;
    
    setDraggingClip({
      id: clip.id,
      startOffset: clickOffset / pixelsPerMs
    });
    selectClip(clip.id);
  };
  
  const startClipResize = (clipId: string, edge: 'start' | 'end', e: React.MouseEvent) => {
    e.stopPropagation();
    setResizingClip({ id: clipId, edge });
    selectClip(clipId);
  };
  
  return (
    <div className="timeline-container overflow-x-auto">
      <div 
        className="timeline-scale relative h-5 md:h-6 mb-1" 
        ref={timelineRef}
        onClick={handlePlayheadClick}
        style={{ 
          backgroundSize: `${40 * zoomLevel}px 100%`,
          width: `${duration * pixelsPerMs}px`
        }}
      >
        <div 
          className="playhead absolute top-0 h-full w-0.5 bg-primary z-10" 
          style={{ left: `${currentTime * pixelsPerMs}px` }}
        />
        
        {/* Only show time markers on larger screens or reduce frequency on mobile */}
        {timeMarkers
          .filter((_, idx) => !isMobile || idx % 2 === 0) // Show fewer markers on mobile
          .map((marker, idx) => (
            <div 
              key={idx} 
              className="timeline-marker" 
              style={{ left: `${marker.position}px` }}
            >
              <div className={`timeline-marker-text ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                {marker.label}
              </div>
            </div>
          ))
        }
      </div>
      
      {/* Video track */}
      <div className="mb-2 md:mb-3">
        <div className="flex items-center">
          <div className={`${isMobile ? 'w-12' : 'w-20'} text-xs font-medium text-gray-400 pr-2`}>
            {isMobile ? 'Video' : 'Video Track'}
          </div>
          <div 
            className="flex-grow timeline-track"
            style={{ width: `${duration * pixelsPerMs}px` }}
          >
            {clips
              .filter(clip => clip.type === 'video')
              .map(clip => (
                <div 
                  key={clip.id}
                  className={cn(
                    "video-clip", 
                    selectedClipId === clip.id && "ring-2 ring-primary"
                  )}
                  style={{ 
                    left: `${clip.start * pixelsPerMs}px`, 
                    width: `${(clip.end - clip.start) * pixelsPerMs}px`,
                    backgroundColor: clip.color || "#FF5A5F",
                    height: isMobile ? '28px' : '32px'
                  }}
                  onMouseDown={(e) => startClipDrag(clip, e)}
                  onTouchStart={(e) => {
                    // Basic touch support for mobile
                    const touch = e.touches[0];
                    if (touch) {
                      const clipEl = e.currentTarget;
                      const rect = clipEl.getBoundingClientRect();
                      const touchOffsetX = touch.clientX - rect.left;
                      
                      setDraggingClip({
                        id: clip.id,
                        startOffset: touchOffsetX / pixelsPerMs
                      });
                      selectClip(clip.id);
                    }
                  }}
                >
                  <div 
                    className="h-full w-2 cursor-ew-resize absolute left-0 top-0"
                    onMouseDown={(e) => startClipResize(clip.id, 'start', e)}
                  />
                  <div className="h-full flex items-center justify-center text-xs px-3 pointer-events-none truncate">
                    {isMobile && clip.name.length > 6 ? `${clip.name.substring(0, 6)}...` : clip.name}
                  </div>
                  <div 
                    className="h-full w-2 cursor-ew-resize absolute right-0 top-0"
                    onMouseDown={(e) => startClipResize(clip.id, 'end', e)}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
      
      {/* Audio track */}
      <div className="mb-2 md:mb-3">
        <div className="flex items-center">
          <div className={`${isMobile ? 'w-12' : 'w-20'} text-xs font-medium text-gray-400 pr-2`}>
            {isMobile ? 'Audio' : 'Audio Track'}
          </div>
          <div 
            className="flex-grow timeline-track"
            style={{ width: `${duration * pixelsPerMs}px` }}
          >
            {clips
              .filter(clip => clip.type === 'audio')
              .map(clip => (
                <div 
                  key={clip.id}
                  className={cn(
                    "video-clip", 
                    selectedClipId === clip.id && "ring-2 ring-primary"
                  )}
                  style={{ 
                    left: `${clip.start * pixelsPerMs}px`, 
                    width: `${(clip.end - clip.start) * pixelsPerMs}px`,
                    backgroundColor: clip.color || "#00C4B4",
                    height: isMobile ? '28px' : '32px'
                  }}
                  onMouseDown={(e) => startClipDrag(clip, e)}
                  onTouchStart={(e) => {
                    // Basic touch support for mobile
                    const touch = e.touches[0];
                    if (touch) {
                      const clipEl = e.currentTarget;
                      const rect = clipEl.getBoundingClientRect();
                      const touchOffsetX = touch.clientX - rect.left;
                      
                      setDraggingClip({
                        id: clip.id,
                        startOffset: touchOffsetX / pixelsPerMs
                      });
                      selectClip(clip.id);
                    }
                  }}
                >
                  <div 
                    className="h-full w-2 cursor-ew-resize absolute left-0 top-0"
                    onMouseDown={(e) => startClipResize(clip.id, 'start', e)}
                  />
                  <div className="h-full flex items-center justify-center text-xs px-3 pointer-events-none truncate">
                    {isMobile && clip.name.length > 6 ? `${clip.name.substring(0, 6)}...` : clip.name}
                  </div>
                  <div 
                    className="h-full w-2 cursor-ew-resize absolute right-0 top-0"
                    onMouseDown={(e) => startClipResize(clip.id, 'end', e)}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
      
      {/* Captions track */}
      <div className="mb-2 md:mb-3">
        <div className="flex items-center">
          <div className={`${isMobile ? 'w-12' : 'w-20'} text-xs font-medium text-gray-400 pr-2`}>
            {isMobile ? 'Captions' : 'Captions'}
          </div>
          <div 
            className="flex-grow timeline-track"
            style={{ width: `${duration * pixelsPerMs}px` }}
          >
            {clips
              .filter(clip => clip.type === 'caption')
              .map(clip => (
                <div 
                  key={clip.id}
                  className={cn(
                    "video-clip", 
                    selectedClipId === clip.id && "ring-2 ring-primary"
                  )}
                  style={{ 
                    left: `${clip.start * pixelsPerMs}px`, 
                    width: `${(clip.end - clip.start) * pixelsPerMs}px`,
                    backgroundColor: clip.color || "#FFD166",
                    height: isMobile ? '28px' : '32px'
                  }}
                  onMouseDown={(e) => startClipDrag(clip, e)}
                  onTouchStart={(e) => {
                    // Basic touch support for mobile
                    const touch = e.touches[0];
                    if (touch) {
                      const clipEl = e.currentTarget;
                      const rect = clipEl.getBoundingClientRect();
                      const touchOffsetX = touch.clientX - rect.left;
                      
                      setDraggingClip({
                        id: clip.id,
                        startOffset: touchOffsetX / pixelsPerMs
                      });
                      selectClip(clip.id);
                    }
                  }}
                >
                  <div 
                    className="h-full w-2 cursor-ew-resize absolute left-0 top-0"
                    onMouseDown={(e) => startClipResize(clip.id, 'start', e)}
                  />
                  <div className="h-full flex items-center justify-center text-xs px-3 pointer-events-none truncate">
                    {isMobile 
                      ? (clip.properties?.text?.substring(0, 6) || 'Caption') + (clip.properties?.text && clip.properties.text.length > 6 ? '...' : '')
                      : (clip.properties?.text?.substring(0, 10) || 'Caption') + (clip.properties?.text && clip.properties.text.length > 10 ? '...' : '')
                    }
                  </div>
                  <div 
                    className="h-full w-2 cursor-ew-resize absolute right-0 top-0"
                    onMouseDown={(e) => startClipResize(clip.id, 'end', e)}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;

import React, { useRef, useEffect } from 'react';
import { useEditorContext } from '@/lib/editorContext';
import { Slider } from '@/components/ui/slider';
import { useIsMobile } from '@/hooks/use-mobile';
import { Play, Pause, Volume2, Maximize2 } from 'lucide-react';

interface VideoPreviewProps {
  hideControls?: boolean;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ hideControls = false }) => {
  const isMobile = useIsMobile();
  const { 
    currentTime, 
    duration, 
    isPlaying, 
    videoSrc,
    captions,
    setCurrentTime,
    togglePlayback
  } = useEditorContext();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  useEffect(() => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.currentTime = currentTime / 1000; // Convert ms to seconds
    }
  }, [currentTime, isPlaying]);
  
  const formatTime = (timeMs: number): string => {
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current && isPlaying) {
      setCurrentTime(videoRef.current.currentTime * 1000); // Convert seconds to ms
    }
  };
  
  const handleVideoClick = () => {
    togglePlayback();
  };
  
  const handleSliderChange = (value: number[]) => {
    setCurrentTime(value[0]);
  };
  
  return (
    <div className="flex-grow p-2 flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-full md:max-w-2xl mx-auto aspect-[9/16] bg-black rounded-lg shadow-lg overflow-hidden">
        {videoSrc ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onClick={handleVideoClick}
            playsInline // Important for mobile
            controls={false}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black flex items-center justify-center">
            <div 
              className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center cursor-pointer shadow-xl" 
              onClick={togglePlayback}
            >
              <Play className="h-6 w-6 text-white ml-0.5" />
            </div>
          </div>
        )}
        
        {/* Center play/pause button overlay (always visible) */}
        {videoSrc && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
            <div 
              className="w-16 h-16 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center cursor-pointer"
              onClick={togglePlayback}
            >
              {isPlaying ? 
                <Pause className="h-6 w-6 text-white" /> : 
                <Play className="h-6 w-6 text-white ml-0.5" />}
            </div>
          </div>
        )}
        
        {/* Render active captions */}
        {captions.map((caption) => (
          (caption.start <= currentTime && caption.end >= currentTime) && (
            <div 
              key={caption.id}
              className="caption-bubble absolute"
              style={{
                bottom: hideControls ? '16px' : (isMobile ? '80px' : '96px'),
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: `${isMobile ? (caption.properties?.fontSize || 18) * 0.8 : caption.properties?.fontSize || 18}px`,
                fontFamily: caption.properties?.font || 'Poppins',
                color: caption.properties?.color || 'white',
                backgroundColor: caption.properties?.backgroundColor || 'rgba(0, 0, 0, 0.7)',
                padding: isMobile ? '6px 12px' : '8px 16px',
                borderRadius: '24px',
                maxWidth: isMobile ? '90%' : '80%',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                ...caption.properties?.position && {
                  bottom: `${caption.properties.position.y * (isMobile ? 0.8 : 1)}px`,
                  left: `${caption.properties.position.x * (isMobile ? 0.8 : 1)}px`,
                  transform: 'none'
                }
              }}
            >
              {caption.properties?.text || 'Caption text'}
            </div>
          )
        ))}
        
        {/* Video Controls Overlay - only show if not hideControls */}
        {!hideControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-4">
            <div className="flex items-center justify-between text-white mb-2">
              <div className="text-xs font-medium">{formatTime(currentTime)} / {formatTime(duration)}</div>
              <div className="flex space-x-3">
                {!isMobile && (
                  <button className="hover:text-primary transition-colors">
                    <Maximize2 className="h-4 w-4" />
                  </button>
                )}
                <button className="hover:text-primary transition-colors">
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              className="mt-1"
              onValueChange={handleSliderChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPreview;

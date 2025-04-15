import React, { useRef, useEffect } from 'react';
import { useEditorContext } from '@/lib/editorContext';
import { Slider } from '@/components/ui/slider';

const VideoPreview: React.FC = () => {
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
    <div className="flex-grow p-4 flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-2xl aspect-[9/16] bg-black rounded-lg shadow-lg overflow-hidden">
        {videoSrc ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onClick={handleVideoClick}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center cursor-pointer" onClick={togglePlayback}>
              <i className="ri-play-fill text-4xl"></i>
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
                bottom: '32px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: `${caption.properties?.fontSize || 18}px`,
                fontFamily: caption.properties?.font || 'Poppins',
                color: caption.properties?.color || 'black',
                backgroundColor: caption.properties?.backgroundColor || 'rgba(255, 255, 255, 0.8)',
                ...caption.properties?.position && {
                  bottom: `${caption.properties.position.y}px`,
                  left: `${caption.properties.position.x}px`,
                  transform: 'none'
                }
              }}
            >
              {caption.properties?.text || 'Caption text'}
            </div>
          )
        ))}
        
        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="text-sm">{formatTime(currentTime)} / {formatTime(duration)}</div>
            <div className="flex space-x-4">
              <button className="hover:text-primary transition-colors">
                <i className="ri-fullscreen-line"></i>
              </button>
              <button className="hover:text-primary transition-colors">
                <i className="ri-volume-up-line"></i>
              </button>
            </div>
          </div>
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            className="mt-2"
            onValueChange={handleSliderChange}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;

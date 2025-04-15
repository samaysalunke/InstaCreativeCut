import React, { useEffect, useState } from 'react';
import Header from '@/components/editor/Header';
import Sidebar from '@/components/editor/Sidebar';
import VideoPreview from '@/components/editor/VideoPreview';
import EditingTools from '@/components/editor/EditingTools';
import PropertiesPanel from '@/components/editor/PropertiesPanel';
import TemplatesOverlay from '@/components/editor/TemplatesOverlay';
import MediaLibrary from '@/components/editor/MediaLibrary';
import EmptyState from '@/components/editor/EmptyState';
import { useEditorContext } from '@/lib/editorContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const Editor: React.FC = () => {
  const { toast } = useToast();
  const { 
    initializeEditor, 
    activeToolTab, 
    videoSrc, 
    clips,
    isPlaying,
    togglePlayback,
    setActiveToolTab 
  } = useEditorContext();
  
  const isMobile = useIsMobile();
  const [showProperties, setShowProperties] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  
  const hasContent = videoSrc || clips.length > 0;
  
  useEffect(() => {
    // Initialize the editor when the page loads
    initializeEditor();
    
    // Show welcome toast
    toast({
      title: "Welcome to VideoReel Editor",
      description: "Add videos or select a template to get started",
    });
  }, []);
  
  // Toggle properties panel visibility on mobile
  useEffect(() => {
    if (isMobile) {
      // Only show properties panel when a tool is selected that requires it
      setShowProperties(['captions', 'filters', 'speed', 'transitions'].includes(activeToolTab));
    } else {
      setShowProperties(true);
    }
  }, [activeToolTab, isMobile]);

  // Toggle between library and main editor
  const toggleLibrary = () => {
    setShowLibrary(!showLibrary);
  };
  
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-black">
      {/* Only show header on non-mobile */}
      {!isMobile && <Header />}
      
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar visible only on desktop */}
        {!isMobile && <Sidebar />}
        
        {showLibrary ? (
          <MediaLibrary onClose={toggleLibrary} />
        ) : (
          <div className="flex-grow flex flex-col overflow-hidden relative">
            {/* Show empty state when no content */}
            {!hasContent ? (
              <EmptyState onAddMedia={() => setShowLibrary(true)} />
            ) : (
              <div className="flex flex-col h-full">
                {/* Mobile Header - minimal design */}
                {isMobile && (
                  <div className="bg-black text-white py-3 px-4 flex justify-between items-center">
                    <div className="flex-grow flex justify-center relative">
                      <h1 className="text-lg font-medium">VideoReel</h1>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white absolute right-2 top-2.5"
                      onClick={() => window.history.back()}
                    >
                      <i className="ri-close-line text-xl"></i>
                    </Button>
                  </div>
                )}
                
                {/* Video Preview - Full width with correct aspect ratio */}
                <div className="flex-grow flex items-center justify-center bg-black relative overflow-hidden">
                  <div className="w-full h-full max-h-[65vh] flex items-center justify-center">
                    <VideoPreview hideControls={true} />
                  </div>
                  
                  {/* Simple playback control floating over video */}
                  {isMobile && (
                    <div 
                      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full 
                                 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10 hover:bg-black/40"
                      onClick={togglePlayback}
                    >
                      <i className={`${isPlaying ? 'ri-pause-fill' : 'ri-play-fill'} text-white text-2xl`}></i>
                    </div>
                  )}
                  
                  {/* Floating action buttons for mobile - similar to CapCut/InShot */}
                  {isMobile && (
                    <div className="absolute bottom-4 right-4 flex flex-col space-y-3 z-20">
                      <Button 
                        className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg" 
                        size="icon"
                        onClick={toggleLibrary}
                      >
                        <i className="ri-gallery-line text-xl"></i>
                      </Button>
                      <Button 
                        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 shadow-lg" 
                        size="icon"
                        onClick={() => {/* Export video */}}
                      >
                        <i className="ri-download-2-line text-white text-xl"></i>
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Bottom TabBar UI for mobile - inspired by mobile editing apps */}
                {isMobile && (
                  <div className="h-auto bg-gray-900">
                    {/* Tool Tabs - Horizontal scrolling */}
                    <div className="flex overflow-x-auto py-2 px-1 gap-1 border-t border-gray-800 no-scrollbar">
                      {['trim', 'captions', 'audio', 'filters', 'effects', 'text', 'stickers'].map(tool => (
                        <Button 
                          key={tool}
                          variant={activeToolTab === tool ? "default" : "ghost"}
                          className={`px-4 rounded-full flex-shrink-0 ${activeToolTab === tool ? 'bg-primary text-white' : 'text-gray-300'}`}
                          onClick={() => setActiveToolTab(tool)}
                        >
                          <span className="capitalize">{tool}</span>
                        </Button>
                      ))}
                    </div>
                    
                    {/* Timeline or tool-specific UI */}
                    <div className="py-1 px-2">
                      <EditingTools />
                    </div>
                  </div>
                )}
                
                {/* Desktop editing panel with timeline */}
                {!isMobile && (
                  <div className="h-[40%] bg-surface-dark border-t border-gray-800 overflow-hidden flex flex-col">
                    <EditingTools />
                  </div>
                )}
                
                {/* Properties panel - side panel on desktop, bottom panel on mobile */}
                {(showProperties || !isMobile) && (
                  <PropertiesPanel 
                    className={isMobile 
                      ? "absolute bottom-0 left-0 right-0 z-30 bg-gray-900 h-auto max-h-[60vh] rounded-t-xl shadow-lg" 
                      : "hidden md:block md:w-80 border-l border-gray-800"
                    } 
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      <TemplatesOverlay />
    </div>
  );
};

export default Editor;

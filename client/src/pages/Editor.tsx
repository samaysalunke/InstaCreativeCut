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
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Header />
      
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar always visible on desktop, only when not in library on mobile */}
        {(!isMobile || !showLibrary) && <Sidebar />}
        
        {showLibrary ? (
          <MediaLibrary onClose={toggleLibrary} />
        ) : (
          <div className="flex-grow flex flex-col overflow-hidden relative">
            {/* Show empty state when no content */}
            {!hasContent ? (
              <EmptyState onAddMedia={() => setShowLibrary(true)} />
            ) : (
              <>
                {/* Video Preview - Always at top on mobile */}
                <div className="order-1 flex-grow md:flex-grow-0 md:h-[60%]">
                  <VideoPreview />
                </div>
                
                {/* Bottom editing panel with timeline */}
                <div className="order-2 bg-surface-dark border-t border-gray-800 md:h-[40%] overflow-hidden flex flex-col">
                  <EditingTools />
                  
                  {/* Floating library button on mobile */}
                  {isMobile && (
                    <Button 
                      className="absolute bottom-20 right-4 rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90 text-white"
                      onClick={toggleLibrary}
                    >
                      <i className="ri-folder-video-line text-xl"></i>
                    </Button>
                  )}
                </div>
                
                {/* Properties panel - side panel on desktop, modal on mobile */}
                {(showProperties || !isMobile) && (
                  <PropertiesPanel 
                    className={isMobile 
                      ? "absolute inset-0 z-20 h-full" 
                      : "hidden md:block md:w-80 border-l border-gray-800"
                    } 
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      <TemplatesOverlay />
    </div>
  );
};

export default Editor;

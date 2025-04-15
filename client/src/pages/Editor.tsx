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
        {/* Sidebar always visible on desktop, hidden on mobile */}
        {!isMobile && <Sidebar />}
        
        {showLibrary ? (
          <MediaLibrary onClose={toggleLibrary} />
        ) : (
          <div className="flex-grow flex flex-col overflow-hidden relative">
            {/* Show empty state when no content */}
            {!hasContent ? (
              <EmptyState onAddMedia={() => setShowLibrary(true)} />
            ) : (
              <>
                {/* Video Preview - Always at top, no controls here */}
                <div className="order-1 flex-grow flex items-center justify-center bg-black/30">
                  <VideoPreview hideControls={true} />
                </div>
                
                {/* Bottom controls and editing panel - fixed height for consistency */}
                <div className="order-2 bg-surface-dark border-t border-gray-800 h-auto md:h-[40%] overflow-hidden flex flex-col">
                  {/* Mobile sidebar toggle and controls */}
                  {isMobile && (
                    <div className="flex justify-between items-center p-2 border-b border-gray-700">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-gray-400"
                        onClick={() => setActiveToolTab(activeToolTab === 'sidebar' ? 'trim' : 'sidebar')}
                      >
                        {activeToolTab === 'sidebar' ? 
                          <span className="flex items-center"><i className="ri-arrow-left-line mr-1"></i> Back</span> : 
                          <span className="flex items-center"><i className="ri-menu-line mr-1"></i> Menu</span>
                        }
                      </Button>
                      
                      <Button 
                        size="sm"
                        variant="outline"
                        className="flex items-center"
                        onClick={toggleLibrary}
                      >
                        <i className="ri-folder-video-line mr-1"></i>
                        Media
                      </Button>
                    </div>
                  )}
                  
                  {/* Conditional rendering of mobile sidebar or editing tools */}
                  {isMobile && activeToolTab === 'sidebar' ? (
                    <div className="p-2 overflow-y-auto h-64">
                      <Sidebar inline={true} />
                    </div>
                  ) : (
                    <EditingTools />
                  )}
                  
                  {/* Properties panel - side panel on desktop, part of bottom section on mobile */}
                  {(showProperties || !isMobile) && (
                    <PropertiesPanel 
                      className={isMobile 
                        ? "border-t border-gray-700 h-auto" 
                        : "hidden md:block md:w-80 border-l border-gray-800"
                      } 
                    />
                  )}
                </div>
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

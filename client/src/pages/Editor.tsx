import React, { useEffect, useState } from 'react';
import Header from '@/components/editor/Header';
import Sidebar from '@/components/editor/Sidebar';
import VideoPreview from '@/components/editor/VideoPreview';
import EditingTools from '@/components/editor/EditingTools';
import PropertiesPanel from '@/components/editor/PropertiesPanel';
import TemplatesOverlay from '@/components/editor/TemplatesOverlay';
import { useEditorContext } from '@/lib/editorContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Editor: React.FC = () => {
  const { toast } = useToast();
  const { initializeEditor, activeToolTab } = useEditorContext();
  const isMobile = useIsMobile();
  const [showProperties, setShowProperties] = useState(false);
  
  useEffect(() => {
    // Initialize the editor when the page loads
    initializeEditor();
    
    // Show welcome toast
    toast({
      title: "Welcome to VideoReel Editor",
      description: "Start by adding media, captions, or selecting a template",
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
  
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        <Sidebar />
        
        <div className="flex-grow flex flex-col overflow-hidden order-1 md:order-2">
          <VideoPreview />
          <EditingTools />
        </div>
        
        {/* Show properties panel conditionally based on screen size */}
        {(showProperties || !isMobile) && (
          <PropertiesPanel className={isMobile ? "order-3 h-1/3" : ""} />
        )}
      </div>
      
      <TemplatesOverlay />
    </div>
  );
};

export default Editor;

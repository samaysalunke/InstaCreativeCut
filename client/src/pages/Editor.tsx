import React, { useEffect } from 'react';
import Header from '@/components/editor/Header';
import Sidebar from '@/components/editor/Sidebar';
import VideoPreview from '@/components/editor/VideoPreview';
import EditingTools from '@/components/editor/EditingTools';
import PropertiesPanel from '@/components/editor/PropertiesPanel';
import TemplatesOverlay from '@/components/editor/TemplatesOverlay';
import { useEditorContext } from '@/lib/editorContext';
import { useToast } from '@/hooks/use-toast';

const Editor: React.FC = () => {
  const { toast } = useToast();
  const { initializeEditor } = useEditorContext();
  
  useEffect(() => {
    // Initialize the editor when the page loads
    initializeEditor();
    
    // Show welcome toast
    toast({
      title: "Welcome to VideoReel Editor",
      description: "Start by adding media, captions, or selecting a template",
    });
  }, []);
  
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      
      <div className="flex-grow flex overflow-hidden">
        <Sidebar />
        
        <div className="flex-grow flex flex-col overflow-hidden">
          <VideoPreview />
          <EditingTools />
        </div>
        
        <PropertiesPanel />
      </div>
      
      <TemplatesOverlay />
    </div>
  );
};

export default Editor;

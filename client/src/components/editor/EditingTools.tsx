import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useEditorContext } from '@/lib/editorContext';
import Timeline from './Timeline';

const EditingTools: React.FC = () => {
  const { 
    activeToolTab, 
    setActiveToolTab, 
    togglePlayback, 
    isPlaying,
    addClip 
  } = useEditorContext();
  
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };
  
  return (
    <div className="h-auto min-h-32 bg-surface-dark border-t border-gray-800 p-4">
      {/* Tools Tabs */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2 overflow-x-auto scrollbar-thin">
          <Button
            variant={activeToolTab === 'trim' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setActiveToolTab('trim')}
            className={activeToolTab === 'trim' ? 'bg-primary/10 text-primary' : 'bg-gray-800'}
          >
            Trim & Cut
          </Button>
          <Button
            variant={activeToolTab === 'captions' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setActiveToolTab('captions')}
            className={activeToolTab === 'captions' ? 'bg-primary/10 text-primary' : 'bg-gray-800'}
          >
            Captions
          </Button>
          <Button
            variant={activeToolTab === 'audio' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setActiveToolTab('audio')}
            className={activeToolTab === 'audio' ? 'bg-primary/10 text-primary' : 'bg-gray-800'}
          >
            Audio
          </Button>
          <Button
            variant={activeToolTab === 'filters' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setActiveToolTab('filters')}
            className={activeToolTab === 'filters' ? 'bg-primary/10 text-primary' : 'bg-gray-800'}
          >
            Filters
          </Button>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            className="w-8 h-8 bg-gray-800"
          >
            <i className="ri-zoom-in-line"></i>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            className="w-8 h-8 bg-gray-800"
          >
            <i className="ri-zoom-out-line"></i>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlayback}
            className="w-8 h-8 bg-gray-800"
          >
            <i className={isPlaying ? "ri-pause-line" : "ri-play-line"}></i>
          </Button>
        </div>
      </div>
      
      {/* Tool-specific actions bar */}
      {activeToolTab === 'captions' && (
        <div className="mb-4 flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-gray-800"
            onClick={() => addClip('caption')}
          >
            <i className="ri-add-line mr-1"></i>
            Add Caption
          </Button>
          <Button variant="outline" size="sm" className="bg-gray-800">
            <i className="ri-file-text-line mr-1"></i>
            Import Subtitles
          </Button>
        </div>
      )}
      
      {activeToolTab === 'trim' && (
        <div className="mb-4 flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-gray-800"
            onClick={() => addClip('video')}
          >
            <i className="ri-add-line mr-1"></i>
            Add Video Clip
          </Button>
          <Button variant="outline" size="sm" className="bg-gray-800">
            <i className="ri-scissors-cut-line mr-1"></i>
            Split Clip
          </Button>
        </div>
      )}
      
      {activeToolTab === 'audio' && (
        <div className="mb-4 flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-gray-800"
            onClick={() => addClip('audio')}
          >
            <i className="ri-add-line mr-1"></i>
            Add Audio Track
          </Button>
          <Button variant="outline" size="sm" className="bg-gray-800">
            <i className="ri-volume-up-line mr-1"></i>
            Adjust Volume
          </Button>
        </div>
      )}
      
      {/* Timeline */}
      <Timeline zoomLevel={zoomLevel} />
    </div>
  );
};

export default EditingTools;

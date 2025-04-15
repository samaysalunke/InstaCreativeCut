import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useEditorContext } from '@/lib/editorContext';
import Timeline from './Timeline';
import { 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause, 
  Plus, 
  FileText, 
  Scissors, 
  Volume2, 
  Subtitles 
} from 'lucide-react';

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
    <div className="h-auto min-h-32 bg-surface-dark border-t border-gray-800 p-4 pb-0">
      {/* Playback control - center aligned for prominence */}
      <div className="flex justify-center mb-3">
        <Button
          onClick={togglePlayback}
          size="icon"
          variant="default"
          className="w-12 h-12 rounded-full shadow-md bg-primary hover:bg-primary/90"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </Button>
      </div>
      
      {/* Tools Tabs */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2 overflow-x-auto scrollbar-thin pb-1">
          <Button
            variant={activeToolTab === 'trim' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setActiveToolTab('trim')}
            className={activeToolTab === 'trim' ? 'bg-primary/10 text-primary' : 'bg-gray-800'}
          >
            <Scissors className="mr-1 h-3.5 w-3.5" />
            Trim & Cut
          </Button>
          <Button
            variant={activeToolTab === 'captions' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setActiveToolTab('captions')}
            className={activeToolTab === 'captions' ? 'bg-primary/10 text-primary' : 'bg-gray-800'}
          >
            <Subtitles className="mr-1 h-3.5 w-3.5" />
            Captions
          </Button>
          <Button
            variant={activeToolTab === 'audio' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setActiveToolTab('audio')}
            className={activeToolTab === 'audio' ? 'bg-primary/10 text-primary' : 'bg-gray-800'}
          >
            <Volume2 className="mr-1 h-3.5 w-3.5" />
            Audio
          </Button>
          <Button
            variant={activeToolTab === 'filters' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setActiveToolTab('filters')}
            className={activeToolTab === 'filters' ? 'bg-primary/10 text-primary' : 'bg-gray-800'}
          >
            <i className="ri-contrast-2-line mr-1"></i>
            Filters
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            className="w-7 h-7 bg-gray-800"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            className="w-7 h-7 bg-gray-800"
          >
            <ZoomIn className="h-3.5 w-3.5" />
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
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add Caption
          </Button>
          <Button variant="outline" size="sm" className="bg-gray-800">
            <FileText className="mr-1 h-3.5 w-3.5" />
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
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add Video Clip
          </Button>
          <Button variant="outline" size="sm" className="bg-gray-800">
            <Scissors className="mr-1 h-3.5 w-3.5" />
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
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add Audio Track
          </Button>
          <Button variant="outline" size="sm" className="bg-gray-800">
            <Volume2 className="mr-1 h-3.5 w-3.5" />
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

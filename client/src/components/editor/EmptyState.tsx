import React from 'react';
import { Button } from '@/components/ui/button';
import { useEditorContext } from '@/lib/editorContext';

interface EmptyStateProps {
  onAddMedia: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddMedia }) => {
  const { showTemplates } = useEditorContext();
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-6 w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <i className="ri-film-line text-4xl text-primary"></i>
        </div>
        
        <h2 className="text-2xl font-bold mb-3">Create Your Video</h2>
        <p className="text-gray-400 mb-8">
          Get started by uploading a video or choosing a template to create your next viral video
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            className="flex items-center gap-2"
            onClick={onAddMedia}
          >
            <i className="ri-upload-2-line"></i>
            Upload Video
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
            onClick={showTemplates}
          >
            <i className="ri-magic-line"></i>
            Choose Template
          </Button>
        </div>
        
        <div className="mt-10 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-2">
              <i className="ri-scissors-line text-xl text-primary"></i>
            </div>
            <p className="text-sm text-gray-400">Trim and Edit</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-2">
              <i className="ri-font-size text-xl text-primary"></i>
            </div>
            <p className="text-sm text-gray-400">Add Captions</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-2">
              <i className="ri-music-2-line text-xl text-primary"></i>
            </div>
            <p className="text-sm text-gray-400">Add Audio</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
import React from 'react';
import { Button } from '@/components/ui/button';
import { useEditorContext } from '@/lib/editorContext';
import { Link } from 'wouter';

const Header: React.FC = () => {
  const { saveProject, exportVideo } = useEditorContext();
  
  return (
    <header className="border-b border-gray-800 p-3 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/">
          <a className="text-xl font-heading font-bold">
            <span className="text-primary">Video</span>
            <span className="text-white">Reel</span>
          </a>
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={saveProject}
          className="bg-surface-dark"
        >
          <i className="ri-save-line mr-1"></i>Save
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={exportVideo}
          className="bg-primary hover:bg-primary/90"
        >
          <i className="ri-upload-2-line mr-1"></i>Export
        </Button>
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer">
          <i className="ri-user-line"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;

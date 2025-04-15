import React from 'react';
import { Button } from '@/components/ui/button';
import { useEditorContext } from '@/lib/editorContext';
import { Link } from 'wouter';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const { saveProject, exportVideo } = useEditorContext();
  const isMobile = useIsMobile();
  
  return (
    <header className="border-b border-gray-800 p-2 md:p-3 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/">
          <a className="text-lg md:text-xl font-heading font-bold">
            <span className="text-primary">Video</span>
            <span className="text-white">Reel</span>
          </a>
        </Link>
      </div>
      <div className="flex items-center space-x-1 md:space-x-2">
        {isMobile ? (
          // Mobile view with icons only 
          <>
            <Button 
              variant="outline" 
              size="icon"
              onClick={saveProject}
              className="bg-surface-dark w-8 h-8 md:w-10 md:h-10"
            >
              <i className="ri-save-line"></i>
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={exportVideo}
              className="bg-primary hover:bg-primary/90 w-8 h-8 md:w-10 md:h-10"
            >
              <i className="ri-upload-2-line"></i>
            </Button>
          </>
        ) : (
          // Desktop view with text labels
          <>
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
          </>
        )}
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer">
          <i className="ri-user-line"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;

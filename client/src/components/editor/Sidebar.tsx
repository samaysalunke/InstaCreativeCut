import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEditorContext } from '@/lib/editorContext';

interface SidebarButtonProps {
  icon: string;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ icon, label, active = false, onClick }) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full text-left justify-start px-3 py-2 rounded-lg flex items-center",
        active ? "bg-primary/10 text-primary" : "hover:bg-gray-700"
      )}
      onClick={onClick}
    >
      <i className={`${icon} text-lg mr-3`}></i>
      <span>{label}</span>
    </Button>
  );
};

const Sidebar: React.FC = () => {
  const { activeToolTab, setActiveToolTab, showTemplates } = useEditorContext();
  
  const tools = [
    { id: 'trim', icon: 'ri-scissors-cut-line', label: 'Trim & Cut' },
    { id: 'captions', icon: 'ri-font-size', label: 'Captions' },
    { id: 'audio', icon: 'ri-music-2-line', label: 'Audio' },
    { id: 'filters', icon: 'ri-contrast-2-line', label: 'Filters' },
    { id: 'speed', icon: 'ri-speed-line', label: 'Speed' },
    { id: 'transitions', icon: 'ri-transition-line', label: 'Transitions' },
    { id: 'media', icon: 'ri-gallery-line', label: 'Media' },
    { id: 'subtitles', icon: 'ri-file-text-line', label: 'Subtitles' },
    { id: 'templates', icon: 'ri-magic-line', label: 'Templates' },
  ];

  return (
    <div className="w-16 md:w-64 bg-surface-dark border-r border-gray-800 flex flex-col">
      {/* Collapsed Sidebar (Mobile) */}
      <div className="md:hidden flex flex-col items-center py-4 space-y-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
              activeToolTab === tool.id 
                ? "bg-gray-700" 
                : "bg-gray-800 hover:bg-gray-700"
            )}
            onClick={() => tool.id === 'templates' ? showTemplates() : setActiveToolTab(tool.id)}
          >
            <i className={`${tool.icon} text-lg`}></i>
          </button>
        ))}
      </div>
      
      {/* Expanded Sidebar (Desktop) */}
      <div className="hidden md:flex flex-col flex-grow">
        <div className="p-3 border-b border-gray-800 text-sm font-medium text-gray-400 tracking-wider">
          EDITOR TOOLS
        </div>
        <div className="flex-grow overflow-y-auto p-2 space-y-1">
          {tools.map((tool) => (
            <SidebarButton
              key={tool.id}
              icon={tool.icon}
              label={tool.label}
              active={activeToolTab === tool.id}
              onClick={() => tool.id === 'templates' ? showTemplates() : setActiveToolTab(tool.id)}
            />
          ))}
        </div>
        <div className="p-3 border-t border-gray-800">
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => setActiveToolTab('export')}
          >
            <i className="ri-upload-2-line mr-2"></i>
            <span>Export Video</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

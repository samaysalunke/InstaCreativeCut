import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useEditorContext } from '@/lib/editorContext';
import { useQuery } from '@tanstack/react-query';
import { Template } from '@shared/schema';

interface TemplateCardProps {
  template: Template;
  onUse: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onUse }) => {
  return (
    <div className="template-card overflow-hidden rounded-lg bg-surface-dark cursor-pointer hover:bg-gray-800 transition">
      <div className="aspect-[9/16] bg-gray-900 relative">
        {template.thumbnailPath && (
          <img 
            src={template.thumbnailPath}
            className="w-full h-full object-cover"
            alt={`${template.title} preview`}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
          <Button 
            variant="default" 
            className="bg-primary hover:bg-primary/90"
            onClick={onUse}
          >
            Use Template
          </Button>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium">{template.title}</h3>
        <p className="text-xs text-gray-400 mt-1">{template.description}</p>
      </div>
    </div>
  );
};

const TemplatesOverlay: React.FC = () => {
  const { isTemplatesVisible, hideTemplates, applyTemplate } = useEditorContext();
  
  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ['/api/templates'],
    enabled: isTemplatesVisible,
  });
  
  // Fallback templates if loading or empty
  const fallbackTemplates: Template[] = [
    {
      id: 1,
      title: 'Travel Story',
      description: 'Perfect for sharing your adventures',
      thumbnailPath: 'https://images.unsplash.com/photo-1601987077677-5346c0c57d3f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8c3VucmlzZXx8fHx8fDE2NTc5NTEyMDM&ixlib=rb-1.2.1&q=80&w=225',
      aspectRatio: '9:16',
      category: 'travel',
      data: { clips: [] }
    },
    {
      id: 2,
      title: 'Dance Reel',
      description: 'Dynamic transitions with beat sync',
      thumbnailPath: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8ZGFuY2V8fHx8fHwxNjU3OTUxMjU0&ixlib=rb-1.2.1&q=80&w=225',
      aspectRatio: '9:16',
      category: 'dance',
      data: { clips: [] }
    },
    {
      id: 3,
      title: 'Food & Recipe',
      description: 'Beautiful food highlights with text overlays',
      thumbnailPath: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8Zm9vZHx8fHx8fDE2NTc5NTEyODU&ixlib=rb-1.2.1&q=80&w=225',
      aspectRatio: '9:16',
      category: 'food',
      data: { clips: [] }
    },
    {
      id: 4,
      title: 'Product Showcase',
      description: 'Highlight features with elegant transitions',
      thumbnailPath: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2NTc5NTEzOTk&ixlib=rb-1.2.1&q=80&w=225',
      aspectRatio: '9:16',
      category: 'product',
      data: { clips: [] }
    },
    {
      id: 5,
      title: 'Fitness Motivation',
      description: 'Dynamic transitions with motivational quotes',
      thumbnailPath: 'https://images.unsplash.com/photo-1600443295623-d5914f704795?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8d29ya291dHx8fHx8fDE2NTc5NTEzMjM&ixlib=rb-1.2.1&q=80&w=225',
      aspectRatio: '9:16',
      category: 'fitness',
      data: { clips: [] }
    },
    {
      id: 6,
      title: 'Fashion Lookbook',
      description: 'Elegant showcase for your style',
      thumbnailPath: 'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8ZmFzaGlvbnx8fHx8fDE2NTc5NTEzNTI&ixlib=rb-1.2.1&q=80&w=225',
      aspectRatio: '9:16',
      category: 'fashion',
      data: { clips: [] }
    }
  ];
  
  const displayTemplates = templates || fallbackTemplates;
  
  if (!isTemplatesVisible) {
    return null;
  }
  
  return (
    <div className="absolute inset-0 bg-background-dark/95 z-50">
      <div className="container mx-auto p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Video Templates</h2>
          <Button 
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full"
            onClick={hideTemplates}
          >
            <i className="ri-close-line text-xl"></i>
          </Button>
        </div>
        
        <div className="flex-grow overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-opacity-50 rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTemplates.map((template) => (
                <TemplateCard 
                  key={template.id} 
                  template={template} 
                  onUse={() => {
                    applyTemplate(template);
                    hideTemplates();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplatesOverlay;

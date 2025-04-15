import React, { useState } from 'react';
import { useEditorContext } from '@/lib/editorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface PropertiesPanelProps {
  className?: string;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ className }) => {
  const isMobile = useIsMobile();
  const { 
    selectedClipId, 
    clips, 
    updateClipProperties,
    generateCaptions
  } = useEditorContext();
  
  const [activeTab, setActiveTab] = useState('style');
  
  // Get the selected clip
  const selectedClip = clips.find(clip => clip.id === selectedClipId);
  
  if (!selectedClip) {
    return (
      <div className={cn(
        "bg-surface-dark border-l border-gray-800 overflow-y-auto",
        isMobile ? "w-full" : "w-80 hidden lg:block",
        className
      )}>
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-lg font-medium">Properties</h3>
        </div>
        <div className="p-8 text-center text-gray-400">
          Select a clip to edit its properties
        </div>
      </div>
    );
  }
  
  // Property panel content depends on the clip type
  const renderPropertiesContent = () => {
    if (selectedClip.type === 'caption') {
      // Caption properties
      return (
        <div className="p-4 space-y-4">
          <div className="flex space-x-2 mb-4">
            <Button 
              className="flex-1" 
              variant={activeTab === 'style' ? 'default' : 'outline'}
              onClick={() => setActiveTab('style')}
            >
              Caption Style
            </Button>
            <Button 
              className="flex-1" 
              variant={activeTab === 'animation' ? 'default' : 'outline'}
              onClick={() => setActiveTab('animation')}
            >
              Animation
            </Button>
          </div>
          
          {activeTab === 'style' ? (
            <>
              {/* Caption Text Input */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">Caption Text</Label>
                <Textarea 
                  value={selectedClip.properties?.text || ''}
                  className="bg-gray-800 border-gray-700"
                  rows={2}
                  onChange={(e) => updateClipProperties(selectedClip.id, { 
                    ...selectedClip.properties,
                    text: e.target.value
                  })}
                />
              </div>
              
              {/* Caption Font */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">Font Family</Label>
                <Select 
                  value={selectedClip.properties?.font || 'Poppins'}
                  onValueChange={(value) => updateClipProperties(selectedClip.id, { 
                    ...selectedClip.properties,
                    font: value
                  })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Comic Sans MS">Comic Sans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Caption Style Controls */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-400">Font Size</Label>
                  <div className="flex">
                    <Input
                      type="number"
                      value={selectedClip.properties?.fontSize || 24}
                      className="w-full bg-gray-800 border-gray-700"
                      onChange={(e) => updateClipProperties(selectedClip.id, { 
                        ...selectedClip.properties,
                        fontSize: Number(e.target.value)
                      })}
                    />
                    <span className="ml-2 self-center text-sm text-gray-400">px</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-400">Line Height</Label>
                  <div className="flex">
                    <Input
                      type="number"
                      value={selectedClip.properties?.lineHeight || 1.4}
                      step={0.1}
                      className="w-full bg-gray-800 border-gray-700"
                      onChange={(e) => updateClipProperties(selectedClip.id, { 
                        ...selectedClip.properties,
                        lineHeight: Number(e.target.value)
                      })}
                    />
                    <span className="ml-2 self-center text-sm text-gray-400">em</span>
                  </div>
                </div>
              </div>
              
              {/* Font Style Buttons */}
              <div className="flex space-x-2">
                <Button
                  variant={selectedClip.properties?.fontWeight === 'bold' ? 'default' : 'outline'}
                  size="icon"
                  className="w-10 h-10"
                  onClick={() => updateClipProperties(selectedClip.id, { 
                    ...selectedClip.properties,
                    fontWeight: selectedClip.properties?.fontWeight === 'bold' ? 'normal' : 'bold'
                  })}
                >
                  <i className="ri-bold"></i>
                </Button>
                <Button
                  variant={selectedClip.properties?.fontStyle === 'italic' ? 'default' : 'outline'}
                  size="icon"
                  className="w-10 h-10"
                  onClick={() => updateClipProperties(selectedClip.id, { 
                    ...selectedClip.properties,
                    fontStyle: selectedClip.properties?.fontStyle === 'italic' ? 'normal' : 'italic'
                  })}
                >
                  <i className="ri-italic"></i>
                </Button>
                <Button
                  variant={selectedClip.properties?.textDecoration === 'underline' ? 'default' : 'outline'}
                  size="icon"
                  className="w-10 h-10"
                  onClick={() => updateClipProperties(selectedClip.id, { 
                    ...selectedClip.properties,
                    textDecoration: selectedClip.properties?.textDecoration === 'underline' ? 'none' : 'underline'
                  })}
                >
                  <i className="ri-underline"></i>
                </Button>
                <Button
                  variant={selectedClip.properties?.textAlign === 'left' ? 'default' : 'outline'}
                  size="icon"
                  className="w-10 h-10"
                  onClick={() => updateClipProperties(selectedClip.id, { 
                    ...selectedClip.properties,
                    textAlign: 'left'
                  })}
                >
                  <i className="ri-align-left"></i>
                </Button>
                <Button
                  variant={selectedClip.properties?.textAlign === 'center' ? 'default' : 'outline'}
                  size="icon"
                  className="w-10 h-10"
                  onClick={() => updateClipProperties(selectedClip.id, { 
                    ...selectedClip.properties,
                    textAlign: 'center'
                  })}
                >
                  <i className="ri-align-center"></i>
                </Button>
                <Button
                  variant={selectedClip.properties?.textAlign === 'right' ? 'default' : 'outline'}
                  size="icon"
                  className="w-10 h-10"
                  onClick={() => updateClipProperties(selectedClip.id, { 
                    ...selectedClip.properties,
                    textAlign: 'right'
                  })}
                >
                  <i className="ri-align-right"></i>
                </Button>
              </div>
              
              {/* Caption Colors */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">Text Color</Label>
                <div className="grid grid-cols-6 gap-2">
                  {['#FFFFFF', '#F7DF1E', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'].map((color) => (
                    <div 
                      key={color}
                      className={`h-8 w-8 rounded-full cursor-pointer ${selectedClip.properties?.color === color ? 'border-2 border-primary' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => updateClipProperties(selectedClip.id, { 
                        ...selectedClip.properties,
                        color: color
                      })}
                    />
                  ))}
                </div>
              </div>
              
              {/* Caption Background */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-gray-400">Background</Label>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">Off</span>
                    <Switch
                      checked={!!selectedClip.properties?.backgroundColor}
                      onCheckedChange={(checked) => updateClipProperties(selectedClip.id, { 
                        ...selectedClip.properties,
                        backgroundColor: checked ? 'rgba(255, 255, 255, 0.8)' : undefined
                      })}
                    />
                    <span className="text-xs text-gray-400 ml-2">On</span>
                  </div>
                </div>
              </div>
              
              {/* Caption Position */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">Position</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    className="h-10"
                    onClick={() => updateClipProperties(selectedClip.id, { 
                      ...selectedClip.properties,
                      position: { x: 160, y: 280 }
                    })}
                  >
                    <i className="ri-layout-top-line"></i>
                  </Button>
                  <Button
                    variant={selectedClip.properties?.position?.y === 100 ? 'default' : 'outline'}
                    className="h-10"
                    onClick={() => updateClipProperties(selectedClip.id, { 
                      ...selectedClip.properties,
                      position: { x: 160, y: 100 }
                    })}
                  >
                    <i className="ri-layout-bottom-line"></i>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10"
                    onClick={() => updateClipProperties(selectedClip.id, { 
                      ...selectedClip.properties,
                      position: undefined
                    })}
                  >
                    <i className="ri-drag-move-line"></i>
                  </Button>
                </div>
              </div>
              
              {/* Auto Caption Generator */}
              <div className="pt-2 border-t border-gray-800">
                <Button 
                  className="w-full bg-secondary hover:bg-teal-600"
                  onClick={generateCaptions}
                >
                  <i className="ri-magic-line mr-2"></i>
                  Auto-Generate Captions
                </Button>
              </div>
            </>
          ) : (
            // Animation tab
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">Animation Type</Label>
                <Select 
                  value={selectedClip.properties?.animation || 'none'}
                  onValueChange={(value) => updateClipProperties(selectedClip.id, { 
                    ...selectedClip.properties,
                    animation: value
                  })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select animation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="fade">Fade</SelectItem>
                    <SelectItem value="slide-up">Slide Up</SelectItem>
                    <SelectItem value="slide-down">Slide Down</SelectItem>
                    <SelectItem value="bounce">Bounce</SelectItem>
                    <SelectItem value="typewriter">Typewriter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">Animation Duration (ms)</Label>
                <Input
                  type="number"
                  value={selectedClip.properties?.animationDuration || 500}
                  className="bg-gray-800 border-gray-700"
                  onChange={(e) => updateClipProperties(selectedClip.id, { 
                    ...selectedClip.properties,
                    animationDuration: Number(e.target.value)
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">Animation Delay (ms)</Label>
                <Input
                  type="number"
                  value={selectedClip.properties?.animationDelay || 0}
                  className="bg-gray-800 border-gray-700"
                  onChange={(e) => updateClipProperties(selectedClip.id, { 
                    ...selectedClip.properties,
                    animationDelay: Number(e.target.value)
                  })}
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  className="w-full"
                  onClick={() => {
                    // Preview animation (implementation would depend on your animation system)
                    console.log('Preview animation');
                  }}
                >
                  <i className="ri-play-line mr-2"></i>
                  Preview Animation
                </Button>
              </div>
            </div>
          )}
        </div>
      );
    } else if (selectedClip.type === 'video') {
      // Video clip properties
      return (
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">Clip Name</Label>
            <Input 
              value={selectedClip.name}
              className="bg-gray-800 border-gray-700"
              onChange={(e) => updateClipProperties(selectedClip.id, { 
                ...selectedClip.properties,
                name: e.target.value
              })}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">Brightness</Label>
            <Input
              type="range"
              min="0"
              max="200"
              value={selectedClip.properties?.brightness || 100}
              className="w-full"
              onChange={(e) => updateClipProperties(selectedClip.id, { 
                ...selectedClip.properties,
                brightness: Number(e.target.value)
              })}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0%</span>
              <span>100%</span>
              <span>200%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">Contrast</Label>
            <Input
              type="range"
              min="0"
              max="200"
              value={selectedClip.properties?.contrast || 100}
              className="w-full"
              onChange={(e) => updateClipProperties(selectedClip.id, { 
                ...selectedClip.properties,
                contrast: Number(e.target.value)
              })}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0%</span>
              <span>100%</span>
              <span>200%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">Saturation</Label>
            <Input
              type="range"
              min="0"
              max="200"
              value={selectedClip.properties?.saturation || 100}
              className="w-full"
              onChange={(e) => updateClipProperties(selectedClip.id, { 
                ...selectedClip.properties,
                saturation: Number(e.target.value)
              })}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0%</span>
              <span>100%</span>
              <span>200%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">Speed</Label>
            <Select 
              value={String(selectedClip.properties?.speed || 1)}
              onValueChange={(value) => updateClipProperties(selectedClip.id, { 
                ...selectedClip.properties,
                speed: Number(value)
              })}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.25">0.25x</SelectItem>
                <SelectItem value="0.5">0.5x</SelectItem>
                <SelectItem value="0.75">0.75x</SelectItem>
                <SelectItem value="1">1x (Normal)</SelectItem>
                <SelectItem value="1.25">1.25x</SelectItem>
                <SelectItem value="1.5">1.5x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    } else if (selectedClip.type === 'audio') {
      // Audio clip properties
      return (
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">Audio Name</Label>
            <Input 
              value={selectedClip.name}
              className="bg-gray-800 border-gray-700"
              onChange={(e) => updateClipProperties(selectedClip.id, { 
                ...selectedClip.properties,
                name: e.target.value
              })}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">Volume</Label>
            <Input
              type="range"
              min="0"
              max="100"
              value={selectedClip.properties?.volume || 100}
              className="w-full"
              onChange={(e) => updateClipProperties(selectedClip.id, { 
                ...selectedClip.properties,
                volume: Number(e.target.value)
              })}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">Fade In</Label>
            <Input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={selectedClip.properties?.fadeIn || 0}
              className="w-full"
              onChange={(e) => updateClipProperties(selectedClip.id, { 
                ...selectedClip.properties,
                fadeIn: Number(e.target.value)
              })}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0s</span>
              <span>{((selectedClip.properties?.fadeIn || 0) / 1000).toFixed(1)}s</span>
              <span>5s</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">Fade Out</Label>
            <Input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={selectedClip.properties?.fadeOut || 0}
              className="w-full"
              onChange={(e) => updateClipProperties(selectedClip.id, { 
                ...selectedClip.properties,
                fadeOut: Number(e.target.value)
              })}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0s</span>
              <span>{((selectedClip.properties?.fadeOut || 0) / 1000).toFixed(1)}s</span>
              <span>5s</span>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-4 text-center text-gray-400">
        Select a clip to edit its properties
      </div>
    );
  };
  
  return (
    <div className={cn(
      "bg-surface-dark border-l border-gray-800 overflow-y-auto",
      isMobile ? "w-full h-full" : "w-80 hidden lg:block",
      className
    )}>
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-lg font-medium">Properties</h3>
      </div>
      {renderPropertiesContent()}
    </div>
  );
};

export default PropertiesPanel;

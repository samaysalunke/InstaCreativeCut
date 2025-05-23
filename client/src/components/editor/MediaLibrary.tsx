import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEditorContext } from '@/lib/editorContext';
import { Search, Upload, X, Folder, Plus, Film, FolderPlus } from 'lucide-react';

interface MediaLibraryProps {
  onClose: () => void;
}

// Dummy media data for illustration
const dummyMedia = [
  { id: 1, name: 'Beach Vacation', type: 'video', tags: ['travel', 'summer'], path: '/videos/beach.mp4', thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
  { id: 2, name: 'City Timelapse', type: 'video', tags: ['urban', 'timelapse'], path: '/videos/city.mp4', thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
  { id: 3, name: 'Mountain Hike', type: 'video', tags: ['nature', 'adventure'], path: '/videos/mountain.mp4', thumbnail: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
  { id: 4, name: 'Coffee Shop', type: 'video', tags: ['lifestyle', 'urban'], path: '/videos/coffee.mp4', thumbnail: 'https://images.unsplash.com/photo-1497935586047-9395ee065e52?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
];

const folderList = [
  { id: 1, name: 'Travel', count: 5 },
  { id: 2, name: 'Family', count: 8 },
  { id: 3, name: 'Work', count: 3 },
  { id: 4, name: 'Events', count: 7 },
];

const tagList = ['travel', 'nature', 'urban', 'lifestyle', 'summer', 'timelapse', 'adventure'];

const MediaLibrary: React.FC<MediaLibraryProps> = ({ onClose }) => {
  const isMobile = useIsMobile();
  const { addClip } = useEditorContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  
  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const filterMedia = () => {
    return dummyMedia.filter(media => {
      // Filter by search term
      const matchesSearch = searchTerm === '' || 
        media.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by selected tags
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => media.tags.includes(tag));
        
      return matchesSearch && matchesTags;
    });
  };
  
  const handleMediaSelect = (media: typeof dummyMedia[0]) => {
    // In a real implementation, we would use the actual path
    // For now, we'll use a placeholder video path
    addClip('video', { src: 'https://example.com/video.mp4' });
    onClose();
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real implementation, we would upload the file
      // For now, we'll just log it
      console.log('File selected:', files[0].name);
      
      // Mock adding the clip
      addClip('video', { src: URL.createObjectURL(files[0]) });
      onClose();
    }
  };
  
  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-gray-800 p-3 flex items-center justify-between sticky top-0 bg-background z-10">
        <h2 className="text-xl font-semibold">Media Library</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4 mr-1" />
            Close
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        {/* Left sidebar (folders/tags) */}
        <div className="w-full lg:w-64 border-r border-gray-800 flex-shrink-0">
          <Tabs defaultValue="folders" className="h-full flex flex-col">
            <TabsList className="grid grid-cols-2 m-2">
              <TabsTrigger value="folders">Folders</TabsTrigger>
              <TabsTrigger value="tags">Tags</TabsTrigger>
            </TabsList>
            
            <TabsContent value="folders" className="flex-grow overflow-y-auto p-2">
              <div className="space-y-1">
                {folderList.map(folder => (
                  <div 
                    key={folder.id}
                    className={`flex items-center justify-between rounded-md p-2 cursor-pointer ${selectedFolder === folder.id ? 'bg-primary/20' : 'hover:bg-gray-800'}`}
                    onClick={() => setSelectedFolder(folder.id === selectedFolder ? null : folder.id)}
                  >
                    <div className="flex items-center">
                      <Folder className="mr-2 h-4 w-4 text-primary" />
                      <span>{folder.name}</span>
                    </div>
                    <Badge variant="outline">{folder.count}</Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="tags" className="flex-grow overflow-y-auto p-3">
              <div className="flex flex-wrap gap-2">
                {tagList.map(tag => (
                  <Badge 
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagSelect(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right content (media grid) */}
        <div className="flex-grow flex flex-col overflow-hidden">
          {/* Upload and Search - Prominently display upload first for mobile */}
          <div className="p-3 border-b border-gray-800 flex flex-col gap-3">
            {/* Prominent upload button for all devices */}
            <div className="w-full">
              <label className="cursor-pointer w-full">
                <Button 
                  className="w-full py-4 md:py-6 text-white bg-primary hover:bg-primary/90 flex items-center justify-center"
                  size="lg"
                >
                  <div className="flex flex-col items-center">
                    <Upload className="h-6 w-6 mb-1" />
                    <span className="font-medium">Tap to Upload Media</span>
                    <span className="text-xs mt-1 opacity-80">Videos & Images</span>
                  </div>
                </Button>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="video/*,image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            
            {/* Search field */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-9"
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Media grid */}
          <div className="flex-grow overflow-y-auto p-3">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filterMedia().map(media => (
                <div 
                  key={media.id}
                  className="relative group cursor-pointer border border-gray-800 rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  onClick={() => handleMediaSelect(media)}
                >
                  <div className="aspect-video bg-gray-900 overflow-hidden">
                    <img 
                      src={media.thumbnail} 
                      alt={media.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Always visible overlay for mobile users */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-3">
                      <Button 
                        size="sm" 
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                      >
                        <Plus className="mr-1 h-3.5 w-3.5" /> Add to Project
                      </Button>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="font-medium truncate">{media.name}</div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center">
                      <Film className="mr-1 h-3 w-3" /> Video
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filterMedia().length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Film className="mx-auto h-12 w-12 mb-3 opacity-40" />
                <p>No media found. Try adjusting your filters or upload a new file.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaLibrary;
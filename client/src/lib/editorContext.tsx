import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Project, TimelineClip, ProjectData, Template } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from './queryClient';
import { processFfmpegCommands } from './videoProcessor';

interface EditorContextType {
  clips: TimelineClip[];
  currentTime: number;
  duration: number;
  selectedClipId?: string;
  activeToolTab: string;
  isPlaying: boolean;
  videoSrc?: string;
  captions: TimelineClip[];
  isTemplatesVisible: boolean;
  
  initializeEditor: () => void;
  setCurrentTime: (time: number) => void;
  selectClip: (id?: string) => void;
  setActiveToolTab: (tab: string) => void;
  togglePlayback: () => void;
  updateClipTiming: (id: string, start: number, end: number) => void;
  updateClipProperties: (id: string, properties: any) => void;
  addClip: (type: 'video' | 'audio' | 'caption', options?: { src?: string, name?: string }) => void;
  removeClip: (id: string) => void;
  saveProject: () => Promise<void>;
  exportVideo: () => Promise<void>;
  generateCaptions: () => void;
  showTemplates: () => void;
  hideTemplates: () => void;
  applyTemplate: (template: Template) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // Editor state
  const [clips, setClips] = useState<TimelineClip[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15000); // Default 15 seconds (in ms)
  const [selectedClipId, setSelectedClipId] = useState<string | undefined>();
  const [activeToolTab, setActiveToolTab] = useState('trim');
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | undefined>();
  const [isTemplatesVisible, setIsTemplatesVisible] = useState(false);
  
  // Get only caption clips
  const captions = clips.filter(clip => clip.type === 'caption');
  
  // Initialize editor with default content
  const initializeEditor = useCallback(() => {
    // Demo clips for initial state
    const initialClips: TimelineClip[] = [
      {
        id: uuidv4(),
        type: 'video',
        name: 'Intro clip',
        start: 0,
        end: 6000,
        track: 0,
        color: '#FF5A5F'
      },
      {
        id: uuidv4(),
        type: 'video',
        name: 'B-roll',
        start: 6200,
        end: 10000,
        track: 0,
        color: '#00C4B4'
      },
      {
        id: uuidv4(),
        type: 'video',
        name: 'Sunset shot',
        start: 10200,
        end: 15000,
        track: 0,
        color: '#FFD166'
      },
      {
        id: uuidv4(),
        type: 'audio',
        name: 'Background music',
        start: 0,
        end: 15000,
        track: 1,
        color: '#00C4B4'
      },
      {
        id: uuidv4(),
        type: 'caption',
        name: 'Intro text',
        start: 2000,
        end: 5000,
        track: 2,
        color: '#FFD166',
        properties: {
          text: 'Welcome to my video!',
          font: 'Poppins',
          fontSize: 24,
          color: '#FFFFFF',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          position: { x: 160, y: 280 }
        }
      },
      {
        id: uuidv4(),
        type: 'caption',
        name: 'Amazing sunset',
        start: 11000,
        end: 14000,
        track: 2,
        color: '#FFD166',
        properties: {
          text: 'Amazing sunset views! 😍',
          font: 'Poppins',
          fontSize: 24,
          color: '#FFFFFF',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          position: { x: 160, y: 100 }
        }
      }
    ];
    
    setClips(initialClips);
    setCurrentTime(0);
    setDuration(15000);
    setSelectedClipId(undefined);
    setActiveToolTab('trim');
    setIsPlaying(false);
  }, []);
  
  // Select a clip for editing
  const selectClip = useCallback((id?: string) => {
    setSelectedClipId(id);
    
    // Set the active tool tab based on the selected clip type
    if (id) {
      const clip = clips.find(c => c.id === id);
      if (clip) {
        switch (clip.type) {
          case 'video':
            setActiveToolTab('trim');
            break;
          case 'audio':
            setActiveToolTab('audio');
            break;
          case 'caption':
            setActiveToolTab('captions');
            break;
        }
      }
    }
  }, [clips]);
  
  // Toggle video playback
  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  
  // Update clip timing (start and end times)
  const updateClipTiming = useCallback((id: string, start: number, end: number) => {
    setClips(prevClips => 
      prevClips.map(clip => 
        clip.id === id 
          ? { ...clip, start, end } 
          : clip
      )
    );
  }, []);
  
  // Update clip properties
  const updateClipProperties = useCallback((id: string, properties: any) => {
    setClips(prevClips => 
      prevClips.map(clip => 
        clip.id === id 
          ? { ...clip, properties: { ...properties } } 
          : clip
      )
    );
  }, []);
  
  // Add a new clip
  const addClip = useCallback((type: 'video' | 'audio' | 'caption', options?: { src?: string, name?: string }) => {
    const newClip: TimelineClip = {
      id: uuidv4(),
      type,
      name: options?.name || (type === 'video' ? 'New Video' : type === 'audio' ? 'New Audio' : 'New Caption'),
      start: currentTime,
      end: currentTime + 3000, // 3 seconds default duration
      track: type === 'video' ? 0 : type === 'audio' ? 1 : 2,
      color: type === 'video' ? '#FF5A5F' : type === 'audio' ? '#00C4B4' : '#FFD166',
      src: options?.src
    };
    
    if (type === 'caption') {
      newClip.properties = {
        text: 'New caption text',
        font: 'Poppins',
        fontSize: 24,
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        position: { x: 160, y: 280 }
      };
    }
    
    setClips(prevClips => [...prevClips, newClip]);
    
    // If it's a video and has a source, set it as the current videoSrc
    if (type === 'video' && options?.src) {
      setVideoSrc(options.src);
    }
    
    selectClip(newClip.id);
    
    toast({
      title: `Added new ${type} clip`,
      description: "Edit the properties in the panel on the right",
    });
  }, [currentTime, toast, selectClip]);
  
  // Remove a clip
  const removeClip = useCallback((id: string) => {
    setClips(prevClips => prevClips.filter(clip => clip.id !== id));
    
    if (selectedClipId === id) {
      setSelectedClipId(undefined);
    }
    
    toast({
      title: "Clip removed",
      description: "The clip has been deleted from the timeline",
    });
  }, [selectedClipId, toast]);
  
  // Save project
  const saveProject = useCallback(async () => {
    try {
      toast({
        title: "Saving project...",
        description: "Please wait while we save your project",
      });
      
      const projectData: ProjectData = {
        clips,
        duration,
        selectedClipId,
        activeToolTab
      };
      
      // For now, just log the data
      console.log('Saving project data:', projectData);
      
      // In a real app, you would save to backend
      // await apiRequest('POST', '/api/projects', {
      //   title: 'My Project',
      //   data: projectData
      // });
      
      toast({
        title: "Project saved!",
        description: "Your project has been saved successfully",
      });
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error saving project",
        description: "There was an error saving your project. Please try again.",
        variant: "destructive"
      });
    }
  }, [clips, duration, selectedClipId, activeToolTab, toast]);
  
  // Export video
  const exportVideo = useCallback(async () => {
    try {
      toast({
        title: "Exporting video...",
        description: "Please wait while we process your video",
      });
      
      // In a real app, this would trigger video processing with FFmpeg
      // For now, just wait and show a success message
      setTimeout(() => {
        toast({
          title: "Video exported!",
          description: "Your video has been exported successfully",
        });
      }, 3000);
    } catch (error) {
      console.error('Error exporting video:', error);
      toast({
        title: "Error exporting video",
        description: "There was an error exporting your video. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  // Generate captions
  const generateCaptions = useCallback(() => {
    toast({
      title: "Generating captions...",
      description: "This would use speech recognition in a real app",
    });
    
    // Mock generating captions
    setTimeout(() => {
      const newCaption: TimelineClip = {
        id: uuidv4(),
        type: 'caption',
        name: 'Auto-generated caption',
        start: currentTime,
        end: currentTime + 3000,
        track: 2,
        color: '#FFD166',
        properties: {
          text: 'This is an auto-generated caption',
          font: 'Poppins',
          fontSize: 24,
          color: '#FFFFFF',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          position: { x: 160, y: 280 }
        }
      };
      
      setClips(prevClips => [...prevClips, newCaption]);
      selectClip(newCaption.id);
      
      toast({
        title: "Captions generated!",
        description: "Caption has been added to the timeline",
      });
    }, 1500);
  }, [currentTime, toast, selectClip]);
  
  // Show templates overlay
  const showTemplates = useCallback(() => {
    setIsTemplatesVisible(true);
  }, []);
  
  // Hide templates overlay
  const hideTemplates = useCallback(() => {
    setIsTemplatesVisible(false);
  }, []);
  
  // Apply a template
  const applyTemplate = useCallback((template: Template) => {
    try {
      // Just a demo implementation
      toast({
        title: `Applying ${template.title} template`,
        description: "Loading template content...",
      });
      
      // Create a new set of clips based on the template
      const templateClips: TimelineClip[] = [
        {
          id: uuidv4(),
          type: 'video',
          name: 'Template Video 1',
          start: 0,
          end: 5000,
          track: 0,
          color: '#FF5A5F'
        },
        {
          id: uuidv4(),
          type: 'video',
          name: 'Template Video 2',
          start: 5200,
          end: 10000,
          track: 0,
          color: '#00C4B4'
        },
        {
          id: uuidv4(),
          type: 'audio',
          name: 'Template Music',
          start: 0,
          end: 10000,
          track: 1,
          color: '#00C4B4'
        },
        {
          id: uuidv4(),
          type: 'caption',
          name: 'Template Caption 1',
          start: 1000,
          end: 4000,
          track: 2,
          color: '#FFD166',
          properties: {
            text: 'Add your content here',
            font: 'Poppins',
            fontSize: 24,
            color: '#FFFFFF',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            position: { x: 160, y: 280 }
          }
        },
        {
          id: uuidv4(),
          type: 'caption',
          name: 'Template Caption 2',
          start: 6000,
          end: 9000,
          track: 2,
          color: '#FFD166',
          properties: {
            text: template.title,
            font: 'Poppins',
            fontSize: 32,
            color: '#FFFFFF',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            position: { x: 160, y: 280 }
          }
        }
      ];
      
      setClips(templateClips);
      setDuration(10000);
      setCurrentTime(0);
      
      toast({
        title: "Template applied!",
        description: "Your project has been updated with the template",
      });
    } catch (error) {
      console.error('Error applying template:', error);
      toast({
        title: "Error applying template",
        description: "There was an error applying the template. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  // Stop playback when reaching the end
  useEffect(() => {
    if (currentTime >= duration && isPlaying) {
      setIsPlaying(false);
      setCurrentTime(duration);
    }
  }, [currentTime, duration, isPlaying]);
  
  // Create timer for playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 50; // Update every 50ms
          return next > duration ? duration : next;
        });
      }, 50);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration]);
  
  const contextValue: EditorContextType = {
    clips,
    currentTime,
    duration,
    selectedClipId,
    activeToolTab,
    isPlaying,
    videoSrc,
    captions,
    isTemplatesVisible,
    
    initializeEditor,
    setCurrentTime,
    selectClip,
    setActiveToolTab,
    togglePlayback,
    updateClipTiming,
    updateClipProperties,
    addClip,
    removeClip,
    saveProject,
    exportVideo,
    generateCaptions,
    showTemplates,
    hideTemplates,
    applyTemplate
  };
  
  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }
  return context;
};

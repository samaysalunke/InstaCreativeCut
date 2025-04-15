import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useEditorContext } from '@/lib/editorContext';
import { TimelineClip } from '@shared/schema';

interface CaptionEditorProps {
  clip: TimelineClip;
}

const CaptionEditor: React.FC<CaptionEditorProps> = ({ clip }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const textObjectRef = useRef<fabric.IText | null>(null);
  
  const { updateClipProperties } = useEditorContext();
  
  // Initialize fabric canvas
  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        width: 320,
        height: 568, // 16:9 aspect ratio
        backgroundColor: '#000000'
      });
      
      // Add text object
      const text = new fabric.IText(clip.properties?.text || 'Enter caption text', {
        left: clip.properties?.position?.x || 160,
        top: clip.properties?.position?.y || 280,
        fontFamily: clip.properties?.font || 'Poppins',
        fontSize: clip.properties?.fontSize || 24,
        fill: clip.properties?.color || '#FFFFFF',
        textAlign: clip.properties?.textAlign || 'center',
        fontWeight: clip.properties?.fontWeight || 'normal',
        fontStyle: clip.properties?.fontStyle || 'normal',
        textBackgroundColor: clip.properties?.backgroundColor || null,
        lineHeight: clip.properties?.lineHeight || 1.4,
        originX: 'center',
        originY: 'center'
      });
      
      fabricCanvasRef.current.add(text);
      fabricCanvasRef.current.setActiveObject(text);
      textObjectRef.current = text;
      
      // Handle object modifications
      fabricCanvasRef.current.on('object:modified', function(e) {
        if (e.target === text) {
          const newPosition = {
            x: Math.round(text.left || 0),
            y: Math.round(text.top || 0)
          };
          
          updateClipProperties(clip.id, {
            ...clip.properties,
            text: text.text,
            position: newPosition
          });
        }
      });
    }
    
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [clip.id]);
  
  // Update canvas when properties change
  useEffect(() => {
    if (fabricCanvasRef.current && textObjectRef.current) {
      const text = textObjectRef.current;
      
      text.set({
        text: clip.properties?.text || 'Enter caption text',
        left: clip.properties?.position?.x || 160,
        top: clip.properties?.position?.y || 280,
        fontFamily: clip.properties?.font || 'Poppins',
        fontSize: clip.properties?.fontSize || 24,
        fill: clip.properties?.color || '#FFFFFF',
        textAlign: clip.properties?.textAlign || 'center',
        fontWeight: clip.properties?.fontWeight || 'normal',
        fontStyle: clip.properties?.fontStyle || 'normal',
        textBackgroundColor: clip.properties?.backgroundColor || null,
        lineHeight: clip.properties?.lineHeight || 1.4,
      });
      
      fabricCanvasRef.current.renderAll();
    }
  }, [clip.properties]);
  
  return (
    <div className="w-full flex items-center justify-center mb-4">
      <canvas ref={canvasRef} className="border border-gray-700 rounded-lg shadow-lg" />
    </div>
  );
};

export default CaptionEditor;

import { TimelineClip } from '@shared/schema';

// Function to generate CSS styles for a caption based on its properties
export function generateCaptionStyles(caption: TimelineClip): React.CSSProperties {
  if (!caption.properties) {
    return {};
  }
  
  const styles: React.CSSProperties = {
    fontFamily: caption.properties.font || 'Poppins',
    fontSize: caption.properties.fontSize ? `${caption.properties.fontSize}px` : '24px',
    color: caption.properties.color || '#FFFFFF',
    fontWeight: caption.properties.fontWeight || 'normal',
    fontStyle: caption.properties.fontStyle || 'normal',
    textDecoration: caption.properties.textDecoration || 'none',
    textAlign: caption.properties.textAlign || 'center',
    lineHeight: caption.properties.lineHeight || 1.4,
  };
  
  if (caption.properties.backgroundColor) {
    styles.backgroundColor = caption.properties.backgroundColor;
    styles.padding = '8px 12px';
    styles.borderRadius = '8px';
    styles.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
  }
  
  // Apply animations if specified
  if (caption.properties.animation) {
    switch (caption.properties.animation) {
      case 'fade':
        styles.animation = `fade ${caption.properties.animationDuration || 500}ms ease-in-out ${caption.properties.animationDelay || 0}ms`;
        break;
      case 'slide-up':
        styles.animation = `slideUp ${caption.properties.animationDuration || 500}ms ease-out ${caption.properties.animationDelay || 0}ms`;
        break;
      case 'slide-down':
        styles.animation = `slideDown ${caption.properties.animationDuration || 500}ms ease-out ${caption.properties.animationDelay || 0}ms`;
        break;
      case 'bounce':
        styles.animation = `bounce ${caption.properties.animationDuration || 800}ms ease-in-out ${caption.properties.animationDelay || 0}ms`;
        break;
    }
  }
  
  // Apply position
  if (caption.properties.position) {
    styles.position = 'absolute';
    styles.bottom = `${caption.properties.position.y}px`;
    styles.left = `${caption.properties.position.x}px`;
    styles.transform = 'translate(-50%, 0)';
  } else {
    styles.position = 'absolute';
    styles.bottom = '32px';
    styles.left = '50%';
    styles.transform = 'translateX(-50%)';
  }
  
  return styles;
}

// Generate keyframes for animations (would typically be in a CSS file)
export const captionAnimations = `
  @keyframes fade {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  @keyframes slideUp {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes slideDown {
    0% { transform: translateY(-20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
  
  @keyframes typewriter {
    from { width: 0; }
    to { width: 100%; }
  }
`;

// Convert SRT format to timeline clips
export function srtToCaptions(srtContent: string): Partial<TimelineClip>[] {
  const lines = srtContent.trim().split('\n\n');
  const captions: Partial<TimelineClip>[] = [];
  
  for (const block of lines) {
    const parts = block.trim().split('\n');
    if (parts.length < 3) continue;
    
    // Parse timecodes (format: 00:00:22,500 --> 00:00:25,000)
    const timecodes = parts[1].split(' --> ');
    if (timecodes.length !== 2) continue;
    
    const startTime = srtTimeToMs(timecodes[0]);
    const endTime = srtTimeToMs(timecodes[1]);
    
    // Extract text (could be multiple lines)
    const text = parts.slice(2).join('\n');
    
    captions.push({
      type: 'caption',
      start: startTime,
      end: endTime,
      properties: {
        text,
        font: 'Poppins',
        fontSize: 24,
        color: '#FFFFFF',
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
      }
    });
  }
  
  return captions;
}

// Helper to convert SRT time format to milliseconds
function srtTimeToMs(timeString: string): number {
  const [hours, minutes, secondsAndMs] = timeString.split(':');
  const [seconds, milliseconds] = secondsAndMs.replace(',', '.').split('.');
  
  return (
    parseInt(hours) * 3600000 +
    parseInt(minutes) * 60000 +
    parseInt(seconds) * 1000 +
    parseInt(milliseconds)
  );
}

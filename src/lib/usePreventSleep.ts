import { useEffect, useRef } from 'react';

/**
 * Custom hook to prevent the browser/system from going to sleep
 * Uses Wake Lock API when available, with fallback mechanisms
 */
export const usePreventSleep = (enabled: boolean = true) => {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!enabled) {
      releaseWakeLock();
      return;
    }

    // Method 1: Wake Lock API (modern browsers)
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          console.log('✅ Wake Lock activated - screen will stay awake');

          wakeLockRef.current.addEventListener('release', () => {
            console.log('⚠️ Wake Lock released');
          });
        } else {
          console.log('⚠️ Wake Lock API not supported, using fallback methods');
        }
      } catch (err) {
        console.error('Failed to activate Wake Lock:', err);
      }
    };

    // Method 2: Invisible video loop (fallback for older browsers)
    const createVideoKeepAlive = () => {
      if (!videoRef.current) {
        const video = document.createElement('video');
        video.setAttribute('muted', 'true');
        video.setAttribute('playsinline', 'true');
        video.setAttribute('loop', 'true');
        video.style.position = 'fixed';
        video.style.opacity = '0';
        video.style.pointerEvents = 'none';
        video.style.width = '1px';
        video.style.height = '1px';
        video.style.bottom = '0';
        video.style.right = '0';

        // Create a minimal video data URL (1 frame black video)
        const videoUrl = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMQAAAAhmcmVlAAAA70m' +
          'RhdAAAAAAAAA8WQhkAAAABC6moovbAAAAAnMAAASwgBh4hhgH//44QAAAAABBRAAAAANDgAAFAAA';
        
        video.src = videoUrl;
        document.body.appendChild(video);
        
        video.play().catch(err => {
          console.log('Video keep-alive failed:', err);
        });

        videoRef.current = video;
        console.log('✅ Video keep-alive mechanism activated');
      }
    };

    // Method 3: Periodic activity simulation (last resort)
    const startKeepAlive = () => {
      // Send periodic "heartbeat" to prevent inactivity
      keepAliveIntervalRef.current = setInterval(() => {
        // Create a minimal DOM activity to prevent sleep
        const timestamp = Date.now();
        document.title = `AVIATOR - FlightDeck Automation (Active: ${new Date(timestamp).toLocaleTimeString()})`;
        
        // Trigger a minimal localStorage update to simulate activity
        localStorage.setItem('aviator_keepalive', timestamp.toString());
        
        console.log('🔄 Keep-alive heartbeat:', new Date(timestamp).toLocaleTimeString());
      }, 30000); // Every 30 seconds

      console.log('✅ Keep-alive heartbeat activated (30s interval)');
    };

    // Initialize all methods
    requestWakeLock();
    createVideoKeepAlive();
    startKeepAlive();

    // Re-acquire wake lock when page becomes visible again
    const handleVisibilityChange = () => {
      if (wakeLockRef.current !== null && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      releaseWakeLock();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);

  const releaseWakeLock = () => {
    // Release Wake Lock
    if (wakeLockRef.current !== null) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
      console.log('🛑 Wake Lock released');
    }

    // Stop keep-alive interval
    if (keepAliveIntervalRef.current !== null) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
      console.log('🛑 Keep-alive heartbeat stopped');
    }

    // Remove video element
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.remove();
      videoRef.current = null;
      console.log('🛑 Video keep-alive removed');
    }

    // Reset title
    document.title = 'AVIATOR - FlightDeck Automation';
  };

  return {
    isActive: enabled && (
      wakeLockRef.current !== null || 
      keepAliveIntervalRef.current !== null || 
      videoRef.current !== null
    ),
  };
};

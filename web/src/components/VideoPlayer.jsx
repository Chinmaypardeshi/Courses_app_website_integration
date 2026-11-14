import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default function VideoPlayer({ src, poster }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      playerRef.current = videojs(videoElement, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        responsive: true,
        fluid: true,
        poster: poster,
        sources: [{
          src: src,
          type: src.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'
        }]
      });
    } else {
      const player = playerRef.current;
      player.src({
        src: src,
        type: src.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'
      });
    }
  }, [src]);

  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player style={{ width: '100%', borderRadius: '16px', overflow: 'hidden' }}>
      <video ref={videoRef} className="video-js vjs-big-play-centered vjs-theme-forest" />
    </div>
  );
}
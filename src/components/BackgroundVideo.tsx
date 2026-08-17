"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

const VIDEO_SRC = "https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8";

export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    const play = () => {
      video.play().catch((error) => {
        console.warn("Autoplay video bloccato:", error);
      });
    };

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = VIDEO_SRC;
      video.addEventListener("loadedmetadata", play, { once: true });
    } else if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(VIDEO_SRC);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => play());
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          console.error("Errore HLS fatale:", data.type, data.details);
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls?.startLoad();
          }
        }
      });
    } else {
      video.src = VIDEO_SRC;
      video.addEventListener("loadedmetadata", play, { once: true });
    }

    return () => {
      hls?.destroy();
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover opacity-100"
      />
    </div>
  );
}
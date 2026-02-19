'use client'

import { useState } from 'react';
import ReactPlayer from 'react-player'
import { fifthElementVideos } from '../../data/videos'

export default function FifthElementVideos() {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleGuyVideoStart = () => {
    setTimeout(() => {
      setIsFadingOut(true);
    }, 6000);
  };

  return (
    <>
      <ReactPlayer
        src={fifthElementVideos.swirl}
        playing={true}
        loop={true}
        muted={true}
        playsInline={true}
        controls={false}
        volume={0}
        width="100%"
        height="100%"
        className="absolute inset-0 object-cover"
      />
      <ReactPlayer
        src={fifthElementVideos.guy}
        playing={true}
        loop={true}
        muted={true}
        playsInline={true}
        controls={false}
        volume={0}
        width="100%"
        height="100%"
        onStart={handleGuyVideoStart}
        className={`absolute inset-0 object-cover transition-opacity duration-2000 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
      />
    </>
  )
}

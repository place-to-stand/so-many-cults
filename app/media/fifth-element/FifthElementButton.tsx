'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RiArrowLeftLine } from "react-icons/ri";
import { useGlitch } from 'react-powerglitch'
import { instagramUrl } from '../../data/links'

export default function FifthElementButton() {
  const [isFadingIn, setIsFadingIn] = useState(false);
  // useGlitch returns a callback ref intended to be passed straight to an element.
  const { ref: glitchRef } = useGlitch()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingIn(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);


  return (
    <Link
      className={`flex text-xl md:text-4xl font-bold uppercase bg-white text-black hover:no-underline! active:no-underline! py-2 px-4 items-center gap-2 transition-opacity duration-7000 ${isFadingIn ? 'opacity-100' : 'opacity-0'}`}
      href={instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      ref={glitchRef}
    >Become A Follower Here <RiArrowLeftLine /></Link>
  );
}

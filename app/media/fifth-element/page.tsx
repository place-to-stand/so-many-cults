import React from "react";
import FifthElementButton from "./FifthElementButton";
import FifthElementVideos from "./FifthElementVideos";


export default function FifthElement() {
  return (
    <div className="relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-dvh p-8 pb-20 gap-16 sm:p-20 font-(family-name:--font-geist-sans)">
      <main className="flex flex-col gap-[32px] row-start-2 items-center font-mono text-center">
        <FifthElementVideos />
        <FifthElementButton />
      </main>
    </div>
  );
}

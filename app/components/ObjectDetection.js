"use client";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load } from "@tensorflow-models/coco-ssd";
import { renderPredictions } from "../utils/predictions";

export default function ObjectDetection() {
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef();
  const webcam = useRef();

  let detectInterval;
  async function runObjectDetection(net) {
    if (webcam.current !== null && webcam.current.video?.readyState === 4) {
      canvasRef.current.width = webcam.current.video.videoWidth;
      canvasRef.current.height = webcam.current.video.videoHeight;
      const detectedObjects = await net.detect(
        webcam.current.video,
        undefined,
        0.6
      );
      console.log(detectedObjects);
      const context = canvasRef.current.getContext("2d");
      renderPredictions(detectedObjects, context);
    }
  }
  async function runCoco(params) {
    setIsLoading(true);
    const net = await load();
    setIsLoading(false);
    detectInterval = setInterval(() => {
      runObjectDetection(net);
    }, 1000);
  }

  const showmyVideo = () => {
    if (webcam.current !== null && webcam.current.video?.readyState === 4) {
      const myVideoWidth = webcam.current.video.videoWidth;
      const myVideoHeight = webcam.current.video.videoHeight;

      webcam.current.video.width = myVideoWidth;
      webcam.current.video.height = myVideoHeight;
    }
  };
  useEffect(() => {
    runCoco();
    showmyVideo();
    return () => clearInterval(detectInterval);
  }, []);

  return (
    <div>
      {isLoading ? (
        <h1>Loading.....</h1>
      ) : (
        <div className="relative mt-40 flex justify-center items-center gradient p-1.5 rounded-md">
          <Webcam
            ref={webcam}
            audio={false}
            height={720}
            screenshotFormat="image/jpeg"
            width={1280}
            className="rounded-md w-full  lg:h-[720px]"
          ></Webcam>
          <canvas
            className="absolute top-0 left-0 z-99999 w-full lg:h-[720px]"
            ref={canvasRef}
          ></canvas>
        </div>
      )}
    </div>
  );
}

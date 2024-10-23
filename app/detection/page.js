import React from "react";
import ObjectDetection from "../components/ObjectDetection";

export default function page() {
  return (
    <div className="flex justify-center p-10 flex-col items-center gap-4">
      <h1 className=" text-3xl lg:text-6xl font-bold">Object Detection</h1>
      <ObjectDetection />
    </div>
  );
}

// App.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./Model";

export default function App() {
  return (
    <div className="w-screen h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* Our 3D model */}
        <Model scale={1.5} />

        {/* Camera controls */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}

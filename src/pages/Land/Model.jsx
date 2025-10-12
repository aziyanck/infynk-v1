// Model.jsx
import React from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const { scene } = useGLTF("/card.glb"); // <-- your file in /public folder
  return <primitive object={scene} {...props} />;
}

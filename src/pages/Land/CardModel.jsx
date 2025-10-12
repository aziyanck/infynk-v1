import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Card() {
  const { scene } = useGLTF("/card.glb"); // 👈 put card.glb in /public folder
  return <primitive object={scene} scale={2} />;
}

export default function CardModel() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      {/* Model */}
      <Card />

      {/* Controls (rotate, zoom) */}
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
}

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, useFBX } from "@react-three/drei";
import Manny, { CHEERING, TYPING } from "./Manny";
import { Chair, Desk, Computer, Keyboard } from "./Objects";
import Screen from "./Screen";

function Scene(props) {
  return (
    <div className="three-container">
      <Canvas
        linear
        camera={{ zoom: 1, position: [0, 0.5, 1.5] }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.LinearToneMapping;
        }}
      >
        <Suspense fallback={null}>
          <Manny
            scale={0.01}
            position={[0, -1, -1]}
            animation={TYPING}
            rotation={[0, -Math.PI / 180, 0]}
            {...props}
          />
          <Chair
            position={[0, -0.84, -0.95]}
            scale={0.005}
            rotation={[0, Math.PI / 180, 0]}
          />
          <Desk
            position={[0.05, -1, -0.2]}
            scale={0.008}
            rotation={[0, Math.PI / 2, 0]}
          />
          <Computer
            position={[0, -0.35, -0.1]}
            scale={0.0006}
            rotation={[0, Math.PI, 0]}
          />
          <Screen
            scale={0.072}
            position={[0, -0.12, -0.11]}
            rotation={[0, Math.PI, 0]}
          />
          <Keyboard position={[0, -0.35, -0.3]} scale={0.0007} />
          <OrbitControls />
          <hemisphereLight
            skyColor={0xffffff}
            groundColor={0x444444}
            position={[0, 0, 0]}
          />
          <directionalLight
            color={0xffffff}
            intensity={0.25}
            castShadow
            position={[0, 200, 100]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useFBX.preload(CHEERING);
useFBX.preload(TYPING);

export default Scene;

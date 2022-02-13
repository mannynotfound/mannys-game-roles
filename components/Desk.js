import { useFBX } from "@react-three/drei";
import React, { Suspense } from "react";

const FBX = "/assets/desk-2.fbx";

const Model = ({ ...props }) => {
  const fbx = useFBX(FBX);
  fbx.traverse((obj) => {
    if (obj.isMesh) {
      obj.material.opacity = 1;
    }
  });

  return (
    <group {...props}>
      <Suspense fallback={() => null}>
        <primitive object={fbx} dispose={null} />
      </Suspense>
    </group>
  );
};

useFBX.preload(FBX);

export default Model;

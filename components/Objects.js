import { useFBX, useTexture } from "@react-three/drei";
import React, { Suspense } from "react";
import * as THREE from "three";

const CHAIR_FBX = "/assets/chair.fbx";
const COMPUTER_FBX = "/assets/computer.fbx";
const COMPUTER_TEXTURE = "/assets/Computer Texture.png";
const DESK_FBX = "/assets/desk-2.fbx";
const KEYBOARD_FBX = "/assets/keyboard.fbx";

const Model = ({ fbxObj, color, textureImage, ...props }) => {
  const fbx = useFBX(fbxObj);
  const texture = textureImage ? useTexture(textureImage) : null;

  fbx.traverse((obj) => {
    if (obj.isMesh) {
      obj.material.opacity = 1;
      if (color) {
        obj.material.color = new THREE.Color(color);
      }
      if (texture) {
        obj.material = new THREE.MeshPhongMaterial({
          map: texture,
        });
      }
      // hack to change chair colors
      if (obj.material.name === "mat11") {
        obj.material.color = new THREE.Color("grey");
      } else if (obj.material.name === "mat16") {
        obj.material.color = new THREE.Color("silver");
      }
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

useFBX.preload(CHAIR_FBX);
useFBX.preload(COMPUTER_FBX);
useFBX.preload(DESK_FBX);
useFBX.preload(KEYBOARD_FBX);

export const Chair = (props) => <Model fbxObj={CHAIR_FBX} {...props} />;
export const Desk = (props) => (
  <Model color="white" fbxObj={DESK_FBX} {...props} />
);
export const Computer = (props) => (
  <Model fbxObj={COMPUTER_FBX} textureImage={COMPUTER_TEXTURE} {...props} />
);
export const Keyboard = (props) => (
  <Model fbxObj={KEYBOARD_FBX} textureImage={COMPUTER_TEXTURE} {...props} />
);

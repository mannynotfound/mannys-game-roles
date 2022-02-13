import { useFBX, useTexture } from "@react-three/drei";
import React, { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import useAnimations from "../hooks/useAnimations";

export const MANNY_FBX = "https://d2tm2f4d5v0kas.cloudfront.net/Manny.fbx";

const MANNY_TEXTURE =
  "https://mannys-game.s3.us-east-1.amazonaws.com/textures-small/1.jpg";

const MANNY_CLIPS_HOST = "https://d2tm2f4d5v0kas.cloudfront.net/clips";

export const CHEERING = `${MANNY_CLIPS_HOST}/cheer.fbx`;
export const TYPING = `${MANNY_CLIPS_HOST}/typing.fbx`;

const Manny = ({ textureImage = MANNY_TEXTURE, animation, ...props }) => {
  const fbx = useFBX(MANNY_FBX);
  const texture = useTexture(textureImage);

  // The object needs to be cloned to allow multiple instances within the same canvas.
  const fbxClone = useMemo(() => {
    const _clone = SkeletonUtils.clone(fbx);

    // Grab the original texture to re-skin
    const ogMain = _clone.children.find(
      (child) => child.name === "DGSOH_45544_manuel_palou_01"
    );
    const ogMainMaterial = ogMain?.material;

    // Overwrite the texture in new MeshPhongMaterial
    ogMain.material = new THREE.MeshPhongMaterial({
      ...ogMainMaterial,
      skinning: true,
      morphTargets: true,
      map: texture,
    });

    // Do the same thing again with the eyes
    const ogEyes = _clone.children.find((child) => child.name === "Eyes");
    const ogEyesMaterial = ogEyes?.material;

    ogEyes.material = new THREE.MeshPhongMaterial({
      ...ogEyesMaterial,
      skinning: true,
      morphTargets: true,
      map: texture,
    });

    return _clone;
  }, [fbx, texture]);

  // Load animation if specified
  const { animations } = useFBX(animation || MANNY_FBX);
  const { actions, names } = useAnimations(
    animations,
    animation || "none",
    fbxClone
  );

  // Transition to new animation when loaded
  useEffect(() => {
    if (!animation || !names.length) return;
    actions[names[0]]?.reset().fadeIn(0.5).play();
    return () => void actions[names[0]]?.fadeOut(0.5);
  }, [animation, actions, names]);

  return (
    <group {...props}>
      <Suspense fallback={() => null}>
        <primitive object={fbxClone} dispose={null} />
      </Suspense>
    </group>
  );
};

useFBX.preload(MANNY_FBX);

export default Manny;

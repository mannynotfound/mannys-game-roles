import React, { useState, useEffect } from "react";

const Screen = (props) => {
  const [video] = useState(() => {
    const vid = document.createElement("video");
    vid.src = "/assets/matrixrain.mp4";
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.autoPlay = true;
    vid.muted = true;
    return vid;
  });

  useEffect(() => void video.play(), [video]);

  return (
    <mesh {...props}>
      <planeBufferGeometry attach="geometry" args={[7, 4]} />
      <meshBasicMaterial>
        <videoTexture attach="map" args={[video]} />
      </meshBasicMaterial>
    </mesh>
  );
};

export default Screen;

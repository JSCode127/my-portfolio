import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

type Props = {
  mode: "sphere" | "collect" | "explode";
};

export default function UniverseCanvas({ mode }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();

    scene.background = new THREE.Color("#05070d");

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    mount.appendChild(renderer.domElement);

    // =====================
    // POST PROCESS
    // =====================
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.6,
      0.7,
      0.15
    );
    composer.addPass(bloom);

    // =====================
    // PARTICLES
    // =====================
    const COUNT = 12000;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);

    const sphereTargets = new Float32Array(COUNT * 3);
    const spreadTargets = new Float32Array(COUNT * 3);

    const centerPositions =  new Float32Array(COUNT * 3);

    const sphereRadius = 3.6;

    function setSphere(i3: number) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      sphereTargets[i3] = sphereRadius * Math.sin(phi) * Math.cos(theta);
      sphereTargets[i3 + 1] = sphereRadius * Math.sin(phi) * Math.sin(theta);
      sphereTargets[i3 + 2] = sphereRadius * Math.cos(phi);
    }

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;

      setSphere(i3);

      spreadTargets[i3] = (Math.random() - 0.5) * 18;
      spreadTargets[i3 + 1] = (Math.random() - 0.5) * 12;
      spreadTargets[i3 + 2] = (Math.random() - 0.5) * 8;

      // 初期は「散り状態」
      positions[i3] = spreadTargets[i3];
      positions[i3 + 1] = spreadTargets[i3 + 1];
      positions[i3 + 2] = spreadTargets[i3 + 2];

      centerPositions[i3] =
        (Math.random() - 0.5) * 0.5;

      centerPositions[i3 + 1] =
        (Math.random() - 0.5) * 0.5;

      centerPositions[i3 + 2] =
        (Math.random() - 0.5) * 0.5;
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
      color: "#aaddff",
      size: 0.03,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // =====================
    // CAMERA CONTROL
    // =====================
    let rotX = 0;
    let rotY = 0;
    let velX = 0;
    let velY = 0;

    window.addEventListener("mousemove", (e) => {
      velY += (e.clientX - window.innerWidth / 2) * 0.000001;
      velX += (e.clientY - window.innerHeight / 2) * 0.000001;
    });

    const clock = new THREE.Clock();

    // =====================
    // ANIMATE
    // =====================
    function animate() {
      requestAnimationFrame(animate);

      const t = clock.getElapsedTime();

      velX *= 0.92;
      velY *= 0.92;

      rotX += velX;
      rotY += velY;

      // ★ ここが核心：常にtarget切り替え
      let targetArray = sphereTargets;
      let speed = 0.04;

      if (modeRef.current === "collect") {
        targetArray = centerPositions;
        speed = 0.12;
      }

      if (modeRef.current === "explode") {
        targetArray = spreadTargets;
        speed = 0.06;
      }

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;

        positions[i3] +=
          (targetArray[i3] - positions[i3]) * speed;

        positions[i3 + 1] +=
          (targetArray[i3 + 1] - positions[i3 + 1]) * speed;

        positions[i3 + 2] +=
          (targetArray[i3 + 2] - positions[i3 + 2]) * speed;

        positions[i3] += Math.sin(t * 0.5 + i3) * 0.0003;
        positions[i3 + 1] += Math.cos(t * 0.4 + i3) * 0.0003;
        positions[i3 + 2] += Math.sin(t * 0.3 + i3) * 0.0003;

        positions[i3] += Math.sin(t + i) * 0.0002;
        positions[i3 + 1] += Math.cos(t + i * 0.5) * 0.0002;
      }

      geometry.attributes.position.needsUpdate = true;

      const driftX = Math.sin(t * 0.2) * 0.05;
      const driftY = Math.cos(t * 0.15) * 0.05;

      points.rotation.y = rotY + driftY;
      points.rotation.x = rotX + driftX;

      camera.position.set(0, 0, 8);
      camera.lookAt(0, 0, 0);

      composer.render();
    }

    animate();

    // =====================
    // RESIZE
    // =====================
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
      }}
    />
  );
}
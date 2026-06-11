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
  const shapeRef = useRef(0);
  const lastShapeChangeRef = useRef(0);

  useEffect(() => {
    shapeRef.current = 0;
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

    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.inset = "0";

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
    const isLowEnd = navigator.hardwareConcurrency <= 4;

    const COUNT = isLowEnd ? 7000 : 14000;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);

    const sphereTargets = new Float32Array(COUNT * 3);
    const torusTargets = new Float32Array(COUNT * 3);
    const cubeTargets = new Float32Array(COUNT * 3);
    const galaxyTargets = new Float32Array(COUNT * 3);

    const saturnTargets = new Float32Array(COUNT * 3);
    const dnaTargets = new Float32Array(COUNT * 3);

    const spreadTargets = new Float32Array(COUNT * 3);
    const centerPositions =  new Float32Array(COUNT * 3);
    const sphereRadius = 3.6;
    //球体
    function createSphere(i3: number) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      sphereTargets[i3] = sphereRadius * Math.sin(phi) * Math.cos(theta);
      sphereTargets[i3 + 1] = sphereRadius * Math.sin(phi) * Math.sin(theta);
      sphereTargets[i3 + 2] = sphereRadius * Math.cos(phi);
    }
    //ドーナツ
    function createTorus(i3:number){

      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;

      const R = 3;
      const r = 1;

      torusTargets[i3] =
        (R + r * Math.cos(v)) * Math.cos(u);

      torusTargets[i3+1] =
        (R + r * Math.cos(v)) * Math.sin(u);

      torusTargets[i3+2] =
        r * Math.sin(v);
    }
    //立方体
    function createCube(i3: number) {
      const halfSize = 2;

      const face = Math.floor(Math.random() * 6);

      const u =
        (Math.random() - 0.5) *
        halfSize *
        2;

      const v =
        (Math.random() - 0.5) *
        halfSize *
        2;

      switch (face) {

        case 0: // +X
          cubeTargets[i3] = halfSize;
          cubeTargets[i3 + 1] = u;
          cubeTargets[i3 + 2] = v;
          break;

        case 1: // -X
          cubeTargets[i3] = -halfSize;
          cubeTargets[i3 + 1] = u;
          cubeTargets[i3 + 2] = v;
          break;

        case 2: // +Y
          cubeTargets[i3] = u;
          cubeTargets[i3 + 1] = halfSize;
          cubeTargets[i3 + 2] = v;
          break;

        case 3: // -Y
          cubeTargets[i3] = u;
          cubeTargets[i3 + 1] = -halfSize;
          cubeTargets[i3 + 2] = v;
          break;

        case 4: // +Z
          cubeTargets[i3] = u;
          cubeTargets[i3 + 1] = v;
          cubeTargets[i3 + 2] = halfSize;
          break;

        case 5: // -Z
          cubeTargets[i3] = u;
          cubeTargets[i3 + 1] = v;
          cubeTargets[i3 + 2] = -halfSize;
          break;
      }
    }
    //銀河
    function createGalaxy(i3:number){

      const arm =
        Math.floor(Math.random() * 4);

      const radius =
        Math.random() * 5;

      const angle =
        radius * 1.5 +
        arm * Math.PI / 2;

      galaxyTargets[i3] =
        Math.cos(angle) * radius;

      galaxyTargets[i3+1] =
        (Math.random() - 0.5) * 0.2;

      galaxyTargets[i3+2] =
        Math.sin(angle) * radius;
    }
    //土星
    function createSaturn(i3:number){

      if(Math.random() < 0.35){

        const theta =
          Math.random() * Math.PI * 2;

        const phi =
          Math.acos(2*Math.random()-1);

        saturnTargets[i3] =
          2 * Math.sin(phi) * Math.cos(theta);

        saturnTargets[i3+1] =
          2 * Math.sin(phi) * Math.sin(theta);

        saturnTargets[i3+2] =
          2 * Math.cos(phi);

      }else{

        const angle =
          Math.random() * Math.PI * 2;

        const radius =
          3.5 + Math.random() * 0.7;

        saturnTargets[i3] =
          Math.cos(angle) * radius;

        saturnTargets[i3+1] =
          (Math.random()-0.5) * 0.15;

        saturnTargets[i3+2] =
          Math.sin(angle) * radius;
      }
    }
    //DNA
    function createDNA(i3: number) {
      const h = (Math.random() - 0.5) * 14;
      const angle = h * 0.9;
      const radius = 2.5;

      const type = Math.random();

      const step = Math.round(h * 2) / 2;

      // =====================
      // 左側らせん
      // =====================
      if (type < 0.4) {
        dnaTargets[i3] = h;

        dnaTargets[i3 + 1] =
          Math.cos(angle) * radius;

        dnaTargets[i3 + 2] =
          Math.sin(angle) * radius;
      }

      // =====================
      // 右側らせん
      // =====================
      else if (type < 0.8) {
        dnaTargets[i3] = h;
        dnaTargets[i3 + 1] =
          Math.cos(angle + Math.PI) * radius;


        dnaTargets[i3 + 2] =
          Math.sin(angle + Math.PI) * radius;
      }

      // =====================
      // 横棒（DNA結合部）
      // =====================
      else {
        const x1 =
          Math.cos(angle) * radius;

        const z1 =
          Math.sin(angle) * radius;

        const x2 =
          Math.cos(angle + Math.PI) * radius;

        const z2 =
          Math.sin(angle + Math.PI) * radius;

        const t = Math.random();

        dnaTargets[i3] = step;
        
        dnaTargets[i3 + 1] =
          THREE.MathUtils.lerp(x1, x2, t);

        dnaTargets[i3 + 2] =
          THREE.MathUtils.lerp(z1, z2, t);
      }
    }

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;

      createSphere(i3);
      createTorus(i3);
      createSaturn(i3);
      createDNA(i3);
      createGalaxy(i3);
      createCube(i3);

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

    // =====================
    // ANIMATE
    // =====================
    function animate() {
      requestAnimationFrame(animate);

      const t = performance.now() * 0.001;

      velX *= 0.92;
      velY *= 0.92;

      rotX += velX;
      rotY += velY;

      // ★ ここが核心：常にtarget切り替え
      let targetArray = sphereTargets;
      let speed = 0.04;

      let shapeTarget = sphereTargets;

      switch(shapeRef.current){

        case 0:
          shapeTarget = sphereTargets;
          break;

        case 1:
          shapeTarget = torusTargets;
          break;

        case 2:
          shapeTarget = saturnTargets;
          break;

        case 3:
          shapeTarget = dnaTargets;
          break;

        case 4:
          shapeTarget = galaxyTargets;
          break;

        case 5:
          shapeTarget = cubeTargets;
          break;
      }

      if(modeRef.current === "sphere"){
        targetArray = shapeTarget;
      }

      if (modeRef.current === "collect") {
        targetArray = centerPositions;
        speed = 0.12;
      }

      if (modeRef.current === "explode") {
        targetArray = spreadTargets;
        speed = 0.06;
      }

      if (
        t - lastShapeChangeRef.current > 8
      ) {
        shapeRef.current =
          (shapeRef.current + 1) % 6;

        lastShapeChangeRef.current = t;

        console.log(
          "auto shape",
          shapeRef.current
        );
      }

      if (shapeRef.current === 2) {
        points.rotation.y += 0.006;
      } else {
        points.rotation.y += 0.001;
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
      }

      geometry.attributes.position.needsUpdate = true;

      const driftX = Math.sin(t * 0.2) * 0.05;
      const driftY = Math.cos(t * 0.15) * 0.05;

      points.rotation.y = rotY + driftY;
      points.rotation.x = rotX + driftX;

      camera.lookAt(0, 0, 0);

      composer.render();
    }

    animate();

    // =====================
    // RESIZE
    // =====================
    const onResize = () => {
      
      const width = window.innerWidth;

      camera.aspect =
        width / window.innerHeight;

      camera.updateProjectionMatrix();

      if (width < 768) {
        camera.position.z = 14;
      } else if (width < 1024) {
        camera.position.z = 10;
      } else {
        camera.position.z = 8;
      }

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );

      composer.setSize(
        window.innerWidth,
        window.innerHeight
      );
    };

    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const handleClick = () => {
      shapeRef.current =
        (shapeRef.current + 1) % 6;

      lastShapeChangeRef.current =
        performance.now() * 0.001;
    };

    window.addEventListener(
      "pointerdown",
      handleClick
    );

    return () => {
      window.removeEventListener(
        "pointerdown",
        handleClick
      );
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    />
  );
}
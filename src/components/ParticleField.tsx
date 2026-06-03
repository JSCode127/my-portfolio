import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  hoverPos: {
    x: number;
    y: number | null;
  };
};

const ParticleField = ({ hoverPos }: Props) => {

  const mountRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef({ x: 0, y: null as number | null });

  useEffect(() => {
    hoverRef.current = hoverPos;
    }, [hoverPos]);

  useEffect(() => {

    const mount = mountRef.current!;

    // =====================================
    // Scene
    // =====================================
    const scene = new THREE.Scene();

    // =====================================
    // Camera
    // =====================================
    const camera =
      new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

    camera.position.z = 8;

    // =====================================
    // Renderer
    // =====================================
    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    mount.appendChild(renderer.domElement);

    // =====================================
    // Mouse
    // =====================================
    const mouse = new THREE.Vector2(999, 999);

    window.addEventListener(
      "mousemove",
      (e) => {

        mouse.x =
          (e.clientX / window.innerWidth) * 2 - 1;

        mouse.y =
          -(e.clientY / window.innerHeight) * 2 + 1;
      }
    );

    // =====================================
    // Particle Count
    // =====================================
    const COUNT = 4000;

    const sizes = new Float32Array(COUNT);

    // =====================================
    // Geometry
    // =====================================
    const geometry =
      new THREE.BufferGeometry();

    const positions =
      new Float32Array(COUNT * 3);

    const velocities =
      new Float32Array(COUNT * 3);

    // 初期位置保存
    const origins =
      new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {

      const i3 = i * 3;

      const x =
        (Math.random() - 0.5) * 15;

      const y =
        (Math.random() - 0.5) * 10;

      const z =
        (Math.random() - 0.5) * 2;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      origins[i3] = x;
      origins[i3 + 1] = y;
      origins[i3 + 2] = z;

      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;

      sizes[i] = 1.0;
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions,
        3
      )
    );

    geometry.setAttribute(
    "aSize",
    new THREE.BufferAttribute(sizes, 1)
    );

    const material = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,

  uniforms: {},

  vertexShader: `
    attribute float aSize;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = aSize * 2.0;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  fragmentShader: `
    void main() {
      float d = length(gl_PointCoord - vec2(0.5));
      float alpha = 1.0 - smoothstep(0.4, 0.5, d);
      gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
    }
  `,
});

    // =====================================
    // Points
    // =====================================
    const points =
      new THREE.Points(
        geometry,
        material
      );

    scene.add(points);

    // =====================================
    // Raycaster
    // =====================================
    const raycaster =
      new THREE.Raycaster();

    const plane =
      new THREE.Plane(
        new THREE.Vector3(0, 0, 1),
        0
      );

    const mouse3D =
      new THREE.Vector3();

    // =====================================
    // Clock
    // =====================================
    const clock =
      new THREE.Clock();

    // =====================================
    // Animate
    // =====================================
    const animate = () => {

      const elapsed =
        clock.getElapsedTime();

      raycaster.setFromCamera(
        mouse,
        camera
      );

      raycaster.ray.intersectPlane(
        plane,
        mouse3D
      );

      for (let i = 0; i < COUNT; i++) {

  const i3 = i * 3;

  const x = positions[i3];
  const y = positions[i3 + 1];

  let vx = velocities[i3];
  let vy = velocities[i3 + 1];

  // =====================================
  // ① MOUSE FORCE
  // =====================================
  const dx = mouse3D.x - x;
  const dy = mouse3D.y - y;

  const dist = Math.sqrt(dx * dx + dy * dy);
  const radius = 2.5;

  if (dist < radius) {

    const force = 1.0 - dist / radius;
    const angle = Math.atan2(dy, dx);

    vx += Math.cos(angle) * force * 0.02;
    vy += Math.sin(angle) * force * 0.02;

    vx += Math.sin(elapsed + dist) * 0.002;
    vy += Math.cos(elapsed + dist) * 0.002;
  }

  // =====================================
  // ② LINK HOVER FORCE（追加しやすい形）
  // =====================================
  if (hoverRef.current.y !== null) {

  const lx = hoverRef.current.x;
  const ly = hoverRef.current.y;

  const ldx = lx - x;
  const ldy = ly - y;

  const ldist = Math.sqrt(ldx * ldx + ldy * ldy);
  const linkRadius = 2.0;

  if (ldist < linkRadius) {

    const f = 1.0 - ldist / linkRadius;

    vx += ldx * f * 0.03;
    vy += ldy * f * 0.03;

    vx += -ldy * f * 0.005;
    vy +=  ldx * f * 0.005;
  }
}

  // =====================================
  // ③ ORIGIN RETURN
  // =====================================
  const ox = origins[i3];
  const oy = origins[i3 + 1];

  vx += (ox - x) * 0.002;
  vy += (oy - y) * 0.002;

  // =====================================
  // ④ DAMPING
  // =====================================
  vx *= 0.95;
  vy *= 0.95;

  velocities[i3] = vx;
  velocities[i3 + 1] = vy;

  // =====================================
  // ⑤ POSITION UPDATE
  // =====================================
  positions[i3] += vx;
  positions[i3 + 1] += vy;

  // =====================================
  // ⑥ Z WOBBLE
  // =====================================
  positions[i3 + 2] =
    Math.sin(elapsed + i * 0.01) * 0.15;
}
      const posAttr = geometry.attributes.position;
if (posAttr) posAttr.needsUpdate = true;

const sizeAttr = geometry.attributes.aSize;
if (sizeAttr) sizeAttr.needsUpdate = true;

      renderer.render(
        scene,
        camera
      );

      requestAnimationFrame(
        animate
      );
    };

    animate();

    // =====================================
    // Resize
    // =====================================
    const handleResize = () => {

      camera.aspect =
        window.innerWidth /
        window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    // =====================================
    // Cleanup
    // =====================================
    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

      geometry.dispose();
      material.dispose();

      mount.removeChild(
        renderer.domElement
      );
    };

  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        background:
          "linear-gradient(to bottom, #134a80, #ebebeb)",
      }}
    />
  );
};

export default ParticleField;
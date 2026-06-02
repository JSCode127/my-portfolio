import { useEffect, useRef } from "react";
import * as THREE from "three";

const ParticleField = () => {
  const mountRef = useRef<HTMLDivElement>(null);

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
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions,
        3
      )
    );

    // =====================================
    // Material
    // =====================================
    const material =
        new THREE.PointsMaterial({
            color: "#ffffff",
            size: 0.04,
            sizeAttenuation: false,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
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

        const x =
          positions[i3];

        const y =
          positions[i3 + 1];

        // ================================
        // Mouse Attraction
        // ================================
        const dx =
          mouse3D.x - x;

        const dy =
          mouse3D.y - y;

        const dist =
          Math.sqrt(dx * dx + dy * dy);

        // 影響範囲
        const radius = 2.5;

        if (dist < radius) {

          const force =
            (1.0 - dist / radius);

          const angle =
            Math.atan2(dy, dx);

          // 引き寄せ
          velocities[i3] +=
            Math.cos(angle)
            * force
            * 0.02;

          velocities[i3 + 1] +=
            Math.sin(angle)
            * force
            * 0.02;

          // 回転感
          velocities[i3] +=
            Math.sin(elapsed + dist)
            * 0.002;

          velocities[i3 + 1] +=
            Math.cos(elapsed + dist)
            * 0.002;
        }

        // ================================
        // 元位置へ戻る力
        // ================================
        const ox =
          origins[i3];

        const oy =
          origins[i3 + 1];

        velocities[i3] +=
          (ox - x) * 0.002;

        velocities[i3 + 1] +=
          (oy - y) * 0.002;

        // ================================
        // 減衰
        // ================================
        velocities[i3] *= 0.95;
        velocities[i3 + 1] *= 0.95;

        // ================================
        // 位置更新
        // ================================
        positions[i3] +=
          velocities[i3];

        positions[i3 + 1] +=
          velocities[i3 + 1];

        // ================================
        // 微揺れ
        // ================================
        positions[i3 + 2] =
          Math.sin(
            elapsed
            + i * 0.01
          ) * 0.15;
      }

      geometry.attributes.position.needsUpdate = true;

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
import { useEffect, useRef } from "react";
import * as THREE from "three";

const WaterShader = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;

    // =========================================
    // Scene
    // =========================================
    const scene = new THREE.Scene();

    // =========================================
    // Camera
    // =========================================
    const camera = new THREE.OrthographicCamera(
      -1,
      1,
      1,
      -1,
      0.1,
      10
    );

    camera.position.z = 1;

    // =========================================
    // Renderer
    // =========================================
    const renderer = new THREE.WebGLRenderer({
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

    // =========================================
    // Ripple Data
    // =========================================
    const maxRipples = 60;

    const ripples: THREE.Vector4[] = [];

    const mouse = new THREE.Vector2(0.5, 0.5);

    const prevMouse = new THREE.Vector2(0.5, 0.5);

    // =========================================
    // Mouse
    // =========================================
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;

      mouse.set(x, y);

      const dist = mouse.distanceTo(prevMouse);

      // 少しでも動いたら生成
      if (dist > 0.002) {
        for (let i = 0; i < 3; i++) {
          ripples.push(
            new THREE.Vector4(
              x + (Math.random() - 0.5) * 0.01,
              y + (Math.random() - 0.5) * 0.01,
              0,
              1
            )
          );
        }

        if (ripples.length > maxRipples) {
          ripples.shift();
        }

        prevMouse.copy(mouse);
      }
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    // =========================================
    // Texture
    // =========================================
    const textureLoader =
      new THREE.TextureLoader();

    const texture =
      textureLoader.load("/bg.jpg");

    texture.wrapS =
      THREE.ClampToEdgeWrapping;

    texture.wrapT =
      THREE.ClampToEdgeWrapping;

    // =========================================
    // Ripple Uniform
    // =========================================
    const createRippleArray = () => {
      const arr = [];

      for (let i = 0; i < maxRipples; i++) {
        arr.push(
          new THREE.Vector4(
            0,
            0,
            -10,
            0
          )
        );
      }

      return arr;
    };

    // =========================================
    // Shader
    // =========================================
    const material =
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uTexture: { value: texture },
          uRipples: {
            value: createRippleArray(),
          },
          uMouse: {
            value: mouse,
          },
        },

        vertexShader: `
          varying vec2 vUv;

          void main() {
            vUv = uv;

            gl_Position =
              vec4(position, 1.0);
          }
        `,

        fragmentShader: `
          uniform float uTime;
          uniform sampler2D uTexture;
          uniform vec4 uRipples[60];
          uniform vec2 uMouse;

          varying vec2 vUv;

          // =====================================
          // Noise
          // =====================================
          float random(vec2 st) {
            return fract(
              sin(
                dot(
                  st.xy,
                  vec2(12.9898,78.233)
                )
              ) * 43758.5453123
            );
          }

          void main() {

            vec2 uv = vUv;

            float ripple = 0.0;

            // =====================================
            // Persistent Mouse Field
            // =====================================
            float mouseDist =
              distance(
                uv,
                uMouse
              );

            ripple +=
              sin(
                mouseDist * 45.0
                - uTime * 4.0
              )
              *
              smoothstep(
                0.5,
                0.0,
                mouseDist
              )
              *
              0.12;

            // =====================================
            // Ripple Trails
            // =====================================
            for (int i = 0; i < 60; i++) {

              vec4 r = uRipples[i];

              float dist =
                distance(
                  uv,
                  r.xy
                );

              float d =
                dist - r.z;

              float wave =
                sin(
                  d * 35.0
                  - uTime * 3.0
                );

              wave =
                wave * 0.5 + 0.5;

              wave =
                smoothstep(
                  0.45,
                  1.0,
                  wave
                );

              float ring =
                smoothstep(
                  0.04,
                  0.0,
                  abs(d)
                );

              float decay =
                exp(
                  -1.2 * r.z
                );

              ripple +=
                wave
                * ring
                * decay
                * 0.25;
            }

            // =====================================
            // Ambient Flow
            // =====================================
            float flow =
              sin(
                uv.x * 6.0
                + uTime * 0.5
              )
              *
              sin(
                uv.y * 4.0
                + uTime * 0.4
              );

            ripple += flow * 0.015;

            // =====================================
            // Distortion
            // =====================================
            vec2 center =
              uv - 0.5;

            float len =
              length(center)
              + 0.001;

            vec2 distortion =
              ripple
              * 0.03
              * normalize(center);

            // =====================================
            // Glass Refraction
            // =====================================
            vec2 distortedUV =
              clamp(
                uv + distortion,
                0.0,
                1.0
              );

            vec3 color =
              texture2D(
                uTexture,
                distortedUV
              ).rgb;

            // =====================================
            // Water Tint
            // =====================================
            color *= vec3(
              0.85,
              0.95,
              1.05
            );

            // =====================================
            // Highlight
            // =====================================
            float highlight =
              pow(
                1.0 - abs(ripple),
                4.0
              );

            color +=
              highlight * 0.04;

            // =====================================
            // Shimmer
            // =====================================
            float shimmer =
              sin(
                (uv.x + uv.y)
                * 20.0
                + uTime
              ) * 0.01;

            color += shimmer;

            // =====================================
            // Glass Reflection
            // =====================================
            color +=
              0.02
              /
              (
                abs(ripple)
                + 0.3
              );

            // =====================================
            // Clamp
            // =====================================
            color =
              clamp(
                color,
                0.0,
                1.0
              );

            gl_FragColor =
              vec4(color, 1.0);
          }
        `,
      });

    // =========================================
    // Plane
    // =========================================
    const geometry =
      new THREE.PlaneGeometry(2, 2);

    const mesh =
      new THREE.Mesh(
        geometry,
        material
      );

    scene.add(mesh);

    // =========================================
    // Clock
    // =========================================
    const clock = new THREE.Clock();

    // =========================================
    // Update Uniform
    // =========================================
    const updateRippleUniform = () => {
      const arr = [];

      for (let i = 0; i < maxRipples; i++) {
        if (i < ripples.length) {
          arr.push(ripples[i]);
        } else {
          arr.push(
            new THREE.Vector4(
              0,
              0,
              -10,
              0
            )
          );
        }
      }

      material.uniforms.uRipples.value =
        arr;
    };

    // =========================================
    // Animation
    // =========================================
    const animate = () => {

      material.uniforms.uTime.value =
        clock.getElapsedTime();

      material.uniforms.uMouse.value =
        mouse;

      // Ripple Update
      for (
        let i = ripples.length - 1;
        i >= 0;
        i--
      ) {
        ripples[i].z += 0.01;

        if (ripples[i].z > 2.5) {
          ripples.splice(i, 1);
        }
      }

      updateRippleUniform();

      renderer.render(
        scene,
        camera
      );

      requestAnimationFrame(animate);
    };

    animate();

    // =========================================
    // Resize
    // =========================================
    const handleResize = () => {
      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    // =========================================
    // Cleanup
    // =========================================
    return () => {

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      geometry.dispose();
      material.dispose();
      texture.dispose();

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
      }}
    />
  );
};

export default WaterShader;
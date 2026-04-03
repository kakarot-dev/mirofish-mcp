import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './HeroParticles.module.css';

const PARTICLE_COUNT = 600;
const CYCLE = 10;

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 30;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const origins = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 8 + Math.random() * 14;
      positions[i3] = origins[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = origins[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = origins[i3 + 2] = r * Math.cos(phi);
      sizes[i] = 1.5 + Math.random() * 2.5;
      phases[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        varying float vAlpha;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (20.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          vAlpha = 0.4 + 0.6 * (size / 4.0);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = vAlpha * smoothstep(0.5, 0.1, d);
          gl_FragColor = vec4(0.133, 0.827, 0.933, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0,
    });
    const glowSphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), glowMat);
    scene.add(glowSphere);

    let time = 0;
    let animationId: number;

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    function animate() {
      animationId = requestAnimationFrame(animate);
      time += 0.008;

      const cycleT = (time % CYCLE) / CYCLE;
      let convergence = 0;
      if (cycleT < 0.4) {
        convergence = 0;
      } else if (cycleT < 0.7) {
        convergence = (cycleT - 0.4) / 0.3;
        convergence = convergence * convergence * (3 - 2 * convergence);
      } else if (cycleT < 0.85) {
        convergence = 1;
      } else {
        convergence = 1 - (cycleT - 0.85) / 0.15;
        convergence = convergence * convergence * (3 - 2 * convergence);
      }

      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const phase = phases[i];
        const driftX = Math.sin(time * 0.3 + phase) * 0.5;
        const driftY = Math.cos(time * 0.2 + phase * 1.3) * 0.5;
        const driftZ = Math.sin(time * 0.15 + phase * 0.7) * 0.3;

        const ox = origins[i3] + driftX;
        const oy = origins[i3 + 1] + driftY;
        const oz = origins[i3 + 2] + driftZ;

        pos[i3] = ox * (1 - convergence);
        pos[i3 + 1] = oy * (1 - convergence);
        pos[i3 + 2] = oz * (1 - convergence);
      }
      geometry.attributes.position.needsUpdate = true;

      glowMat.opacity = convergence * 0.6;
      glowSphere.scale.setScalar(1 + convergence * 3);

      points.rotation.y = time * 0.05;
      points.rotation.x = Math.sin(time * 0.03) * 0.1;

      renderer.render(scene, camera);
    }

    resize();
    animate();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      glowMat.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}

import { useCallback, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

const particleOptions: ISourceOptions = {
  fullScreen: { enable: false },
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "grab" },
    },
    modes: {
      grab: { distance: 140, links: { opacity: 0.3 } },
    },
  },
  particles: {
    color: { value: "#3B82F6" },
    links: {
      color: "#3B82F6",
      distance: 150,
      enable: true,
      opacity: 0.12,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.6,
      direction: "none",
      outModes: { default: "out" },
    },
    number: {
      density: { enable: true },
      value: 60,
    },
    opacity: { value: 0.35 },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 2.5 } },
  },
  detectRetina: true,
};

const ParticleBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const particlesLoaded = useCallback(async () => {}, []);

  if (!init) return null;

  return (
    <div className="fixed inset-0 z-0">
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={particleOptions}
        className="h-full w-full"
      />
    </div>
  );
};

export default ParticleBackground;

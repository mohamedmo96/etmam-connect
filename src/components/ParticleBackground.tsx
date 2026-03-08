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
      onHover: { enable: true, mode: "repulse" },
    },
    modes: {
      repulse: { distance: 100, duration: 0.4, speed: 0.5 },
    },
  },
  particles: {
    color: { value: ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"] },
    links: {
      enable: false,
    },
    move: {
      enable: true,
      speed: 0.3,
      direction: "top",
      outModes: { default: "out", top: "out", bottom: "out" },
      random: true,
      straight: false,
      drift: 0.5,
    },
    number: {
      density: { enable: true },
      value: 80,
    },
    opacity: {
      value: { min: 0.05, max: 0.35 },
      animation: {
        enable: true,
        speed: 0.3,
        startValue: "random",
        sync: false,
        destroy: "none",
      },
    },
    shape: { type: "circle" },
    size: {
      value: { min: 1, max: 4 },
      animation: {
        enable: true,
        speed: 0.8,
        startValue: "random",
        sync: false,
      },
    },
    shadow: {
      blur: 8,
      color: { value: "#3B82F6" },
      enable: true,
      offset: { x: 0, y: 0 },
    },
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
      {/* Deep ambient glows */}
      <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[150px]" />
      <div className="absolute -right-40 top-2/3 h-[400px] w-[400px] rounded-full bg-primary/[0.06] blur-[130px]" />
      <div className="absolute left-1/3 -bottom-20 h-[350px] w-[350px] rounded-full bg-primary/[0.03] blur-[120px]" />
      
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

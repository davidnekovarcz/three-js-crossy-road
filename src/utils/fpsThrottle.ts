import { FRAME_INTERVAL } from '@/utils/constants';

let lastFrame = 0;

/**
 * Throttles the rendering of a Three.js WebGL renderer to maintain target FPS
 * @param {Object} context - The Three.js context object containing the gl renderer
 */
export function throttleRender({ gl }) {
  const origRender = gl.render.bind(gl);
  gl.render = (...args) => {
    const now = performance.now();
    if (now - lastFrame < FRAME_INTERVAL) return;
    lastFrame = now;
    origRender(...args);
  };
}

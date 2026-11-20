/**
 * Tiny event bus for the animated neuron background. Screens call
 * `neural.burst()` when something worth celebrating happens (a pack added, a
 * card saved, a right answer); the background lights up a wave of neurons.
 * On platforms without the animated background this is a no-op.
 */
export type NeuralBurst = {
  /** Viewport coordinates; defaults to the upper middle of the screen. */
  x?: number;
  y?: number;
  /** 0.5 = small spark, 1 = normal, 1.5 = big celebration. */
  strength?: number;
};

type Listener = (burst: NeuralBurst) => void;

const listeners = new Set<Listener>();

export const neural = {
  burst(burst: NeuralBurst = {}) {
    for (const listener of listeners) listener(burst);
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

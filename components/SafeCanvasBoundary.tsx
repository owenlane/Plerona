'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Rendered if a child throws. Defaults to nothing (the layer behind shows). */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches any render/runtime error thrown by its children (e.g. WebGL/Three.js
 * failing to initialize on mobile Safari) and renders a fallback instead of
 * letting the exception crash the whole React tree.
 */
export default class SafeCanvasBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Non-fatal: the static hero remains. Logged for observability only.
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('Hero 3D background disabled after error:', error);
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

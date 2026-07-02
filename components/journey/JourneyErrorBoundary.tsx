'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Invoked when a child throws — used to force Focused Mode, which removes
   *  the 3D-mode code paths, then the boundary re-renders its children. */
  onRecover: () => void;
}

interface State {
  recovering: boolean;
}

/**
 * Journey resilience boundary. The Constitution makes Focused Mode the
 * guaranteed complete experience (Part III, Art. 10). If ANY client exception
 * occurs while the Journey renders — most importantly in the 3D-mode DOM
 * paths — this boundary catches it, forces Focused Mode (which strips those
 * paths and the canvas), and re-renders the same content in its 2D form
 * instead of surfacing a blank "Application error" screen.
 */
export default class JourneyErrorBoundary extends Component<Props, State> {
  state: State = { recovering: false };

  static getDerivedStateFromError(): State {
    return { recovering: true };
  }

  componentDidCatch(error: unknown) {
    // Switch to Focused Mode, then clear the error so children re-render.
    this.props.onRecover();
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('Journey recovered into Focused Mode after error:', error);
    }
    this.setState({ recovering: false });
  }

  render() {
    // Even mid-recovery we render children; they now render in Focused Mode.
    return this.props.children;
  }
}

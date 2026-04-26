// Base class for bubble primitives. Concrete primitives extend or use BubbleStub helpers.
//
// Design decision: the Bubble interface is the same regardless of host role
// (nucleus / organelle / standalone). Hosts enforce role; primitives don't fork.

import type {
  Bubble,
  BubbleCtx,
  BubbleEvent,
  BubbleInstance,
  BubblePrimitiveType,
  ResizeState,
  SizeKey,
} from '../../types';

export abstract class BubbleBase<P = unknown> implements Bubble<P> {
  readonly id: string;
  readonly type: BubblePrimitiveType;
  protected host: HTMLElement | null = null;
  protected ctx: BubbleCtx<P> | null = null;
  protected currentSize: SizeKey = 'm';

  constructor(instance: BubbleInstance) {
    this.id = instance.id;
    this.type = instance.type;
    this.currentSize = instance.resize.initial;
  }

  mount(host: HTMLElement, ctx: BubbleCtx<P>): void {
    this.host = host;
    this.ctx = ctx;
    this.render();
  }

  unmount(): void {
    if (this.host) {
      this.host.innerHTML = '';
      this.host = null;
    }
    this.ctx = null;
  }

  applyResize(size: SizeKey, _state: ResizeState): void {
    this.currentSize = size;
    this.render();
  }

  onSearch?(query: string): void;
  onAttach?(target: { cellId: string; slot: 'organelle' | 'nucleus' }): void;
  onDetach?(): void;

  serialize(): BubbleInstance {
    if (!this.ctx) throw new Error(`bubble ${this.id} not mounted`);
    return this.ctx.instance;
  }

  protected emit(event: BubbleEvent): void {
    this.ctx?.emit(event);
  }

  /**
   * Concrete primitives implement this. The Phase 0 stub default just renders the type label.
   */
  protected abstract render(): void;
}

/**
 * Quick-and-dirty stub primitive. Used in Phase 0 to render every primitive type as a labeled box
 * so layout work is unblocked while real implementations are filled in.
 */
export class StubBubble<P = unknown> extends BubbleBase<P> {
  protected render(): void {
    if (!this.host || !this.ctx) return;
    const inst = this.ctx.instance;
    this.host.innerHTML = '';
    const chrome = document.createElement('div');
    chrome.className = 'bubble__chrome';
    chrome.innerHTML = `<span class="bubble__title">${escapeHtml(inst.title)}</span><span>${inst.type}</span>`;
    const body = document.createElement('div');
    body.className = 'bubble__body';
    body.innerHTML = `<small style="color: var(--ink-faint)">${inst.type} · size ${this.currentSize}</small>`;
    this.host.appendChild(chrome);
    this.host.appendChild(body);
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

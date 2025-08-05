/**
 * Local state store for the Meridian SDK.
 * Provides a simple reactive state container for UI bindings.
 * @module store
 */

type Subscriber<T> = (state: T) => void;

export interface MeridianState {
  currentUserId: string | null;
  activeChannelId: string | null;
  channels: Record<string, import('./types').MeridianChannel>;
  messages: Record<string, import('./types').MeridianMessage[]>;
  users: Record<string, import('./types').MeridianUser>;
}

export const initialState: MeridianState = {
  currentUserId: null,
  activeChannelId: null,
  channels: {},
  messages: {},
  users: {},
};

export class StateStore {
  private state: MeridianState;
  private subscribers = new Set<Subscriber<MeridianState>>();

  constructor(initial: Partial<MeridianState> = {}) {
    this.state = { ...initialState, ...initial };
  }

  /** Get the current state snapshot. */
  getState(): Readonly<MeridianState> {
    return this.state;
  }

  /** Update the state with a partial update and notify all subscribers. */
  setState(partial: Partial<MeridianState>): void {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  /** Subscribe to state changes. Returns an unsubscribe function. */
  subscribe(subscriber: Subscriber<MeridianState>): () => void {
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }

  /** Select a specific slice of state using a selector function. */
  select<R>(selector: (state: MeridianState) => R): R {
    return selector(this.state);
  }

  /** Reset the store to its initial state. */
  reset(): void {
    this.state = { ...initialState };
    this.notify();
  }

  private notify(): void {
    this.subscribers.forEach((sub) => sub(this.state));
  }
}

















































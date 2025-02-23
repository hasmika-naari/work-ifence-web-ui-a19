import { Inject, Injectable, InjectionToken, Optional, Provider, Signal, ValueEqualityFn, computed, signal } from '@angular/core';

const SIGNAL_STORE_ID = new InjectionToken('SIGNAL_STORE_ID');
const SIGNAL_STORE_CONFIG = new InjectionToken('SIGNAL_STORE_CONFIG');

interface SignalStoreConfig<T> {
  initState?: Partial<T>;
  equal?: ValueEqualityFn<T>
}

export function InitializeStore<T>(
  storeId: string, 
  config?: Partial<SignalStoreConfig<T>>
): Provider[] {
    return [
      {
        provide: SignalStore<T>,
        useFactory: () => new SignalStore<T>(storeId, config as SignalStoreConfig<T>)
      }
    ]
  }

  @Injectable()
  export class SignalStore<T> {
    readonly state: any;
  
    constructor(
      @Optional() @Inject(SIGNAL_STORE_ID) private readonly storeId?: string,
      @Optional() @Inject(SIGNAL_STORE_CONFIG) private config?: SignalStoreConfig<T>
    ) {
      this.config = Object.assign(this.config ?? {}, { storeId: this.storeId });
  
      // Initialize `state` after `config` is assigned
      this.state = signal<T>(this.config?.initState as T);
    }
  
    set(state: T) {
      this.state.set(state);
    }
  
    setKey<K extends keyof T>(key: K, value: any) {
      this.state.mutate((s: any) => (s?.[key] ? s[key] = value : null, s));
    }
  
    mutate(mutator: (state: T) => void) {
      this.state.mutate(mutator);
    }
  
    update(updater: (state: T) => T) {
      this.state.update(updater);
    }
  
    reset() {
      this.state.set(this.config?.initState as T);
    }
  
    select<U>(selector: (state: T) => U) {
      return computed(() => selector(this.state()))
    }
  
    selectFrom<T, U>(signal: Signal<T>, selector: (state: T) => U) {
      return computed(() => selector(signal()));
    }
  }


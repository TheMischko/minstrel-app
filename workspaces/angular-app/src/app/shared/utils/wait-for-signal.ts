import { effect, Injector, runInInjectionContext, Signal } from "@angular/core";

export function waitForSignal<T>(
  signal: Signal<T>,
  injector: Injector,
  predicate: (value: T) => boolean,
): Promise<T> {
  return new Promise((resolve) => {
    runInInjectionContext(injector, () => {
      const effectRef = effect(() => {
        const value = signal();
        if (predicate(value)) {
          effectRef.destroy();
          resolve(value);
        }
      });
    });
  });
}

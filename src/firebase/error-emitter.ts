// A simple, client-safe event emitter to broadcast Firebase errors.

type Listener = (error: Error) => void;

class ErrorEmitter {
  private listeners: Listener[] = [];

  on(event: 'permission-error', listener: Listener) {
    if (event === 'permission-error') {
      this.listeners.push(listener);
    }
  }

  emit(event: 'permission-error', error: Error) {
    if (event === 'permission-error') {
      this.listeners.forEach((listener) => listener(error));
    }
  }

  off(listener: Listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
}

export const errorEmitter = new ErrorEmitter();

// static class that encapsulates shorthands and utilities for emitting events.

export class EventHelpers {
  private static defaultEventOptions = {
    composed: true,
    bubbles: true,
  };

  // returns event object with default options applied, overridden
  // and extended by additional options the caller passes
  public static createEvent(eventName: string, options = {}) {
    return new CustomEvent(eventName, {
      ...EventHelpers.defaultEventOptions,
      ...options,
    });
  }
}

import "@testing-library/jest-dom"

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Attach mock to global object
global.ResizeObserver = ResizeObserver;

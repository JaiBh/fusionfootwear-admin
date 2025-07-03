import "@testing-library/jest-dom";
import { useSearchParams } from "next/navigation";

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  // Patch `hasPointerCapture` so Radix UI doesn't crash
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
});

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useParams: () => ({
    productId: "test-product-id",
  }),
  useSearchParams: () => ({
    get: jest.fn((key: string): string | null => {
      const params: Record<string, string> = {
        productId: "test-product-id",
      };
      return params[key];
    }),
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

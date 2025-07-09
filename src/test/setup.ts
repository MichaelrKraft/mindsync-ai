import '@testing-library/jest-dom'

// Mock framer-motion to avoid issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    p: 'p',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    button: 'button',
    input: 'input',
    form: 'form',
    section: 'section',
    nav: 'nav',
    aside: 'aside',
    main: 'main',
    header: 'header',
    footer: 'footer',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useMotionValue: () => ({ get: () => 0, set: () => {} }),
  useTransform: () => 0,
  useSpring: () => 0,
  useAnimate: () => [{ current: null }, () => {}],
  stagger: (delay: number) => delay,
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))
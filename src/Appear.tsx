import React from 'react';
import { injectComponents } from './Layout';

export const StepCtx = React.createContext(0);

export const ScrollCtx = React.createContext<(target: number) => void>(
  () => {}
);

export const useStep = () => React.useContext(StepCtx);

type StepsConfig =
  | number
  | { step: number }
  | { steps: Array<number> }
  | { start: number }
  | { end: number }
  | { start: number; end: number };

export interface AppearProps {
  step?: StepsConfig;
}

export const Appear: React.FC<AppearProps> = ({ step = 0, children }) => {
  const currentStep = useStep();
  const visible = resolveStepsConfig(step, currentStep);
  const scrollTo = React.useContext(ScrollCtx);
  const containerRef = React.useRef<HTMLDivElement>();
  const lastScrollRef = React.useRef(window.scrollY);

  React.useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (visible) {
        const target =
          window.scrollY +
          rect.top +
          rect.height * 0.8 -
          window.innerHeight * 0.8;
        lastScrollRef.current = window.scrollY;
        scrollTo(Math.max(0, target));
      } else {
        scrollTo(lastScrollRef.current);
      }
    }
  }, [scrollTo, visible]);

  return (
    <div
      ref={containerRef as any}
      style={{ opacity: visible ? '1' : '0', transitionDuration: '0.2s' }}
    >
      {children}
    </div>
  );
};

interface ChainProps {
  children: Array<React.ReactElement<{ step?: StepsConfig }>>;
  start?: number;
}

export const Chain: React.FC<ChainProps> = ({ children, start = 1 }) => {
  injectComponents(children);

  return React.Children.map(children, (item, i) => {
    return <Appear step={{ start: start + i }}>{item}</Appear>;
  }) as any;
};

function resolveStepsConfig(config: StepsConfig, step: number): boolean {
  if (typeof config === 'number') {
    return config === step;
  }
  if ('step' in config) {
    return config.step === step;
  }
  if ('steps' in config) {
    return config.steps.includes(step);
  }
  const start = 'start' in config ? config.start : null;
  const end = 'end' in config ? config.end : null;
  if (start !== null && end !== null) {
    return step >= start && step <= end;
  }
  if (start !== null) {
    return step >= start;
  }
  if (end !== null) {
    return step <= end;
  }
  return false;
}

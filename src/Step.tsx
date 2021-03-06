import React from 'react';
// import { injectComponents } from './Layout';

export const StepCtx = React.createContext(0);

export const ScrollCtx = React.createContext<
  (conf: StepsConfig, elem: HTMLDivElement) => void
>(() => {});

export const useStep = () => React.useContext(StepCtx);

export type StepsConfig =
  | number
  | { exact: number }
  | { steps: Array<number> }
  | { start: number }
  | { end: number }
  | { start: number; end: number };

export interface StepProps {
  step?: StepsConfig;
  inline?: boolean;
}

export const Step: React.FC<StepProps> = ({ step = 0, children, inline }) => {
  const currentStep = useStep();
  const visible = resolveStepsConfig(step, currentStep);
  const registerScroll = React.useContext(ScrollCtx);
  const containerRef = React.useRef<HTMLDivElement>();
  // const lastScrollRef = React.useRef(window.scrollY);

  React.useEffect(() => {
    if (containerRef.current) {
      registerScroll(step, containerRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React.useEffect(() => {
  //   if (containerRef.current) {
  //     const rect = containerRef.current.getBoundingClientRect();
  //     if (visible) {
  //       const target =
  //         window.scrollY +
  //         rect.top +
  //         rect.height * 0.8 -
  //         window.innerHeight * 0.8;
  //       lastScrollRef.current = window.scrollY;
  //       scrollTo(Math.max(0, target));
  //     } else {
  //       scrollTo(lastScrollRef.current);
  //     }
  //   }
  // }, [scrollTo, visible]);

  const Wrapper = inline ? 'span' : 'div';

  return (
    <Wrapper
      ref={containerRef as any}
      style={{
        opacity: visible ? '1' : '0',
        transitionDuration: '0.3s',
        visibility: visible ? 'visible' : 'hidden'
      }}
    >
      {children}
    </Wrapper>
  );
};

export function resolveMaxStepsConfig(config: StepsConfig): number {
  if (typeof config === 'number') {
    return config;
  }
  if ('exact' in config) {
    return config.exact;
  }
  if ('steps' in config) {
    return Math.max(...config.steps);
  }
  const start = 'start' in config ? config.start : null;
  const end = 'end' in config ? config.end : null;
  if (end !== null) {
    return end;
  }
  if (start !== null) {
    return start;
  }
  return 0;
}

export function resolveStepsConfig(config: StepsConfig, step: number): boolean {
  if (typeof config === 'number') {
    return step >= config;
  }
  if ('exact' in config) {
    return config.exact === step;
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

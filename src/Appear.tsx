import React from 'react';

export const StepCtx = React.createContext(0);

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

  return (
    <div style={{ visibility: visible ? 'visible' : 'hidden' }}>{children}</div>
  );
};

interface ChainProps {
  children: Array<React.ReactElement<{ step?: StepsConfig }>>;
  start?: number;
}

export const Chain: React.FC<ChainProps> = ({ children, start = 1 }) => {
  return React.Children.map(children, (item, i) => {
    return React.cloneElement(item, { step: { start: start + i } });
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

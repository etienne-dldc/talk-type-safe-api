import React from 'react';
import * as _01 from '../slides/01.mdx';
import * as _02 from '../slides/02.mdx';
import * as _03 from '../slides/03.mdx';
import Layout from './Layout';
import { StepCtx, ScrollCtx } from './Appear';
import { useSpring, config, useTransition, animated } from 'react-spring';

const SLIDES = [_01, _02, _03];

const PAGES = SLIDES.map(slide => {
  const Page = slide.default;
  return ({ style }: any) => (
    <animated.div style={{ ...style, padding: 1 }}>
      <Page />
    </animated.div>
  );
});

const LAST_SLIDE = SLIDES.length - 1;

interface Config {
  steps: number;
}

function getConfig(slideIndex: number): Config {
  const currentSlide = SLIDES[slideIndex];
  const currentConfig: Config = (currentSlide as any).config || { steps: 0 };
  return currentConfig;
}

interface Props {
  header?: string;
}

const Slides: React.FC<Props> = ({ header = '' }) => {
  const [, setYInternal] = useSpring<{ y: number }>(() => ({
    immediate: false,
    y: 0,
    onFrame: (props: any) => {
      window.scroll(0, props.y);
    },
    config: config.default
  }));

  const [menu, setMenu] = React.useState(false);
  const [current, setCurrent] = React.useState<[number, number]>([0, 0]);

  const [slide, step] = current;

  const [prevSlideState, setPrevSlide] = React.useState(slide);
  React.useEffect(() => {
    setPrevSlide(slide);
  }, [slide]);

  const setYRef = React.useRef(setYInternal);
  setYRef.current = setYInternal;

  const setY = React.useCallback((val: number) => {
    setYRef.current({
      y: val,
      reset: true,
      from: { y: window.scrollY }
    });
  }, []);

  React.useEffect(() => {
    setY(0);
  }, [slide, setY]);

  const prevSlide = React.useCallback(() => {
    setCurrent(([slide]) => [Math.max(slide - 1, 0), 0]);
  }, []);

  const nextSlide = React.useCallback(() => {
    setCurrent(([slide, step]) => {
      const nextSlide = Math.min(slide + 1, LAST_SLIDE);
      if (slide === nextSlide) {
        return [slide, step];
      }
      return [nextSlide, 0];
    });
  }, []);

  const prevStep = React.useCallback(() => {
    setCurrent(([slide, step]) => {
      if (step <= 0) {
        const prevSlide = Math.max(slide - 1, 0);
        const prevSlideConfig = getConfig(prevSlide);
        return [prevSlide, prevSlideConfig.steps];
      }
      return [slide, Math.max(0, step - 1)];
    });
  }, []);

  const nextStep = React.useCallback(() => {
    setCurrent(([slide, step]) => {
      const currentConfig = getConfig(slide);
      if (step >= currentConfig.steps) {
        const nextSlide = Math.min(slide + 1, LAST_SLIDE);
        if (nextSlide === slide) {
          return [slide, step];
        }
        return [nextSlide, 0];
      }
      return [slide, step + 1];
    });
  }, []);

  React.useEffect(() => {
    if (menu) {
      return;
    }
    const onKeydown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') {
        prevSlide();
        e.preventDefault();
      }
      if (e.code === 'ArrowRight') {
        nextSlide();
        e.preventDefault();
      }
      if (e.code === 'ArrowDown') {
        nextStep();
        e.preventDefault();
      }
      if (e.code === 'ArrowUp') {
        prevStep();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, [prevSlide, nextSlide, nextStep, prevStep, menu]);

  const transitions = useTransition(slide, p => p, {
    config: config.default,

    from: index => {
      return {
        opacity: 0,
        transform:
          index < prevSlideState
            ? 'translate3d(-100vw,0,0)'
            : 'translate3d(100vw,0,0)'
      };
    },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: index => {
      return {
        position: 'absolute',
        top: 0,
        opacity: 0,
        transform:
          index < slide ? 'translate3d(-100vw,0,0)' : 'translate3d(100vw,0,0)'
      };
    }
  });

  return (
    <div className="main">
      <StepCtx.Provider value={step}>
        <ScrollCtx.Provider value={setY}>
          {menu ? (
            <Layout>
              <nav>
                <span
                  className="back"
                  onClick={() => {
                    setMenu(false);
                  }}
                >
                  {'<- back'}
                </span>
              </nav>
              <br />
              {SLIDES.map((_, i) => (
                <React.Fragment key={i}>
                  <span
                    className="btn menu-btn"
                    onClick={() => {
                      setCurrent([i, 0]);
                      setMenu(false);
                    }}
                  >
                    {`// ${padLeft(i)}.mdx`}
                  </span>
                  <br />
                </React.Fragment>
              ))}
            </Layout>
          ) : (
            <React.Fragment>
              <nav>
                <p className="btn" onClick={() => setMenu(true)}>{`// ${padLeft(
                  slide
                )}-${step}.mdx`}</p>
                <span className="infos">{header}</span>
              </nav>
              <Layout>
                <div style={{ position: 'relative' }}>
                  {transitions.map(({ item, props, key }) => {
                    const Page = PAGES[item];
                    return <Page key={key} style={props} />;
                  })}
                </div>
              </Layout>
            </React.Fragment>
          )}
        </ScrollCtx.Provider>
      </StepCtx.Provider>
    </div>
  );
};

function padLeft(num: number): string {
  return (num < 10 ? '00' : num < 100 ? '0' : '') + num.toFixed(0);
}

export default Slides;

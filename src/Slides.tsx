import React from 'react';
import { Document, resolve, ResolveValues } from 'docsy';
import { StepCtx, ScrollCtx } from './Appear';
import { useSpring, config } from 'react-spring';
import { Appear } from './Appear';
import * as COMPONENTS from './DocsyComponents';

export type SlideItem =
  | {
      type: 'slide';
      url: string;
      path: Array<string>;
      content: Document;
      steps: number;
    }
  | {
      type: 'error';
      url: string;
      path: Array<string>;
      error: JSX.Element;
      steps: number;
    };

interface Props {
  slides: Array<SlideItem>;
  header: string;
}

const RESOLVE_VALUES: ResolveValues = {
  createElement: React.createElement,
  Step: Appear,
  ...COMPONENTS
};

export const Slides: React.FC<Props> = ({ slides, header }) => {
  const navRef = React.useRef<HTMLElement>();

  const LAST_SLIDE = slides.length - 1;

  React.useEffect(() => {
    window.addEventListener('scroll', () => {
      if (navRef.current) {
        if (window.scrollY > 10) {
          navRef.current.classList.add('scroll');
        } else {
          navRef.current.classList.remove('scroll');
        }
      }
    });
  }, []);

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
  // const [prevSlideState, setPrevSlide] = React.useState(slide);

  // React.useEffect(() => {
  //   setPrevSlide(slide);
  // }, [slide]);

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
  }, [LAST_SLIDE]);

  const prevStep = React.useCallback(() => {
    setCurrent(prevState => {
      const [slide, step] = prevState;
      if (slide <= 0 && step <= 0) {
        return prevState;
      }
      if (step <= 0) {
        const prevSlide = Math.max(slide - 1, 0);
        const prevSlideSteps = slides[prevSlide].steps;
        return [prevSlide, prevSlideSteps];
      }
      return [slide, Math.max(0, step - 1)];
    });
  }, [slides]);

  const nextStep = React.useCallback(() => {
    setCurrent(prevState => {
      const [slide, step] = prevState;
      const currentSteps = slides[slide].steps;
      if (step >= currentSteps) {
        const nextSlide = Math.min(slide + 1, LAST_SLIDE);
        if (nextSlide === slide) {
          return prevState;
        }
        return [nextSlide, 0];
      }
      return [slide, step + 1];
    });
  }, [LAST_SLIDE, slides]);

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
  }, [prevSlide, nextSlide, menu, nextStep, prevStep]);

  // const transitions = useTransition(slide, p => p, {
  //   config: config.default,
  //   from: index => {
  //     return {
  //       opacity: 0,
  //       transform:
  //         index < prevSlideState
  //           ? 'translate3d(-100vw,0,0)'
  //           : 'translate3d(100vw,0,0)'
  //     };
  //   },
  //   enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
  //   leave: index => {
  //     return {
  //       position: 'absolute',
  //       top: 0,
  //       opacity: 0,
  //       transform:
  //         index < slide ? 'translate3d(-100vw,0,0)' : 'translate3d(100vw,0,0)'
  //     };
  //   }
  // });

  const currentSlide = slides[slide];

  const content = React.useMemo(() => {
    if (!currentSlide) {
      return null;
    }
    if (currentSlide.type === 'error') {
      return currentSlide.error;
    }
    try {
      const items = resolve(currentSlide.content, RESOLVE_VALUES);
      return React.createElement(React.Fragment, null, ...items);
    } catch (error) {
      console.error(error);
      return <div>Error: {String(error)}</div>;
    }
  }, [currentSlide]);

  return (
    <div className="main">
      <StepCtx.Provider value={step}>
        <ScrollCtx.Provider value={setY}>
          <nav ref={navRef as any}>
            <div>
              {menu ? (
                <span
                  className="back"
                  onClick={() => {
                    setMenu(false);
                  }}
                >
                  {'<- back'}
                </span>
              ) : (
                <p
                  className="btn"
                  onClick={() => setMenu(true)}
                >{`// ${currentSlide.path.join('/')}.dy`}</p>
              )}
              <span className="infos">{header}</span>
            </div>
          </nav>
          <div className="page">
            {menu ? (
              <div>
                {slides.map((slide, i) => (
                  <React.Fragment key={i}>
                    <span
                      className="btn menu-btn"
                      onClick={() => {
                        setCurrent([i, 0]);
                        setMenu(false);
                      }}
                    >
                      {`// ${slide.path.join('/')}.dy`}
                    </span>
                    <br />
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div>
                <div style={{ position: 'relative' }}>
                  {content}
                  {/* {transitions.map(({ item, props, key }) => {
                      const Page = PAGES[item];
                      return <Page key={key} style={props} />;
                    })} */}
                </div>
              </div>
            )}
          </div>
        </ScrollCtx.Provider>
      </StepCtx.Provider>
    </div>
  );
};

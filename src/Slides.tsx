import React from 'react';
import { StepCtx, ScrollCtx, StepsConfig, resolveStepsConfig } from './Step';
import { useSpring, config } from 'react-spring';
import { createBrowserHistory, Location } from 'history';
import qs from 'query-string';
import { NavContex } from './NavContext';

export type SlideItem = {
  url: string;
  path: Array<string>;
  slug: string;
  content: Array<JSX.Element>;
  steps: number;
};

interface Props {
  slides: Array<SlideItem>;
  header: string;
}

const history = createBrowserHistory();

function stateFromLocation(location: Location, slides: Array<SlideItem>): [number, number] {
  const { pathname, search } = location;
  const parsed = qs.parse(search, { parseNumbers: true });
  const step = typeof parsed.step === 'number' ? parsed.step : 0;
  const res = slides.findIndex(slide => {
    return slide.slug === pathname;
  });
  const slide = res === -1 ? 0 : res;
  return [slide, step];
}

export const Slides: React.FC<Props> = ({ slides, header }) => {
  const navRef = React.useRef<HTMLElement>();

  const [location, setLocation] = React.useState(history.location);
  const locationRef = React.useRef(location);
  locationRef.current = location;

  React.useEffect(() => {
    return history.listen(nextLocation => {
      setLocation(nextLocation);
    });
  }, []);

  const [slide, step] = React.useMemo(() => stateFromLocation(location, slides), [
    location,
    slides
  ]);

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

  const setCurrent = React.useCallback(
    (exec: (prev: [number, number]) => [number, number]) => {
      const [slideIndex, step] = exec(stateFromLocation(locationRef.current, slides));
      const slide = slides[slideIndex];
      history.push(`${slide.slug}?step=${step}`);
    },
    [slides]
  );

  const [menu, setMenu] = React.useState(false);
  // const [, setCurrent] = React.useState<[number, number]>([0, 0]);
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

  const scrollPos = React.useRef(new Map<StepsConfig, HTMLDivElement>());
  React.useMemo(() => {
    scrollPos.current = new Map<StepsConfig, HTMLDivElement>();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide]);

  const registerScroll = React.useCallback((conf: StepsConfig, elem: HTMLDivElement) => {
    scrollPos.current.set(conf, elem);
  }, []);

  // React.useEffect(() => {
  //   setY(0);
  // }, [slide, setY]);

  React.useEffect(() => {
    setTimeout(() => {
      let value = 0;
      scrollPos.current.forEach((elem, config) => {
        const active = resolveStepsConfig(config, step);
        if (active) {
          const rect = elem.getBoundingClientRect();
          const target = window.scrollY + rect.top + rect.height * 0.8 - window.innerHeight * 0.8;
          value = Math.max(value, target);
        }
      });
      setY(value);
    }, 100);
  }, [step, setY]);

  const prevSlide = React.useCallback(() => {
    setCurrent(([slide]) => [Math.max(slide - 1, 0), 0]);
  }, [setCurrent]);

  const nextSlide = React.useCallback(() => {
    setCurrent(([slide, step]) => {
      const nextSlide = Math.min(slide + 1, LAST_SLIDE);
      if (slide === nextSlide) {
        return [slide, step];
      }
      return [nextSlide, 0];
    });
  }, [LAST_SLIDE, setCurrent]);

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
  }, [setCurrent, slides]);

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
  }, [LAST_SLIDE, setCurrent, slides]);

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

  const navContext = React.useMemo((): NavContex => {
    return {
      push: history.push
    };
  }, []);

  return (
    <div className="main">
      <StepCtx.Provider value={step}>
        <ScrollCtx.Provider value={registerScroll}>
          <NavContex.Provider value={navContext}>
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
                  <p className="btn" onClick={() => setMenu(true)}>{`// ${currentSlide.slug.slice(
                    1
                  )}.dy`}</p>
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
                          setCurrent(() => [i, 0]);
                          setMenu(false);
                        }}
                      >
                        {`// ${slide.slug.slice(1)}.dy`}
                      </span>
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div>
                  <div key={currentSlide.slug} style={{ position: 'relative' }}>
                    {React.createElement(React.Fragment, null, ...(currentSlide.content as any))}
                    {/* {transitions.map(({ item, props, key }) => {
                      const Page = PAGES[item];
                      return <Page key={key} style={props} />;
                    })} */}
                  </div>
                </div>
              )}
            </div>
          </NavContex.Provider>
        </ScrollCtx.Provider>
      </StepCtx.Provider>
    </div>
  );
};

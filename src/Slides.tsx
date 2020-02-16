import React from 'react';
import _01 from '../slides/01.mdx';
import _02 from '../slides/02.mdx';
import Layout from './Layout';
import { StepCtx } from './Appear';

const SLIDES = [
  _01,
  _02,
  _02,
  _02,
  _02,
  _02,
  _02,
  _02,
  _02,
  _02,
  _02,
  _02,
  _02
];

const Slides = () => {
  const [menu, setMenu] = React.useState(false);
  const [current, setCurrent] = React.useState<[number, number]>([0, 0]);

  const nextSlide = React.useCallback(() => {
    setCurrent(([slide]) => [(slide + 1) % SLIDES.length, 0]);
  }, []);

  const prevSlide = React.useCallback(() => {
    setCurrent(([slide]) => [(slide + SLIDES.length - 1) % SLIDES.length, 0]);
  }, []);

  const prevStep = React.useCallback(() => {
    setCurrent(([slide, step]) => [slide, Math.max(0, step - 1)]);
  }, []);

  const nextStep = React.useCallback(() => {
    setCurrent(([slide, step]) => [slide, step + 1]);
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

  if (menu) {
    return (
      <Layout>
        <span
          className="back"
          onClick={() => {
            setMenu(false);
          }}
        >
          {'<- back'}
        </span>
        <br />
        {SLIDES.map((_, i) => (
          <React.Fragment key={i}>
            <span
              className="nav"
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
    );
  }

  const [slide, step] = current;

  return (
    <div>
      <StepCtx.Provider value={step}>
        <p onClick={() => setMenu(true)} className="nav">{`// ${padLeft(
          slide
        )}-${step}.mdx`}</p>
        <Layout>{React.createElement(SLIDES[slide])}</Layout>
      </StepCtx.Provider>
    </div>
  );
};

function padLeft(num: number): string {
  return (num < 10 ? '00' : num < 100 ? '0' : '') + num.toFixed(0);
}

export default Slides;

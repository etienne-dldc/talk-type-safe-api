import React from "react";
import _01 from "../slides/01.mdx";
import _02 from "../slides/02.mdx";
import Layout from "./Layout";

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
  const [current, setCurrent] = React.useState(0);

  const nextSlide = React.useCallback(() => {
    setCurrent(v => (v + 1) % SLIDES.length);
  }, []);

  const prevSlide = React.useCallback(() => {
    setCurrent(v => (v + SLIDES.length - 1) % SLIDES.length);
  }, []);

  React.useEffect(() => {
    if (menu) {
      return;
    }
    const onKeydown = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft") {
        prevSlide();
      }
      if (e.code === "ArrowRight") {
        nextSlide();
      }
    };
    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, [prevSlide, nextSlide, menu]);

  if (menu) {
    return (
      <Layout>
        {SLIDES.map((_, i) => (
          <React.Fragment>
            <span
              className="nav"
              onClick={() => {
                setCurrent(i);
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

  return (
    <div>
      <p onClick={() => setMenu(true)} className="nav">{`// ${padLeft(
        current
      )}.mdx`}</p>
      <Layout>{React.createElement(SLIDES[current])}</Layout>
    </div>
  );
};

function padLeft(num: number): string {
  return (num < 10 ? "00" : num < 100 ? "0" : "") + num.toFixed(0);
}

export default Slides;

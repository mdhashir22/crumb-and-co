
import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { heroProducts } from '../../data/heroProducts';
import './Hero.scss';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const formatPrice = (price) =>
  Number(price ?? 0).toLocaleString('en-PK');

function ProductPhoto({ product }) {
  const [hasError, setHasError] = useState(false);

  return hasError || !product.image ? (
    <span
      className="portal__fallback"
      role="img"
      aria-label={product.name}
    >
      {product.emoji || '🥐'}
    </span>
  ) : (
    <img
      src={product.image}
      alt={product.name}
      draggable={false}
      decoding="async"
      onError={() => setHasError(true)}
    />
  );
}

function GlassPortal({ product, variant, index, onSelect }) {
  const isMain = variant === 'main';

  const title =
    isMain && index === 0
      ? 'The Golden Classic'
      : product.name;

  const tagline = product.tagline || (
    isMain
      ? 'FRESHLY BAKED. ALWAYS WITH LOVE.'
      : variant === 'top'
        ? 'RICH. SWEET. IRRESISTIBLE.'
        : 'FRESHLY MADE. FULL OF JOY.'
  );

  const content = (
    <>
      <div className="portal__window" aria-hidden="true">
        <div className="portal__dimension" />
        <div className="portal__dimension-glow" />
        <div className="portal__glass-reflection" />
      </div>

      <div
        className={`portal__depth portal__depth--${variant}`}
      >
        <div className="portal__swap" key={product.id}>
          <div className="portal__float">
            <ProductPhoto
              key={product.id}
              product={product}
            />
          </div>
        </div>
      </div>

      <div className="portal__caption">
        <div className="portal__caption-copy">
          {isMain && (
            <span className="portal__eyebrow">
              THE SIGNATURE CLASSIC
            </span>
          )}

          <h2>{title}</h2>
          <p>{tagline}</p>
        </div>

        <span className="portal__number">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="portal__arrow" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </>
  );

  if (isMain) {
    return (
      <div
        className="portal portal--main"
        aria-label={`Featured product: ${product.name}`}
      >
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`portal portal--${variant}`}
      onClick={onSelect}
      aria-label={`Feature ${product.name}`}
    >
      {content}
    </button>
  );
}

function Hero() {
  const sectionRef = useRef(null);
  const sceneRef = useRef(null);
  const pointerFrameRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const count = heroProducts.length;
  const activeProduct = heroProducts[activeIndex];

  const topIndex =
    count > 1 ? (activeIndex + 1) % count : 0;

  const bottomIndex =
    count > 2 ? (activeIndex + 2) % count : topIndex;

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        '.crumb-hero__side-note',
        { autoAlpha: 0, x: -16 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.85,
          ease: 'power2.out',
        }
      );

      gsap.fromTo(
        '.portal',
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 1.0,
          stagger: 0.12,
          ease: 'power2.out',
        }
      );

      const media = gsap.matchMedia();

      media.add(
        '(min-width: 1025px) and (prefers-reduced-motion: no-preference)',
        () => {
          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () =>
                `+=${Math.round(window.innerHeight * 0.68)}`,
              scrub: 0.55,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .to(
              '.portal__depth--main',
              {
                xPercent: 9,
                yPercent: 19,
                scale: 0.38,
                opacity: 0.25,
              },
              0
            )
            .to(
              '.portal__depth--top',
              {
                xPercent: -7,
                yPercent: 16,
                scale: 0.42,
                opacity: 0.27,
              },
              0
            )
            .to(
              '.portal__depth--bottom',
              {
                xPercent: -8,
                yPercent: 17,
                scale: 0.42,
                opacity: 0.27,
              },
              0
            )
            .to(
              '.portal__dimension-glow',
              {
                opacity: 0.48,
                scale: 1.06,
              },
              0
            )
            .to(
              '.crumb-hero__photo',
              {
                scale: 1.065,
                yPercent: 2.5,
              },
              0
            )
            .to(
              '.crumb-hero__intro-inner',
              { y: -19 },
              0
            );

          return () => timeline.kill();
        }
      );

      return () => media.revert();
    }, section);

    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section || prefersReducedMotion()) return;

    const swaps = section.querySelectorAll(
      '.portal__swap'
    );

    const animation = gsap.fromTo(
      swaps,
      { opacity: 0, y: 18, scale: 0.92 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.07,
        duration: 0.62,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete: () =>
          gsap.set(swaps, {
            clearProps: 'transform,opacity',
          }),
      }
    );

    return () => {
      animation.kill();

      gsap.set(swaps, {
        clearProps: 'transform,opacity',
      });
    };
  }, [activeIndex]);

  useLayoutEffect(() => () => {
    if (pointerFrameRef.current !== null) {
      cancelAnimationFrame(pointerFrameRef.current);
    }
  }, []);

  function handlePointerMove(event) {
    if (
      event.pointerType !== 'mouse' ||
      prefersReducedMotion() ||
      !sceneRef.current
    ) {
      return;
    }

    if (pointerFrameRef.current !== null) {
      cancelAnimationFrame(pointerFrameRef.current);
    }

    const scene = sceneRef.current;
    const bounds = scene.getBoundingClientRect();

    const x =
      (event.clientX - bounds.left) / bounds.width - 0.5;

    const y =
      (event.clientY - bounds.top) / bounds.height - 0.5;

    pointerFrameRef.current = requestAnimationFrame(() => {
      scene.style.setProperty(
        '--pointer-x',
        `${(x * 14).toFixed(2)}px`
      );

      scene.style.setProperty(
        '--pointer-y',
        `${(y * 10).toFixed(2)}px`
      );

      pointerFrameRef.current = null;
    });
  }

  function handlePointerLeave() {
    if (!sceneRef.current) return;

    if (pointerFrameRef.current !== null) {
      cancelAnimationFrame(pointerFrameRef.current);
      pointerFrameRef.current = null;
    }

    sceneRef.current.style.setProperty(
      '--pointer-x',
      '0px'
    );

    sceneRef.current.style.setProperty(
      '--pointer-y',
      '0px'
    );
  }

  if (!activeProduct) return null;

  return (
    <section
      ref={sectionRef}
      id="home"
      className="crumb-hero"
      aria-labelledby="crumb-hero-heading"
    >
      <div
        ref={sceneRef}
        className="crumb-hero__scene"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div
          className="crumb-hero__photo"
          aria-hidden="true"
        />

        <div
          className="crumb-hero__vignette"
          aria-hidden="true"
        />

        <div className="crumb-hero__side-note">
          <span>✧</span>
          FRESHLY
          <br />
          BAKED.
          <br />
          MADE WITH
          <br />
          LOVE.
        </div>

        <div className="crumb-hero__intro">
          <div className="crumb-hero__intro-inner">
            <div className="crumb-hero__eyebrow">
              <span />
              ARTISANAL BAKES
              <span />
            </div>

            <h1 id="crumb-hero-heading">
              Layers of
              <em>happiness.</em>
            </h1>

            
<p>
  Golden, buttery and beautifully flaky.
  <br />{' '}
  A little moment of joy in every bite.
</p>


            <div className="crumb-hero__actions">
              <Link
                to="/#nav-bakes"
                className="crumb-hero__button"
              >
                EXPLORE OUR BAKES
                <ArrowUpRight size={19} />
              </Link>

              <div className="crumb-hero__starting">
                <span>STARTING AT</span>
                <strong>
                  Rs. {formatPrice(
                    heroProducts[0]?.price ?? 450
                  )}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <GlassPortal
          product={activeProduct}
          variant="main"
          index={activeIndex}
        />

        {count > 1 && (
          <GlassPortal
            product={heroProducts[topIndex]}
            variant="top"
            index={topIndex}
            onSelect={() => setActiveIndex(topIndex)}
          />
        )}

        {count > 2 && (
          <GlassPortal
            product={heroProducts[bottomIndex]}
            variant="bottom"
            index={bottomIndex}
            onSelect={() => setActiveIndex(bottomIndex)}
          />
        )}

        <div
          className="crumb-hero__particles"
          aria-hidden="true"
        >
          <span className="crumb-hero__particle crumb-hero__particle--1" />
          <span className="crumb-hero__particle crumb-hero__particle--2" />
          <span className="crumb-hero__particle crumb-hero__particle--3" />
          <span className="crumb-hero__particle crumb-hero__particle--4" />
          <span className="crumb-hero__particle crumb-hero__particle--5" />
        </div>

        <div
          className="crumb-hero__signature"
          aria-hidden="true"
        >
          <Sparkles size={14} />
          BAKED WITH LOVE
        </div>
      </div>
    </section>
  );
}

export default Hero;

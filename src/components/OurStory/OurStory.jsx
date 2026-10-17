
import {
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  ArrowUpRight,
  Heart,
  Sparkles,
  Wheat,
} from 'lucide-react';

import './OurStory.scss';

gsap.registerPlugin(ScrollTrigger);

const storyImages = {
  main: '/images/our-story/atelier-hands.jpg',
  detail: '/images/our-story/fresh-from-the-oven.jpg',
};

const values = [
  {
    number: '01',
    title: 'Made with intention',
    description:
      'Thoughtful details, beautiful finishes and care in every creation.',
  },
  {
    number: '02',
    title: 'A little everyday magic',
    description:
      'Familiar flavours, comforting moments and sweetness worth sharing.',
  },
  {
    number: '03',
    title: 'For moments that matter',
    description:
      'From quiet afternoon treats to the celebrations you remember.',
  },
];

function StoryPhoto({ src, alt, label }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="our-story__photo">
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          draggable={false}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="our-story__photo-fallback"
          role="img"
          aria-label={alt}
        >
          <Wheat size={42} strokeWidth={1} />
          <span>CRUMB & CO.</span>
          <small>BAKED WITH LOVE</small>
        </div>
      )}

      {label && (
        <span className="our-story__photo-label">
          {label}
        </span>
      )}
    </div>
  );
}

function OurStory() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        '.our-story__reveal',
        {
          y: 45,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.our-story__intro',
            start: 'top 85%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.our-story__main-photo',
        {
          y: 60,
          opacity: 0,
          scale: 0.96,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.our-story__layout',
            start: 'top 82%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.our-story__content-reveal',
        {
          y: 38,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.13,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.our-story__layout',
            start: 'top 75%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.our-story__floating-photo',
        {
          y: 40,
          opacity: 0,
          rotation: 4,
        },
        {
          y: 0,
          opacity: 1,
          rotation: -3,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.our-story__layout',
            start: 'top 72%',
            once: true,
          },
        }
      );

      gsap.to('.our-story__photo-main-image', {
        yPercent: -5,
        ease: 'none',
        scrollTrigger: {
          trigger: '.our-story__visual',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      gsap.to('.our-story__star', {
        rotation: 120,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      id="our-story"
      ref={sectionRef}
      className="our-story"
      aria-labelledby="our-story-heading"
    >
      <div className="our-story__container">

        <header className="our-story__intro">
          <div className="our-story__intro-left">

            <span className="our-story__eyebrow our-story__reveal">
              <span className="our-story__eyebrow-dot" />
              THE HEART OF CRUMB & CO.
              <span className="our-story__eyebrow-line" />
              006
            </span>

            <h2
              id="our-story-heading"
              className="our-story__heading our-story__reveal"
            >
              A little love
              <em>in every layer.</em>
            </h2>
          </div>

          <div className="our-story__intro-right our-story__reveal">
            <Sparkles size={20} strokeWidth={1.5} />

            <p>
              The little details make the
              sweetest difference.
            </p>
          </div>
        </header>

        <div className="our-story__layout">

          <div className="our-story__visual">

            <div className="our-story__main-photo">

              <div className="our-story__photo-main-image">
                <StoryPhoto
                  src={storyImages.main}
                  alt="Baker working with fresh dough in a warm artisan bakery"
                  label="THE BEAUTY OF THE PROCESS"
                />
              </div>

            </div>

            <div className="our-story__floating-photo">
              <StoryPhoto
                src={storyImages.detail}
                alt="Freshly baked pastries prepared with care"
                label="FRESHLY BAKED"
              />
            </div>

            <div
              className="our-story__star"
              aria-hidden="true"
            >
              ✳
            </div>

            <div className="our-story__visual-note">
              <span>001 / OUR LITTLE WORLD</span>
              <span>CRAFTED WITH CARE</span>
            </div>

          </div>

          <div className="our-story__content">

            <div className="our-story__chapter our-story__content-reveal">
              <span>CHAPTER 06</span>
              <span className="our-story__chapter-line" />
              <span>OUR PHILOSOPHY</span>
            </div>

            <div className="our-story__content-reveal">
              <span className="our-story__kicker">
                MORE THAN JUST A BAKERY
              </span>

              <h3>
                Good things
                <br />
                <em>take a little love.</em>
              </h3>
            </div>

            <div className="our-story__copy our-story__content-reveal">
              <p>
                We believe the sweetest moments are often
                the simplest ones. A warm pastry in the
                morning. A slice of cake shared with
                someone special. A little treat that
                makes an ordinary day feel beautiful.
              </p>

              <p>
                At Crumb & Co., every creation is
                inspired by that feeling — familiar
                comfort with a thoughtful, modern
                touch. Because something made with
                love should feel just as special
                as it tastes.
              </p>
            </div>

            <div className="our-story__values">

              {values.map((value) => (
                <div
                  className="our-story__value our-story__content-reveal"
                  key={value.number}
                >
                  <span className="our-story__value-number">
                    {value.number}
                  </span>

                  <div className="our-story__value-copy">
                    <h4>{value.title}</h4>
                    <p>{value.description}</p>
                  </div>

                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                </div>
              ))}

            </div>

            <a
              href="#fresh-bakes"
              className="our-story__cta our-story__content-reveal"
            >
              <span>EXPLORE OUR CREATIONS</span>

              <span className="our-story__cta-icon">
                <ArrowUpRight size={18} />
              </span>
            </a>

            <div className="our-story__signature our-story__content-reveal">
              <Heart
                size={15}
                strokeWidth={1.5}
                aria-hidden="true"
              />

              A LITTLE SWEETNESS, A LOT OF LOVE.
            </div>

          </div>
        </div>

        <div className="our-story__bottom">
          <span>THE LITTLE THINGS MATTER MOST.</span>
          <span aria-hidden="true">✳</span>
          <span>CRUMB & CO. — BAKED WITH LOVE.</span>
        </div>

      </div>
    </section>
  );
}

export default OurStory;

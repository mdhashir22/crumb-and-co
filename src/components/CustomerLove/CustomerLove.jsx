
import {
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Heart,
  Quote,
  Sparkles,
} from 'lucide-react';

import './CustomerLove.scss';

gsap.registerPlugin(ScrollTrigger);

const loveNotes = [
  {
    id: 'celebrations',
    number: '01',
    category: 'LITTLE CELEBRATIONS',
    title: 'The moments we celebrate',
    quote:
      'Some moments deserve more than a candle. They deserve something made with love.',
    description:
      'Birthdays, anniversaries and all the beautiful reasons to gather around something sweet.',
    accent: '#e7b7a6',
  },
  {
    id: 'slow-mornings',
    number: '02',
    category: 'SLOW MORNINGS',
    title: 'The everyday rituals',
    quote:
      'A warm pastry, a quiet morning and a little sweetness can make an ordinary day feel special.',
    description:
      'For the comforting little rituals that turn even the simplest morning into a lovely memory.',
    accent: '#e4c99d',
  },
  {
    id: 'sharing',
    number: '03',
    category: 'MADE FOR SHARING',
    title: 'The joy of sharing',
    quote:
      'The sweetest things in life are the ones we get to share with the people we love.',
    description:
      'From a box of fresh bakes to a beautifully finished cake, good moments are better together.',
    accent: '#d4c6ac',
  },
  {
    id: 'little-surprises',
    number: '04',
    category: 'JUST BECAUSE',
    title: 'The little surprises',
    quote:
      'Sometimes the loveliest reason to bring someone a treat is simply because they matter.',
    description:
      'Thoughtful surprises, unexpected smiles and tiny gestures that mean so much.',
    accent: '#dbb2ba',
  },
];

function CustomerLove() {
  const sectionRef = useRef(null);
  const slideRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const activeNote = loveNotes[activeIndex];

  function selectNote(index) {
    if (
      index < 0 ||
      index >= loveNotes.length ||
      index === activeIndex
    ) {
      return;
    }

    setActiveIndex(index);
  }

  function nextNote() {
    setActiveIndex(
      (previous) =>
        (previous + 1) % loveNotes.length
    );
  }

  function previousNote() {
    setActiveIndex(
      (previous) =>
        (previous - 1 + loveNotes.length) %
        loveNotes.length
    );
  }

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        '.customer-love__reveal',
        {
          opacity: 0,
          y: 42,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          stagger: 0.13,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.customer-love__bottom',
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.customer-love__workspace',
            start: 'bottom 95%',
            once: true,
          },
        }
      );
    }, section);

    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    const slide = slideRef.current;

    if (!slide) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) return;

    const elements = slide.querySelectorAll(
      '.customer-love__slide-animate'
    );

    const animation = gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.075,
        ease: 'power3.out',
        overwrite: 'auto',
      }
    );

    return () => animation.kill();
  }, [activeIndex]);

  return (
    <section
      id="customer-love"
      className="customer-love"
      ref={sectionRef}
      aria-labelledby="customer-love-title"
    >
      <div className="customer-love__container">

        <div className="customer-love__intro">

          <div className="customer-love__intro-main customer-love__reveal">

            <div className="customer-love__eyebrow">
              <Sparkles size={15} />
              THE LITTLE THINGS THAT MATTER
              <span className="customer-love__eyebrow-line" />
              007
            </div>

            <h2 id="customer-love-title">
              Sweet moments.
              <em>Beautiful memories.</em>
            </h2>

          </div>

          <div className="customer-love__intro-aside customer-love__reveal">
            <Heart size={21} strokeWidth={1.35} />

            <p>
              Every treat has a little story behind it.
              These are the moments that make
              sweetness worth sharing.
            </p>
          </div>

        </div>

        <div className="customer-love__workspace">

          <div className="customer-love__feature customer-love__reveal">

            <div className="customer-love__feature-glow" />

            <div className="customer-love__feature-orbit customer-love__feature-orbit--outer" />
            <div className="customer-love__feature-orbit customer-love__feature-orbit--inner" />

            <div className="customer-love__feature-top">
              <span>
                CRUMB & CO. / LOVE NOTES
              </span>

              <span>
                {activeNote.number}
                <i> / </i>
                {String(loveNotes.length).padStart(2, '0')}
              </span>
            </div>

            <div
              className="customer-love__feature-content"
              ref={slideRef}
              key={activeNote.id}
              aria-live="polite"
              aria-atomic="true"
              style={{
                '--note-accent': activeNote.accent,
              }}
            >

              <div className="customer-love__quote-icon customer-love__slide-animate">
                <Quote
                  size={44}
                  strokeWidth={1.05}
                />
              </div>

              <div className="customer-love__feature-category customer-love__slide-animate">
                <span className="customer-love__category-dot" />
                {activeNote.category}
              </div>

              <blockquote className="customer-love__quote customer-love__slide-animate">
                {activeNote.quote}
              </blockquote>

              <div className="customer-love__quote-divider customer-love__slide-animate">
                <span />
                <Heart size={15} strokeWidth={1.5} />
                <span />
              </div>

              <p className="customer-love__feature-description customer-love__slide-animate">
                {activeNote.description}
              </p>

            </div>

            <div className="customer-love__feature-bottom">

              <div className="customer-love__feature-signature">
                <span className="customer-love__signature-star">
                  ✳
                </span>

                <div>
                  <strong>
                    A LITTLE SWEETNESS
                  </strong>
                  <small>
                    A LOT OF LOVE
                  </small>
                </div>
              </div>

              <div className="customer-love__navigation">

                <button
                  type="button"
                  onClick={previousNote}
                  aria-label="Previous love note"
                >
                  <ArrowLeft size={19} />
                </button>

                <button
                  type="button"
                  onClick={nextNote}
                  aria-label="Next love note"
                >
                  <ArrowRight size={19} />
                </button>

              </div>

            </div>

          </div>

          <div className="customer-love__side customer-love__reveal">

            <div className="customer-love__side-top">
              <div>
                <span className="customer-love__side-eyebrow">
                  THE LOVE NOTES
                </span>

                <h3>
                  Every little
                  <em>moment counts.</em>
                </h3>
              </div>

              <span className="customer-love__side-symbol">
                ✳
              </span>
            </div>

            <p className="customer-love__side-description">
              Little celebrations, everyday rituals
              and everything in between.
              Explore the moments that inspire
              our favourite creations.
            </p>

            <div
              className="customer-love__note-list"
              role="group"
              aria-label="Choose a sweet moment"
            >

              {loveNotes.map((note, index) => (
                <button
                  key={note.id}
                  type="button"
                  className={`customer-love__note ${
                    index === activeIndex
                      ? 'is-active'
                      : ''
                  }`}
                  onClick={() => selectNote(index)}
                  aria-pressed={index === activeIndex}
                >
                  <span className="customer-love__note-number">
                    {note.number}
                  </span>

                  <span className="customer-love__note-text">
                    <small>
                      {note.category}
                    </small>

                    <strong>
                      {note.title}
                    </strong>
                  </span>

                  <span className="customer-love__note-arrow">
                    <ArrowUpRight size={19} />
                  </span>
                </button>
              ))}

            </div>

            <div className="customer-love__progress">

              {loveNotes.map((note, index) => (
                <button
                  type="button"
                  key={note.id}
                  className={`customer-love__progress-step ${
                    index === activeIndex
                      ? 'is-active'
                      : ''
                  }`}
                  onClick={() => selectNote(index)}
                  aria-label={`Go to note ${index + 1}`}
                  aria-current={
                    index === activeIndex
                      ? 'step'
                      : undefined
                  }
                />
              ))}

            </div>

            <a
              href="#fresh-bakes"
              className="customer-love__explore"
            >
              <span>
                FIND SOMETHING SWEET
              </span>

              <ArrowUpRight size={17} />
            </a>

          </div>

        </div>

        <div className="customer-love__bottom">

          <span>
            MADE FOR THE MOMENTS THAT MATTER.
          </span>

          <span aria-hidden="true">
            ✳
          </span>

          <span>
            WITH LOVE, CRUMB & CO.
          </span>

        </div>

      </div>
    </section>
  );
}

export default CustomerLove;

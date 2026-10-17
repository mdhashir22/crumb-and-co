
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Pause,
  Play,
  Sparkles,
} from 'lucide-react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './CroissantStory.scss';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// CRUMB & CO. — CROISSANT STORY
// PREMIUM GLASS AUTO CAROUSEL
// ==========================================

const SLIDE_DURATION = 6500;

// ==========================================
// STORY DATA + ACTUAL IMAGES
// ==========================================

const storyChapters = [
  {
    id: 'ingredients',
    number: '01',
    name: 'The Ingredients',
    shortName: 'Ingredients',
    eyebrow: 'THE BEGINNING',

    title: 'It begins',
    highlight: 'with love.',

    description:
      'Every beautiful bake begins with the little things. Carefully chosen ingredients, a thoughtful touch and an appreciation for the magic of simplicity.',

    detail: 'GOOD INGREDIENTS. BEAUTIFUL BEGINNINGS.',

    image:
      '/images/croissant-story/croissant-ingredients.png',

    imageAlt:
      'Fresh flour, butter, eggs, milk and other croissant-making ingredients arranged on a rustic bakery table.',

    imageLabel: 'PURE & THOUGHTFUL',
    accent: '#ba845c',
  },
  {
    id: 'layers',
    number: '02',
    name: 'The Layers',
    shortName: 'Layers',
    eyebrow: 'THE ART OF BAKING',

    title: 'Layer by',
    highlight: 'lovely layer.',

    description:
      'A delicate dance of dough and butter creates those irresistible golden layers. Each fold brings us closer to something wonderfully flaky.',

    detail: 'EVERY LAYER TELLS A STORY.',

    image:
      '/images/croissant-story/croissant-layers.png',

    imageAlt:
      'Unbaked croissant dough showing delicate buttery laminated layers and hand-shaped pastries on a flour-dusted table.',

    imageLabel: 'FOLDED WITH CARE',
    accent: '#ab7350',
  },
  {
    id: 'golden',
    number: '03',
    name: 'The Golden Finish',
    shortName: 'Golden Finish',
    eyebrow: 'THE GOLDEN MOMENT',

    title: 'Baked to',
    highlight: 'make you smile.',

    description:
      'Warm from the oven, perfectly golden and deliciously crisp. That first bite is more than a treat. It is a little moment worth celebrating.',

    detail: 'HAPPINESS, FRESHLY BAKED.',

    image:
      '/images/croissant-story/croissant-golden-finish.png',

    imageAlt:
      'Beautifully baked golden-brown croissants with shiny flaky layers, photographed in a warm artisan bakery.',

    imageLabel: 'BAKED TO PERFECTION',
    accent: '#c18b60',
  },
];

// ==========================================
// MAIN COMPONENT
// ==========================================

function CroissantStory() {
  const sectionRef = useRef(null);
  const visualRef = useRef(null);
  const photoRef = useRef(null);
  const textRef = useRef(null);
  const progressRef = useRef(null);
  const touchStartRef = useRef(null);

  // Time already spent on the active slide.
  const elapsedRef = useRef(0);

  const [activeChapter, setActiveChapter] = useState(0);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [reduceMotion, setReduceMotion] = useState(false);
  const [failedImages, setFailedImages] = useState({});

  const chapter = storyChapters[activeChapter];

  const shouldAutoPlay =
    isVisible &&
    !isHovered &&
    !hasFocus &&
    !isPaused &&
    !reduceMotion;

  // ========================================
  // PRELOAD ALL THREE IMAGES
  // ========================================

  useEffect(() => {
    storyChapters.forEach((item) => {
      const image = new Image();
      image.src = item.image;
    });
  }, []);

  // ========================================
  // RESPECT REDUCED MOTION
  // ========================================

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    const updateMotionPreference = () => {
      setReduceMotion(mediaQuery.matches);
    };

    updateMotionPreference();

    mediaQuery.addEventListener?.(
      'change',
      updateMotionPreference
    );

    return () => {
      mediaQuery.removeEventListener?.(
        'change',
        updateMotionPreference
      );
    };
  }, []);

  // ========================================
  // DETECT WHEN VISUAL IS ON SCREEN
  // ========================================

  useEffect(() => {
    const visual = visualRef.current;

    if (!visual) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(visual);

    return () => observer.disconnect();
  }, []);

  // ========================================
  // CHANGE SLIDE
  // ========================================

  function selectChapter(index) {
    if (
      index < 0 ||
      index >= storyChapters.length
    ) {
      return;
    }

    // Restart the progress bar for manual changes.
    elapsedRef.current = 0;

    if (progressRef.current) {
      progressRef.current.style.transform =
        'scaleX(0)';
    }

    setActiveChapter(index);
  }

  // ========================================
  // PREVIOUS AND NEXT
  // ========================================

  function nextChapter() {
    selectChapter(
      (activeChapter + 1) % storyChapters.length
    );
  }

  function previousChapter() {
    selectChapter(
      (activeChapter - 1 + storyChapters.length) %
        storyChapters.length
    );
  }

  // ========================================
  // AUTO CAROUSEL + REAL PROGRESS
  // ========================================

  useEffect(() => {
    if (!shouldAutoPlay) return;

    let animationFrame;
    let lastTimestamp = null;

    const updateProgress = (timestamp) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }

      const delta = Math.min(
        timestamp - lastTimestamp,
        100
      );

      lastTimestamp = timestamp;

      elapsedRef.current += delta;

      const progress = Math.min(
        elapsedRef.current / SLIDE_DURATION,
        1
      );

      if (progressRef.current) {
        progressRef.current.style.transform =
          `scaleX(${progress})`;
      }

      if (elapsedRef.current >= SLIDE_DURATION) {
        elapsedRef.current = 0;

        if (progressRef.current) {
          progressRef.current.style.transform =
            'scaleX(0)';
        }

        setActiveChapter(
          (previous) =>
            (previous + 1) % storyChapters.length
        );

        return;
      }

      animationFrame = requestAnimationFrame(
        updateProgress
      );
    };

    animationFrame = requestAnimationFrame(
      updateProgress
    );

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [
    activeChapter,
    shouldAutoPlay,
  ]);

  // ========================================
  // GSAP SCROLL REVEALS
  // ========================================

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section || reduceMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        '.croissant-story__reveal',
        {
          y: 45,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',

          scrollTrigger: {
            trigger: section,
            start: 'top 77%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        visualRef.current,
        {
          y: 65,
          scale: 0.96,
          autoAlpha: 0,
        },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 1.2,
          ease: 'power3.out',

          scrollTrigger: {
            trigger: visualRef.current,
            start: 'top 87%',
            once: true,
          },
        }
      );

      // Decorative parallax

      gsap.to(
        '.croissant-story__decor--one',
        {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.3,
          },
        }
      );

      gsap.to(
        '.croissant-story__decor--two',
        {
          y: 70,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.3,
          },
        }
      );
    }, section);

    return () => context.revert();
  }, [reduceMotion]);

  // ========================================
  // GSAP IMAGE + TEXT TRANSITION
  // ========================================

  useLayoutEffect(() => {
    if (reduceMotion) return;

    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      if (photoRef.current) {
        gsap.fromTo(
          photoRef.current,
          {
            autoAlpha: 0,
            scale: 1.09,
            x: 25,
          },
          {
            autoAlpha: 1,
            scale: 1,
            x: 0,
            duration: 0.9,
            ease: 'power3.out',
          }
        );
      }

      if (textRef.current) {
        gsap.fromTo(
          textRef.current.children,
          {
            autoAlpha: 0,
            y: 22,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power3.out',
          }
        );
      }
    }, section);

    return () => context.revert();
  }, [activeChapter, reduceMotion]);

  // ========================================
  // MOBILE SWIPE SUPPORT
  // ========================================

  function handleTouchStart(event) {
    touchStartRef.current =
      event.changedTouches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event) {
    if (touchStartRef.current === null) return;

    const endX =
      event.changedTouches[0]?.clientX;

    if (typeof endX !== 'number') {
      touchStartRef.current = null;
      return;
    }

    const difference =
      touchStartRef.current - endX;

    touchStartRef.current = null;

    if (Math.abs(difference) < 45) return;

    if (difference > 0) {
      nextChapter();
    } else {
      previousChapter();
    }
  }

  // ========================================
  // IMAGE ERROR HANDLING
  // ========================================

  function handleImageError(imagePath) {
    setFailedImages((previous) => ({
      ...previous,
      [imagePath]: true,
    }));
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <section
      id="our-story"
      className="croissant-story"
      ref={sectionRef}
      aria-labelledby="croissant-story-title"
      style={{
        '--story-accent': chapter.accent,
      }}
    >
      {/* BACKGROUND DECORATIONS */}

      <div
        className="croissant-story__decor croissant-story__decor--one"
        aria-hidden="true"
      />

      <div
        className="croissant-story__decor croissant-story__decor--two"
        aria-hidden="true"
      />

      <div className="croissant-story__container">

        {/* ===================================
            SECTION INTRO
        =================================== */}

        <div className="croissant-story__top">
          <div className="croissant-story__intro">

            <div className="croissant-story__eyebrow croissant-story__reveal">
              <Sparkles size={15} />

              THE CRUMB & CO. STORY

              <span> / 002</span>
            </div>

            <h2
              id="croissant-story-title"
              className="croissant-story__heading croissant-story__reveal"
            >
              Not just baked.
              <em>Made with feeling.</em>
            </h2>
          </div>

          <p className="croissant-story__intro-description croissant-story__reveal">
            Some of the best moments in life are
            beautifully simple. A warm pastry.
            A little sweetness. Something made
            with care.
          </p>
        </div>

        {/* ===================================
            MAIN STORY LAYOUT
        =================================== */}

        <div
          className="croissant-story__layout"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setHasFocus(true)}
          onBlurCapture={(event) => {
            if (
              !event.currentTarget.contains(
                event.relatedTarget
              )
            ) {
              setHasFocus(false);
            }
          }}
        >

          {/* =================================
              LEFT — CINEMATIC IMAGE SLIDER
          ================================= */}

          <div
            className="croissant-story__visual"
            ref={visualRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            aria-label={`${chapter.name}: ${chapter.imageAlt}`}
          >
            {/* CHANGING PHOTOGRAPH */}

            <div
              key={chapter.id}
              className="croissant-story__photo"
              ref={photoRef}
            >
              {!failedImages[chapter.image] ? (
                <img
                  src={chapter.image}
                  alt={chapter.imageAlt}
                  loading="lazy"
                  draggable={false}
                  onError={() =>
                    handleImageError(chapter.image)
                  }
                />
              ) : (
                <div className="croissant-story__photo-fallback">
                  <span role="img" aria-label="Croissant">
                    🥐
                  </span>

                  <p>HAPPINESS, FRESHLY BAKED.</p>
                </div>
              )}
            </div>

            {/* SUBTLE PHOTO OVERLAYS */}

            <div
              className="croissant-story__photo-wash"
              aria-hidden="true"
            />

            {/* PHOTO TOP */}

            <div className="croissant-story__visual-top">
              <span className="croissant-story__visual-dot" />

              THE ART OF A PERFECT CROISSANT
            </div>

            {/* PHOTO SIDE NUMBER */}

            <span
              className="croissant-story__visual-number"
              aria-hidden="true"
            >
              {chapter.number}
            </span>

            {/* PREVIOUS / NEXT */}

            <div className="croissant-story__visual-arrows">
              <button
                type="button"
                onClick={previousChapter}
                aria-label="Previous baking step"
                title="Previous step"
              >
                <ArrowLeft size={19} />
              </button>

              <button
                type="button"
                onClick={nextChapter}
                aria-label="Next baking step"
                title="Next step"
              >
                <ArrowRight size={19} />
              </button>
            </div>

            {/* PHOTO BOTTOM LABEL */}

            <div className="croissant-story__visual-bottom">
              <div>
                <span>THE MAKING OF SOMETHING SPECIAL</span>

                <strong>
                  {chapter.imageLabel}
                </strong>
              </div>

              <span className="croissant-story__visual-count">
                {chapter.number} / 03
              </span>
            </div>
          </div>

          {/* =================================
              RIGHT — STORY CONTENT
          ================================= */}

          <div className="croissant-story__content">

            <div className="croissant-story__content-top croissant-story__reveal">
              <span>
                OUR LITTLE BAKING PHILOSOPHY
              </span>

              <Sparkles
                size={21}
                strokeWidth={1.4}
              />
            </div>

            {/* CHANGING CONTENT */}

            <div
              key={chapter.id}
              className="croissant-story__chapter-content"
              ref={textRef}
              aria-live="off"
            >
              <span className="croissant-story__chapter-eyebrow">
                <span className="croissant-story__chapter-index">
                  {chapter.number}
                </span>

                {chapter.eyebrow}
              </span>

              <h3>
                {chapter.title}
                <em>{chapter.highlight}</em>
              </h3>

              <p>
                {chapter.description}
              </p>

              <div className="croissant-story__chapter-footer">
                <span className="croissant-story__chapter-dot" />

                {chapter.detail}
              </div>
            </div>

            {/* =================================
                PREMIUM GLASS STORY SLIDER
            ================================= */}

            <div className="croissant-story__glass">

              <div className="croissant-story__glass-header">
                <span>
                  EXPLORE THE PROCESS
                </span>

                <button
                  type="button"
                  className="croissant-story__play-button"
                  onClick={() =>
                    setIsPaused((previous) => !previous)
                  }
                  aria-label={
                    isPaused
                      ? 'Resume automatic slideshow'
                      : 'Pause automatic slideshow'
                  }
                  aria-pressed={isPaused}
                  title={
                    isPaused
                      ? 'Resume slideshow'
                      : 'Pause slideshow'
                  }
                >
                  {isPaused ? (
                    <Play size={13} fill="currentColor" />
                  ) : (
                    <Pause size={13} fill="currentColor" />
                  )}

                  <span>
                    {isPaused ? 'PLAY' : 'PAUSE'}
                  </span>
                </button>
              </div>

              {/* GLASS SELECTOR */}

              <div
                className="croissant-story__glass-track"
                role="group"
                aria-label="Select a croissant-making stage"
              >
                {/* SLIDING GLASS HIGHLIGHT */}

                <span
                  className="croissant-story__glass-highlight"
                  style={{
                    transform: `translateX(${activeChapter * 100}%)`,
                  }}
                  aria-hidden="true"
                />

                {storyChapters.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`croissant-story__glass-step ${
                      activeChapter === index
                        ? 'is-active'
                        : ''
                    }`}
                    onClick={() => selectChapter(index)}
                    aria-pressed={activeChapter === index}
                    aria-label={`Step ${item.number}: ${item.name}`}
                  >
                    <span className="croissant-story__glass-number">
                      {item.number}
                    </span>

                    <span className="croissant-story__glass-label">
                      {item.shortName}
                    </span>
                  </button>
                ))}
              </div>

              {/* AUTOPLAY PROGRESS */}

              <div className="croissant-story__glass-progress">
                <div className="croissant-story__progress-caption">
                  <span>
                    {isPaused
                      ? 'SLIDESHOW PAUSED'
                      : reduceMotion
                        ? 'MANUAL SLIDESHOW'
                        : 'THE BAKING JOURNEY'}
                  </span>

                  <span>
                    {chapter.number} / 03
                  </span>
                </div>

                <div
                  className="croissant-story__progress-track"
                  aria-hidden="true"
                >
                  <span
                    className="croissant-story__progress-fill"
                    ref={progressRef}
                  />
                </div>
              </div>

            </div>

            {/* CTA */}

            <a
              className="croissant-story__cta"
              href="#fresh-bakes"
            >
              DISCOVER OUR BAKES
              <ArrowUpRight size={19} />
            </a>
          </div>

        </div>

        {/* ===================================
            BOTTOM SIGNATURE
        =================================== */}

        <div className="croissant-story__signature">
          <span>THE LITTLE THINGS MATTER.</span>

          <span className="croissant-story__signature-star">
            ✳
          </span>

          <span>HAPPINESS, FRESHLY BAKED.</span>
        </div>

      </div>
    </section>
  );
}

export default CroissantStory;

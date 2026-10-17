
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  ArrowDownRight,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  freshBakes,
  bakeFilters,
} from '../../data/freshBakes';

import ProductQuickView from '../ProductQuickView/ProductQuickView';

import './FreshBakes.scss';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// PRODUCT IMAGE WITH FALLBACK
// ==========================================

function BakeImage({ bake }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="fresh-bakes__image">
      {!failed ? (
        <img
          src={bake.image}
          alt={bake.name}
          loading="lazy"
          draggable={false}
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          className="fresh-bakes__emoji"
          role="img"
          aria-label={bake.name}
        >
          {bake.emoji || '🥐'}
        </span>
      )}
    </div>
  );
}

// ==========================================
// INDIVIDUAL PRODUCT CARD
// ==========================================

function BakeCard({ bake, number, onOpen }) {
  // ========================================
  // MOUSE 3D TILT
  // ========================================

  function handlePointerMove(event) {
    if (event.pointerType !== 'mouse') return;

    if (
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
    ) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) / rect.width - 0.5;

    const y =
      (event.clientY - rect.top) / rect.height - 0.5;

    event.currentTarget.style.setProperty(
      '--card-rotate-x',
      `${-y * 7}deg`
    );

    event.currentTarget.style.setProperty(
      '--card-rotate-y',
      `${x * 7}deg`
    );
  }

  function resetTilt(event) {
    event.currentTarget.style.setProperty(
      '--card-rotate-x',
      '0deg'
    );

    event.currentTarget.style.setProperty(
      '--card-rotate-y',
      '0deg'
    );
  }

  return (
    <article
      className="fresh-bakes__card"
      style={{
        '--card-accent': bake.accent,
        '--card-background': bake.background,
      }}
    >
      {/* =====================================
          PRODUCT PHOTO
      ===================================== */}

      <div
        className="fresh-bakes__visual"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
      >
        <div className="fresh-bakes__visual-inner">

          <span className="fresh-bakes__circle fresh-bakes__circle--outer" />
          <span className="fresh-bakes__circle fresh-bakes__circle--inner" />

          {/* PRODUCT BADGE */}

          <span className="fresh-bakes__badge">
            <Sparkles size={12} />
            {bake.badge}
          </span>

          {/* PRODUCT IMAGE */}

          <BakeImage bake={bake} />

          {/* DECORATIVE SPARKLES */}

          <span
            className="fresh-bakes__twinkle fresh-bakes__twinkle--one"
            aria-hidden="true"
          >
            ✦
          </span>

          <span
            className="fresh-bakes__twinkle fresh-bakes__twinkle--two"
            aria-hidden="true"
          >
            ✳
          </span>

          {/* IMAGE FOOTER */}

          <div className="fresh-bakes__visual-bottom">
            <span>CRUMB / {bake.label}</span>
            <span>0{number}</span>
          </div>

          {/* CLICKABLE IMAGE AREA */}

          <button
            type="button"
            className="fresh-bakes__visual-open"
            onClick={() => onOpen(bake)}
            aria-label={`View and order ${bake.name}`}
            title={`Explore ${bake.name}`}
          />
        </div>
      </div>

      {/* =====================================
          CARD CONTENT
      ===================================== */}

      <div className="fresh-bakes__card-body">

        <div className="fresh-bakes__card-meta">
          <span>{bake.label}</span>
          <span>FRESH SELECTION / 0{number}</span>
        </div>

        <h3>{bake.name}</h3>

        <p className="fresh-bakes__description">
          {bake.description}
        </p>

        {/* =================================
            PRICE + QUICK VIEW BUTTON
        ================================= */}

        <div className="fresh-bakes__card-bottom">

          <div className="fresh-bakes__price">
            <small>STARTING AT</small>

            <strong>
              Rs. {bake.price.toLocaleString('en-PK')}
            </strong>
          </div>

          <button
            type="button"
            className="fresh-bakes__discover"
            onClick={() => onOpen(bake)}
            aria-label={`View ${bake.name} and add to bag`}
            title={`Order ${bake.name}`}
          >
            <ArrowUpRight size={19} />
          </button>
        </div>

        {/* =================================
            DISCOVER BUTTON
        ================================= */}

        <button
          type="button"
          className="fresh-bakes__text-link"
          onClick={() => onOpen(bake)}
          aria-label={`Discover and order ${bake.name}`}
        >
          DISCOVER THE TREAT

          <ArrowUpRight size={15} />
        </button>

      </div>
    </article>
  );
}

// ==========================================
// MAIN FRESH BAKES SECTION
// ==========================================

function FreshBakes() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  const [activeFilter, setActiveFilter] =
    useState('all');

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  // ========================================
  // FILTERED PRODUCTS
  // ========================================

  const visibleBakes =
    activeFilter === 'all'
      ? freshBakes
      : freshBakes.filter(
          (bake) => bake.category === activeFilter
        );

  // ========================================
  // OPEN / CLOSE PRODUCT QUICK VIEW
  // ========================================

  const openProduct = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  const closeProduct = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  // ========================================
  // GSAP INTRO SCROLL REVEAL
  // ========================================

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    if (
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        '.fresh-bakes__intro-reveal',
        {
          y: 50,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,

          duration: 0.95,
          stagger: 0.12,
          ease: 'power3.out',

          scrollTrigger: {
            trigger: '.fresh-bakes__intro',
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, section);

    return () => context.revert();
  }, []);

  // ========================================
  // GSAP PRODUCT CARD SCROLL REVEAL
  // ========================================

  useLayoutEffect(() => {
    const grid = gridRef.current;

    if (!grid) return;

    if (
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        '.fresh-bakes__card',
        {
          y: 75,
          rotationX: -5,
          autoAlpha: 0,
        },
        {
          y: 0,
          rotationX: 0,
          autoAlpha: 1,

          duration: 1,
          stagger: 0.1,
          ease: 'back.out(1.15)',

          scrollTrigger: {
            trigger: grid,
            start: 'top 88%',
            once: true,
          },
        }
      );
    }, grid);

    const refreshId = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      window.cancelAnimationFrame(refreshId);
      context.revert();
    };
  }, [activeFilter]);

  // ========================================
  // COMPONENT JSX
  // ========================================

  return (
    <>
      <section
        id="fresh-bakes"
        className="fresh-bakes"
        ref={sectionRef}
        aria-labelledby="fresh-bakes-title"
      >
        {/* =====================================
            BACKGROUND
        ===================================== */}

        <div
          className="fresh-bakes__ambient"
          aria-hidden="true"
        />

        <div className="fresh-bakes__container">

          {/* =================================
              SECTION INTRO
          ================================= */}

          <div className="fresh-bakes__intro">

            <div className="fresh-bakes__intro-main">

              <div className="fresh-bakes__eyebrow fresh-bakes__intro-reveal">
                <span className="fresh-bakes__eyebrow-dot" />

                THE SWEET SELECTION

                <span className="fresh-bakes__eyebrow-line" />

                001
              </div>

              <h2
                id="fresh-bakes-title"
                className="fresh-bakes__heading fresh-bakes__intro-reveal"
              >
                Little Treats.
                <em>Big Happiness.</em>
              </h2>

              <p className="fresh-bakes__intro-description fresh-bakes__intro-reveal">
                From chocolate-filled favourites to
                delicate little delights, discover
                something sweet for every moment.
              </p>

            </div>

            <div className="fresh-bakes__intro-side fresh-bakes__intro-reveal">

              <span>FRESH IDEAS / SWEET MOMENTS</span>

              <div className="fresh-bakes__intro-icon">
                <ArrowDownRight
                  size={25}
                  strokeWidth={1.4}
                />
              </div>

            </div>
          </div>

          {/* =================================
              CATEGORY FILTERS
          ================================= */}

          <div className="fresh-bakes__filters">

            <div
              className="fresh-bakes__filter-list"
              role="group"
              aria-label="Filter bakery products"
            >
              {bakeFilters.map((filter) => (
                <button
                  type="button"
                  key={filter.id}
                  className={`fresh-bakes__filter ${
                    activeFilter === filter.id
                      ? 'is-active'
                      : ''
                  }`}
                  onClick={() =>
                    setActiveFilter(filter.id)
                  }
                  aria-pressed={
                    activeFilter === filter.id
                  }
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <span
              className="fresh-bakes__results"
              aria-live="polite"
            >
              {String(visibleBakes.length).padStart(
                2,
                '0'
              )}{' '}
              SWEET FINDS
            </span>

          </div>

          {/* =================================
              PRODUCT GRID
          ================================= */}

          <div
            className="fresh-bakes__grid"
            ref={gridRef}
          >
            {visibleBakes.map((bake, index) => (
              <BakeCard
                key={bake.id}
                bake={bake}
                number={index + 1}
                onOpen={openProduct}
              />
            ))}
          </div>

          {/* =================================
              BOTTOM MESSAGE
          ================================= */}

          <div className="fresh-bakes__bottom">

            <div className="fresh-bakes__bottom-icon">
              ✳
            </div>

            <p>
              A little something sweet makes
              everything better.
            </p>

            <span>
              MADE WITH LOVE / CRUMB & CO.
            </span>

          </div>

        </div>

        {/* =====================================
            INFINITE MARQUEE
        ===================================== */}

        <div
          className="fresh-bakes__marquee"
          aria-hidden="true"
        >
          <div className="fresh-bakes__marquee-track">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <span key={index}>
                  FRESHLY BAKED
                  <i>✳</i>
                  MADE WITH LOVE
                  <i>✳</i>
                  LITTLE BITES OF JOY
                  <i>✳</i>
                </span>
              )
            )}
          </div>
        </div>

      </section>

      {/* =======================================
          PRODUCT QUICK VIEW MODAL
          Rendered through React Portal
      ======================================= */}

      {selectedProduct && (
        <ProductQuickView
          key={selectedProduct.id}
          product={selectedProduct}
          onClose={closeProduct}
        />
      )}
    </>
  );
}

export default FreshBakes;

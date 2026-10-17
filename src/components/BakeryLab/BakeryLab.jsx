
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  ArrowRight,
  Check,
  ChefHat,
  Clock3,
  Heart,
  RotateCcw,
  Sparkles,
  Flame,
} from 'lucide-react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './BakeryLab.scss';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// CRUMB & CO. — PREMIUM BAKERY LAB
// ==========================================

const BAKE_DURATION = 3500;
const ASSET_ROOT = '/images/bakery-lab';

// ==========================================
// BASE RECIPES
// ==========================================

const bakeBases = [
  {
    id: 'croissant',
    name: 'Butter Croissant',
    shortName: 'Croissant',
    eyebrow: 'FLAKY & GOLDEN',
    description: 'Delicate buttery layers with a crisp golden finish.',
    accent: '#b77d50',
    image: `${ASSET_ROOT}/bases/croissant.png`,
    fallback: '/images/hero/croissant.png',
    ingredients: ['flour', 'butter', 'milk', 'yeast'],
  },
  {
    id: 'cookie',
    name: 'Brown Butter Cookie',
    shortName: 'Cookie',
    eyebrow: 'SOFT & CHEWY',
    description: 'Rich brown butter and a beautifully soft centre.',
    accent: '#b78662',
    image: `${ASSET_ROOT}/bases/cookie.png`,
    fallback: '/images/fresh-bakes/brown-butter-cookie.png',
    ingredients: ['flour', 'brown-butter', 'sugar', 'vanilla'],
  },
  {
    id: 'cupcake',
    name: 'Cloud Cupcake',
    shortName: 'Cupcake',
    eyebrow: 'SOFT & FLUFFY',
    description: 'An airy little cake made for sweeter moments.',
    accent: '#c48e96',
    image: `${ASSET_ROOT}/bases/cupcake.png`,
    fallback: '/images/fresh-bakes/berry-cloud-cupcake.png',
    ingredients: ['flour', 'butter', 'milk', 'vanilla'],
  },
];

// ==========================================
// FILLINGS
// ==========================================

const fillingOptions = [
  {
    id: 'chocolate',
    name: 'Chocolate',
    description: 'Rich & silky',
    accent: '#81543f',
    image: `${ASSET_ROOT}/fillings/chocolate.png`,
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    description: 'Sweet & fruity',
    accent: '#c87884',
    image: `${ASSET_ROOT}/fillings/strawberry.png`,
  },
  {
    id: 'pistachio',
    name: 'Pistachio',
    description: 'Nutty & creamy',
    accent: '#8a9969',
    image: `${ASSET_ROOT}/fillings/pistachio.png`,
  },
];

// ==========================================
// FINISHES
// ==========================================

const finishOptions = [
  {
    id: 'caramel',
    name: 'Caramel Drizzle',
    shortName: 'Caramel',
    description: 'Golden sweetness',
    image: `${ASSET_ROOT}/finishes/caramel.png`,
    ingredient: 'caramel',
    accent: '#b67a42',
  },
  {
    id: 'sugar',
    name: 'Sugar Dust',
    shortName: 'Sugar',
    description: 'A delicate touch',
    image: `${ASSET_ROOT}/finishes/sugar.png`,
    ingredient: 'powdered-sugar',
    accent: '#c7af99',
  },
  {
    id: 'crunch',
    name: 'Nutty Crunch',
    shortName: 'Crunch',
    description: 'Beautiful texture',
    image: `${ASSET_ROOT}/finishes/crunch.png`,
    ingredient: 'mixed-nuts',
    accent: '#8d956b',
  },
];

// ==========================================
// INGREDIENT LIBRARY
// ==========================================

const ingredientLibrary = {
  flour: 'Flour',
  butter: 'Butter',
  milk: 'Milk',
  yeast: 'Yeast',
  'brown-butter': 'Brown Butter',
  sugar: 'Sugar',
  vanilla: 'Vanilla',
  chocolate: 'Chocolate',
  strawberry: 'Strawberry',
  pistachio: 'Pistachio',
  caramel: 'Caramel',
  'powdered-sugar': 'Sugar Dust',
  'mixed-nuts': 'Mixed Nuts',
};

// ==========================================
// IMAGE COMPONENT
// Tries dedicated asset, then fallback.
// No broken-image symbols or emojis.
// ==========================================

function LabImage({
  sources = [],
  alt = '',
  className = '',
  placeholder = '',
  loading = 'lazy',
}) {
  const validSources = sources.filter(Boolean);
  const sourceKey = validSources.join('|');

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setAttempt(0);
  }, [sourceKey]);

  const imageSource = validSources[attempt];

  if (!imageSource) {
    return (
      <div
        className={`bakery-lab__image-placeholder ${className}`}
        role="img"
        aria-label={alt || placeholder}
      >
        <span>{placeholder}</span>
      </div>
    );
  }

  return (
    <img
      src={imageSource}
      alt={alt}
      className={className}
      loading={loading}
      draggable={false}
      data-fallback={attempt > 0}
      onError={() => {
        setAttempt((previous) => previous + 1);
      }}
    />
  );
}

// ==========================================
// STEP HEADING
// ==========================================

function LabStepHeading({ number, title, subtitle }) {
  return (
    <div className="bakery-lab__step-heading">
      <span className="bakery-lab__step-number">
        {number}
      </span>

      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

// ==========================================
// SELECTABLE PHOTO CARD
// ==========================================

function SelectionCard({
  item,
  selected,
  disabled,
  onClick,
  fallback,
  variant = 'default',
}) {
  return (
    <button
      type="button"
      className={`bakery-lab__selection-card bakery-lab__selection-card--${variant} ${
        selected ? 'is-selected' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`Select ${item.name}`}
    >
      <span className="bakery-lab__selection-photo">
        <LabImage
          sources={[item.image, fallback]}
          alt={item.name}
          placeholder={item.name}
          className="bakery-lab__selection-image"
        />
      </span>

      {selected && (
        <span className="bakery-lab__selection-check">
          <Check size={13} strokeWidth={2.5} />
        </span>
      )}

      <span className="bakery-lab__selection-copy">
        <strong>{item.name}</strong>

        <small>
          {item.description || item.eyebrow}
        </small>
      </span>
    </button>
  );
}

// ==========================================
// INGREDIENT PHOTO
// ==========================================

function IngredientPhoto({ ingredientKey }) {
  const label =
    ingredientLibrary[ingredientKey] || ingredientKey;

  return (
    <div className="bakery-lab__ingredient">
      <div className="bakery-lab__ingredient-image">
        <LabImage
          sources={[
            `${ASSET_ROOT}/ingredients/${ingredientKey}.png`,
          ]}
          alt={label}
          placeholder={label}
          className="bakery-lab__ingredient-photo"
        />
      </div>

      <span>{label}</span>
    </div>
  );
}

// ==========================================
// BAKERY LAB COMPONENT
// ==========================================

function BakeryLab() {
  const sectionRef = useRef(null);
  const productRef = useRef(null);
  const readyRef = useRef(null);

  const [selectedBase, setSelectedBase] =
    useState('croissant');

  const [selectedFilling, setSelectedFilling] =
    useState('chocolate');

  const [selectedFinish, setSelectedFinish] =
    useState('caramel');

  const [phase, setPhase] = useState('customize');
  const [bakingProgress, setBakingProgress] = useState(0);

  // ========================================
  // SELECTED PRODUCTS
  // ========================================

  const base =
    bakeBases.find((item) => item.id === selectedBase) ||
    bakeBases[0];

  const filling =
    fillingOptions.find(
      (item) => item.id === selectedFilling
    ) || fillingOptions[0];

  const finish =
    finishOptions.find(
      (item) => item.id === selectedFinish
    ) || finishOptions[0];

  const isBaking = phase === 'baking';
  const isReady = phase === 'ready';

  // ========================================
  // ALL 27 PRODUCT COMBINATIONS
  //
  // e.g. croissant-pistachio-crunch.png
  // ========================================

  const combinationKey =
    `${base.id}-${filling.id}-${finish.id}`;

  const combinationImage =
    `${ASSET_ROOT}/products/${combinationKey}.png`;

  const creationName =
    `${filling.name} ${base.shortName}`;

  const creationDescription =
    `${base.description} Filled with ${filling.name.toLowerCase()} and finished with ${finish.name.toLowerCase()}.`;

  // ========================================
  // DYNAMIC INGREDIENTS
  // Four base essentials + filling + finish.
  // ========================================

  const ingredients = [
    ...base.ingredients,
    filling.id,
    finish.ingredient,
  ].filter((value, index, array) => {
    return array.indexOf(value) === index;
  });

  // ========================================
  // SCROLL REVEAL ANIMATION
  // ========================================

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        '.bakery-lab__reveal',
        {
          y: 42,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            once: true,
          },
        }
      );
    }, section);

    return () => context.revert();
  }, []);

  // ========================================
  // PHOTO SWITCH ANIMATION
  // ========================================

  useLayoutEffect(() => {
    if (!productRef.current) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) return;

    const tween = gsap.fromTo(
      productRef.current,
      {
        opacity: 0,
        scale: 1.045,
        y: 15,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.65,
        ease: 'power3.out',
      }
    );

    return () => tween.kill();
  }, [combinationKey]);

  // ========================================
  // COMPLETE REVEAL
  // ========================================

  useLayoutEffect(() => {
    if (!isReady || !readyRef.current) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) return;

    const tween = gsap.fromTo(
      readyRef.current,
      {
        opacity: 0,
        scale: 0.9,
        y: 18,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.65,
        ease: 'back.out(1.4)',
      }
    );

    return () => tween.kill();
  }, [isReady]);

  // ========================================
  // BAKING TIMER
  // ========================================

  useEffect(() => {
    if (phase !== 'baking') return;

    const startTime = performance.now();

    const timer = window.setInterval(() => {
      const elapsed = performance.now() - startTime;

      const progress = Math.min(
        Math.round((elapsed / BAKE_DURATION) * 100),
        100
      );

      setBakingProgress(progress);

      if (progress >= 100) {
        window.clearInterval(timer);
        setPhase('ready');
      }
    }, 50);

    return () => window.clearInterval(timer);
  }, [phase]);

  // ========================================
  // SELECTION HANDLER
  // ========================================

  function changeSelection(setter, value) {
    if (isBaking) return;

    setter(value);

    if (isReady) {
      setPhase('customize');
      setBakingProgress(0);
    }
  }

  // ========================================
  // BAKE BUTTON
  // ========================================

  function handleBake() {
    if (isBaking) return;

    setBakingProgress(0);
    setPhase('baking');
  }

  // ========================================
  // RESET
  // ========================================

  function handleMakeAnother() {
    setSelectedBase('croissant');
    setSelectedFilling('chocolate');
    setSelectedFinish('caramel');

    setBakingProgress(0);
    setPhase('customize');
  }

  // ========================================
  // COMPONENT RENDER
  // ========================================

  return (
    <section
      id="bakery-lab"
      className="bakery-lab"
      ref={sectionRef}
      aria-labelledby="bakery-lab-title"
      style={{
        '--lab-accent': base.accent,
      }}
    >
      {/* BACKGROUND DETAILS */}

      <div
        className="bakery-lab__decoration bakery-lab__decoration--one"
        aria-hidden="true"
      />

      <div
        className="bakery-lab__decoration bakery-lab__decoration--two"
        aria-hidden="true"
      />

      <div className="bakery-lab__container">

        {/* ===================================
            INTRODUCTION
        =================================== */}

        <header className="bakery-lab__header">
          <div className="bakery-lab__header-copy">

            <span className="bakery-lab__eyebrow bakery-lab__reveal">
              <Sparkles size={15} />

              AN INTERACTIVE BAKING EXPERIENCE

              <span>/ 004</span>
            </span>

            <h2
              id="bakery-lab-title"
              className="bakery-lab__title bakery-lab__reveal"
            >
              A Little Magic.
              <em>Made by You.</em>
            </h2>
          </div>

          <p className="bakery-lab__header-description bakery-lab__reveal">
            Your imagination is the secret ingredient.
            Choose a bakery classic, discover your favourite
            flavours and create something beautifully yours.
          </p>
        </header>

        {/* ===================================
            INTERACTIVE WORKSPACE
        =================================== */}

        <div className="bakery-lab__workspace">

          {/* =================================
              LEFT — CUSTOMIZATION PANEL
          ================================= */}

          <div className="bakery-lab__builder bakery-lab__reveal">

            <div className="bakery-lab__builder-header">
              <div>
                <span className="bakery-lab__small-label">
                  THE ART OF PERSONALISATION
                </span>

                <h3>The Little Bake Lab</h3>

                <p>
                  Three choices. One sweet creation.
                </p>
              </div>

              <div className="bakery-lab__builder-symbol">
                <ChefHat size={23} strokeWidth={1.4} />
              </div>
            </div>

            {/* STEP 01 — CHOOSE A BAKE */}

            <div className="bakery-lab__step">
              <LabStepHeading
                number="01"
                title="Choose your bake"
                subtitle="Start with a bakery classic."
              />

              <div className="bakery-lab__options-grid">
                {bakeBases.map((item) => (
                  <SelectionCard
                    key={item.id}
                    item={item}
                    fallback={item.fallback}
                    selected={selectedBase === item.id}
                    disabled={isBaking}
                    onClick={() =>
                      changeSelection(
                        setSelectedBase,
                        item.id
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* STEP 02 — CHOOSE FILLING */}

            <div className="bakery-lab__step">
              <LabStepHeading
                number="02"
                title="Add a little flavour"
                subtitle="Find the filling that feels like you."
              />

              <div className="bakery-lab__options-grid">
                {fillingOptions.map((item) => (
                  <SelectionCard
                    key={item.id}
                    item={item}
                    selected={
                      selectedFilling === item.id
                    }
                    disabled={isBaking}
                    onClick={() =>
                      changeSelection(
                        setSelectedFilling,
                        item.id
                      )
                    }
                    variant="flavour"
                  />
                ))}
              </div>
            </div>

            {/* STEP 03 — CHOOSE FINISH */}

            <div className="bakery-lab__step">
              <LabStepHeading
                number="03"
                title="The finishing touch"
                subtitle="The detail that makes it yours."
              />

              <div className="bakery-lab__options-grid">
                {finishOptions.map((item) => (
                  <SelectionCard
                    key={item.id}
                    item={item}
                    selected={
                      selectedFinish === item.id
                    }
                    disabled={isBaking}
                    onClick={() =>
                      changeSelection(
                        setSelectedFinish,
                        item.id
                      )
                    }
                    variant="finish"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* =================================
              RIGHT — PRODUCT SHOWCASE
          ================================= */}

          <div className="bakery-lab__stage bakery-lab__reveal">

            {/* STATUS BAR */}

            <div className="bakery-lab__stage-top">
              <div className="bakery-lab__stage-brand">
                <Sparkles size={15} />

                <span>YOUR CREATION</span>
              </div>

              <div className="bakery-lab__stage-status">
                <span
                  className={`bakery-lab__status-dot ${
                    isBaking ? 'is-baking' : ''
                  }`}
                />

                {isBaking
                  ? 'IN THE OVEN'
                  : isReady
                    ? 'FRESHLY BAKED'
                    : 'READY TO CREATE'}
              </div>
            </div>

            {/* =================================
                LIVE REALISTIC PRODUCT IMAGE
            ================================= */}

            <div
              className={`bakery-lab__visual ${
                isBaking ? 'is-baking' : ''
              } ${isReady ? 'is-ready' : ''}`}
            >
              <div
                className="bakery-lab__product-scene"
                key={combinationKey}
                ref={productRef}
              >
                <LabImage
                  sources={[
                    combinationImage,
                    base.image,
                    base.fallback,
                  ]}
                  alt={`${creationName} with ${finish.name}`}
                  placeholder={creationName}
                  className="bakery-lab__hero-image"
                  loading="eager"
                />
              </div>

              <div
                className="bakery-lab__visual-shade"
                aria-hidden="true"
              />

              <span className="bakery-lab__visual-caption">
                CRAFTED JUST FOR YOU
              </span>

              {/* REFINED INGREDIENT CALLOUTS */}

              {!isBaking && (
                <>
                  <div className="bakery-lab__photo-callout bakery-lab__photo-callout--filling">
                    <span className="bakery-lab__callout-dot" />

                    <div>
                      <small>FILLING</small>
                      <strong>{filling.name}</strong>
                    </div>
                  </div>

                  <div className="bakery-lab__photo-callout bakery-lab__photo-callout--finish">
                    <span className="bakery-lab__callout-dot" />

                    <div>
                      <small>FINISH</small>
                      <strong>{finish.name}</strong>
                    </div>
                  </div>
                </>
              )}

              {/* CINEMATIC BAKING OVERLAY */}

              {isBaking && (
                <div className="bakery-lab__oven">
                  <div className="bakery-lab__oven-halo" />

                  <div className="bakery-lab__oven-frame">
                    <div className="bakery-lab__oven-window">
                      <span className="bakery-lab__oven-heat bakery-lab__oven-heat--one" />
                      <span className="bakery-lab__oven-heat bakery-lab__oven-heat--two" />
                      <span className="bakery-lab__oven-heat bakery-lab__oven-heat--three" />

                      <Flame
                        size={43}
                        strokeWidth={1.1}
                      />

                      <strong>IN THE OVEN</strong>
                      <small>WARMTH. TIME. A LITTLE MAGIC.</small>
                    </div>

                    <div className="bakery-lab__oven-controls">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}

              {/* READY BADGE */}

              {isReady && (
                <div
                  className="bakery-lab__ready-badge"
                  ref={readyRef}
                >
                  <Check size={17} />
                  FRESHLY BAKED
                </div>
              )}
            </div>

            {/* =================================
                PRODUCT INFORMATION
            ================================= */}

            <div
              className="bakery-lab__creation-details"
              aria-live="polite"
            >
              <span className="bakery-lab__creation-eyebrow">
                {isBaking
                  ? 'YOUR CREATION IS IN THE OVEN'
                  : isReady
                    ? 'SWEET SUCCESS'
                    : base.eyebrow}
              </span>

              <h3>{creationName}</h3>

              <p>
                {isBaking
                  ? 'A little patience, a little warmth and something delicious is on its way.'
                  : creationDescription}
              </p>

              {isReady && (
                <span className="bakery-lab__finished-line">
                  MADE WITH LOVE. FINISHED TO PERFECTION.
                </span>
              )}
            </div>

            {/* =================================
                REAL INGREDIENTS GALLERY
            ================================= */}

            {!isBaking && (
              <div className="bakery-lab__ingredients">
                <div className="bakery-lab__ingredients-heading">
                  <span />
                  THE REAL INGREDIENTS
                  <span />
                </div>

                <div className="bakery-lab__ingredient-grid">
                  {ingredients.map((ingredientKey) => (
                    <IngredientPhoto
                      key={ingredientKey}
                      ingredientKey={ingredientKey}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* =================================
                BAKING PROGRESS
            ================================= */}

            {isBaking && (
              <div
                className="bakery-lab__progress"
                role="progressbar"
                aria-label="Baking progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={bakingProgress}
              >
                <div className="bakery-lab__progress-label">
                  <span>
                    <Clock3 size={15} />
                    BAKING YOUR CREATION
                  </span>

                  <strong>{bakingProgress}%</strong>
                </div>

                <div className="bakery-lab__progress-track">
                  <span
                    style={{
                      width: `${bakingProgress}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* =================================
                ACTIONS
            ================================= */}

            <div className="bakery-lab__actions">
              {isReady ? (
                <>
                  <button
                    type="button"
                    className="bakery-lab__primary-button"
                    onClick={handleMakeAnother}
                  >
                    <RotateCcw size={17} />
                    MAKE ANOTHER
                  </button>

                  <a
                    className="bakery-lab__secondary-button"
                    href="#fresh-bakes"
                  >
                    EXPLORE OUR BAKES
                    <ArrowRight size={17} />
                  </a>
                </>
              ) : (
                <button
                  type="button"
                  className="bakery-lab__primary-button"
                  disabled={isBaking}
                  onClick={handleBake}
                >
                  <ChefHat size={19} strokeWidth={1.5} />

                  {isBaking
                    ? 'BAKING YOUR CREATION...'
                    : 'BAKE MY CREATION'}

                  {!isBaking && (
                    <ArrowRight size={18} />
                  )}
                </button>
              )}
            </div>

            {/* CLOSING MESSAGE */}

            <div className="bakery-lab__stage-footer">
              <Heart size={14} />
              A LITTLE SWEETNESS, A LOT OF LOVE.
            </div>
          </div>
        </div>

        {/* ===================================
            SECTION SIGNATURE
        =================================== */}

        <div className="bakery-lab__signature">
          <span>MADE FOR THE CURIOUS.</span>

          <span aria-hidden="true">✳</span>

          <span>BAKED WITH IMAGINATION.</span>
        </div>
      </div>
    </section>
  );
}

export default BakeryLab;

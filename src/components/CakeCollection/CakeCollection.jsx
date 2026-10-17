
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  WandSparkles,
} from 'lucide-react';

import { useCart } from '../../context/CartContext';

import './CakeCollection.scss';

gsap.registerPlugin(ScrollTrigger);

const IMAGE_ROOT = '/images/cake-collection';

const SIZES = [
  {
    id: '1lb',
    label: '1 LB',
    pounds: 1,
  },
  {
    id: '2lb',
    label: '2 LBS',
    pounds: 2,
  },
  {
    id: '3lb',
    label: '3 LBS',
    pounds: 3,
  },
];

const signatureCakes = [
  {
    id: 'berry-cloud',
    number: '01',
    name: 'Berry Cloud',
    subtitle: 'A Little Taste of Heaven',
    category: 'THE HOUSE FAVOURITE',
    description:
      'A beautifully delicate celebration cake dressed in silky ivory cream and crowned with an abundance of fresh berries.',
    notes: [
      'Silky Cream',
      'Fresh Berries',
      'Elegant Finish',
    ],
    price: 3600,
    image: `${IMAGE_ROOT}/berry-cloud.png`,
    accent: '#dca3a5',
    backdrop: '#f4dfe0',
  },
  {
    id: 'midnight-ganache',
    number: '02',
    name: 'Midnight Ganache',
    subtitle: 'For the Chocolate Obsessed',
    category: 'DECADENT INDULGENCE',
    description:
      'Rich chocolate elegance with a glossy ganache finish, delicate piped details and irresistible cocoa intensity.',
    notes: [
      'Dark Ganache',
      'Chocolate',
      'Signature Finish',
    ],
    price: 4200,
    image: `${IMAGE_ROOT}/midnight-ganache.png`,
    accent: '#a67b66',
    backdrop: '#e9d5ca',
  },
  {
    id: 'velvet-romance',
    number: '03',
    name: 'Velvet Romance',
    subtitle: 'Made for Beautiful Moments',
    category: 'A ROMANTIC CLASSIC',
    description:
      'An elegant red velvet creation with delicate cream details, graceful decoration and timeless celebration charm.',
    notes: [
      'Red Velvet',
      'Soft Cream',
      'Celebration',
    ],
    price: 3900,
    image: `${IMAGE_ROOT}/velvet-romance.png`,
    accent: '#bd727c',
    backdrop: '#f0d9dc',
  },
  {
    id: 'pistachio-reverie',
    number: '04',
    name: 'Pistachio Reverie',
    subtitle: 'A Touch of Refined Luxury',
    category: 'THE ARTISAN EDITION',
    description:
      'A refined pistachio-inspired design featuring delicate green hues, velvety frosting and finely chopped nuts.',
    notes: [
      'Pistachio',
      'Artisan Details',
      'Nutty Finish',
    ],
    price: 4400,
    image: `${IMAGE_ROOT}/pistachio-reverie.png`,
    accent: '#a6ac81',
    backdrop: '#e5e6d2',
  },
  {
    id: 'golden-hour',
    number: '05',
    name: 'Golden Hour',
    subtitle: 'A Celebration of Elegance',
    category: 'LUXURY COLLECTION',
    description:
      'A beautifully finished celebration cake with a warm ivory palette, edible golden pearls and refined decorative details.',
    notes: [
      'Ivory Cream',
      'Gold Pearls',
      'Luxury',
    ],
    price: 4700,
    image: `${IMAGE_ROOT}/golden-hour.png`,
    accent: '#cba36b',
    backdrop: '#f0e1c7',
  },
  {
    id: 'strawberry-eclat',
    number: '06',
    name: 'Strawberry Éclat',
    subtitle: 'Sweet, Soft & Unforgettable',
    category: 'THE SWEETEST SIGNATURE',
    description:
      'A beautiful blush-pink cake finished with flowing cream details, strawberries and an effortlessly romantic appearance.',
    notes: [
      'Blush Cream',
      'Strawberries',
      'Sweet Finish',
    ],
    price: 3800,
    image: `${IMAGE_ROOT}/strawberry-eclat.png`,
    accent: '#d991a3',
    backdrop: '#f4dade',
  },
];

const formatPrice = (value) =>
  Number(value).toLocaleString('en-PK');

const getSizePrice = (basePrice, pounds) =>
  Math.round(basePrice * pounds);

function CakeImage({
  cake,
  className = '',
  eager = false,
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [cake.image]);

  return (
    <div
      className={`cake-collection__image-shell ${className}`}
      style={{
        '--product-accent': cake.accent,
        '--product-backdrop': cake.backdrop,
      }}
    >
      {!failed ? (
        <img
          src={cake.image}
          alt={`${cake.name} signature cake`}
          loading={eager ? 'eager' : 'lazy'}
          draggable={false}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="cake-collection__image-fallback"
          role="img"
          aria-label={`${cake.name} image coming soon`}
        >
          <span className="cake-collection__fallback-orbit" />

          <span className="cake-collection__fallback-name">
            {cake.name}
          </span>

          <span className="cake-collection__fallback-signature">
            CRUMB & CO.
          </span>
        </div>
      )}
    </div>
  );
}

function CakeCollection() {
  const sectionRef = useRef(null);
  const featuredRef = useRef(null);
  const productDetailsRef = useRef(null);

  const { addToCart, openCart } = useCart();

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('1lb');
  const [cakeMessage, setCakeMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const cake = signatureCakes[activeIndex];

  const size =
    SIZES.find((item) => item.id === selectedSize) ||
    SIZES[0];

  const unitPrice = getSizePrice(
    cake.price,
    size.pounds
  );

  const totalPrice = unitPrice * quantity;

  function selectCake(index) {
    if (
      index < 0 ||
      index >= signatureCakes.length ||
      index === activeIndex
    ) {
      return;
    }

    setActiveIndex(index);
    setSelectedSize('1lb');
    setCakeMessage('');
    setQuantity(1);
    setIsAdded(false);
  }

  function goToNextCake() {
    selectCake(
      (activeIndex + 1) % signatureCakes.length
    );
  }

  function goToPreviousCake() {
    selectCake(
      (
        activeIndex -
        1 +
        signatureCakes.length
      ) % signatureCakes.length
    );
  }

  function changeSize(value) {
    setSelectedSize(value);
    setIsAdded(false);
  }

  function changeMessage(value) {
    setCakeMessage(value);
    setIsAdded(false);
  }

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );

    setIsAdded(false);
  }

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(10, current + 1)
    );

    setIsAdded(false);
  }

  function handleAddToCart() {
    const message = cakeMessage.trim();

    const cartId = [
      'signature-cake',
      cake.id,
      selectedSize,
      encodeURIComponent(message || 'no-message'),
    ].join('--');

    const cartProduct = {
      id: cartId,
      productId: cake.id,
      name: `${cake.name} (${size.label})`,
      originalName: cake.name,
      category: 'Signature Cakes',
      image: cake.image,
      price: unitPrice,
      size: size.label,
      weightPounds: size.pounds,
      message,
      accent: cake.accent,
      background: cake.backdrop,
      customization: {
        size: size.label,
        weightPounds: size.pounds,
        message,
      },
    };

    addToCart(cartProduct, quantity);

    setIsAdded(true);

    if (typeof openCart === 'function') {
      openCart();
    }
  }

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

    if (prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        '.cake-collection__reveal',
        {
          opacity: 0,
          y: 45,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    if (!featuredRef.current) return;

    const prefersReducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

    if (prefersReducedMotion) return;

    const timeline = gsap.timeline();

    timeline.fromTo(
      featuredRef.current,
      {
        opacity: 0,
        scale: 0.93,
        y: 22,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.75,
        ease: 'power3.out',
      }
    );

    if (productDetailsRef.current) {
      timeline.fromTo(
        productDetailsRef.current,
        {
          opacity: 0,
          y: 16,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power2.out',
        },
        '-=0.4'
      );
    }

    return () => timeline.kill();
  }, [activeIndex]);

  return (
    <section
      id="cake-collection"
      className="cake-collection"
      ref={sectionRef}
      aria-labelledby="cake-collection-heading"
    >
      <div className="cake-collection__container">

        <header className="cake-collection__heading">

          <div className="cake-collection__heading-main cake-collection__reveal">

            <span className="cake-collection__eyebrow">
              <Sparkles size={15} />
              THE ART OF CELEBRATION
              <span>— 005</span>
            </span>

            <h2 id="cake-collection-heading">
              The Signature
              <em>Cake Collection.</em>
            </h2>

          </div>

          <div className="cake-collection__heading-aside cake-collection__reveal">

            <span>
              MADE FOR YOUR SPECIAL MOMENTS
            </span>

            <p>
              Beautifully crafted cakes for life's
              sweetest celebrations. Choose your favourite,
              personalize the details and make the moment yours.
            </p>

          </div>

        </header>

        <div className="cake-collection__workspace">

          <div className="cake-collection__showcase cake-collection__reveal">

            <div className="cake-collection__showcase-top">

              <span>
                CRUMB & CO. / SIGNATURE EDITION
              </span>

              <span className="cake-collection__product-counter">
                {String(activeIndex + 1).padStart(2, '0')}
                <i> / </i>
                {String(signatureCakes.length).padStart(2, '0')}
              </span>

            </div>

            <div
              className="cake-collection__featured-stage"
              style={{
                '--active-accent': cake.accent,
                '--active-backdrop': cake.backdrop,
              }}
            >

              <div
                className="cake-collection__stage-orbit cake-collection__stage-orbit--outer"
                aria-hidden="true"
              />

              <div
                className="cake-collection__stage-orbit cake-collection__stage-orbit--inner"
                aria-hidden="true"
              />

              <span
                className="cake-collection__stage-watermark"
                aria-hidden="true"
              >
                CRUMB
              </span>

              <div
                className="cake-collection__featured-image"
                ref={featuredRef}
              >
                <CakeImage
                  key={cake.id}
                  cake={cake}
                  eager
                />
              </div>

              <div className="cake-collection__floating-label">
                <Sparkles size={15} />
                HANDCRAFTED WITH LOVE
              </div>

              <div className="cake-collection__stage-navigation">

                <button
                  type="button"
                  onClick={goToPreviousCake}
                  aria-label="Previous cake"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={goToNextCake}
                  aria-label="Next cake"
                >
                  <ChevronRight size={20} />
                </button>

              </div>

            </div>

            <div className="cake-collection__gallery">

              <div className="cake-collection__gallery-heading">

                <span>
                  DISCOVER THE COLLECTION
                </span>

                <span>
                  SELECT YOUR FAVOURITE
                </span>

              </div>

              <div className="cake-collection__gallery-track">

                {signatureCakes.map((item, index) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => selectCake(index)}
                    className={`cake-collection__thumbnail ${
                      activeIndex === index
                        ? 'is-active'
                        : ''
                    }`}
                    aria-pressed={activeIndex === index}
                    aria-label={`View ${item.name}`}
                  >
                    <CakeImage cake={item} />

                    <span>
                      {item.name}
                    </span>
                  </button>
                ))}

              </div>

            </div>

          </div>

          <div className="cake-collection__details cake-collection__reveal">

            <div
              className="cake-collection__details-content"
              ref={productDetailsRef}
            >

              <div className="cake-collection__details-top">

                <span>
                  {cake.category}
                </span>

                <Heart
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />

              </div>

              <div className="cake-collection__product-heading">

                <span className="cake-collection__product-index">
                  SIGNATURE NO. {cake.number}
                </span>

                <h3>{cake.name}</h3>

                <span className="cake-collection__product-subtitle">
                  {cake.subtitle}
                </span>

                <p>{cake.description}</p>

              </div>

              <div className="cake-collection__product-tags">

                {cake.notes.map((note) => (
                  <span key={note}>
                    {note}
                  </span>
                ))}

              </div>

              <div className="cake-collection__divider">
                <span />
                MAKE IT YOURS
                <span />
              </div>

              <div className="cake-collection__field">

                <div className="cake-collection__field-heading">

                  <span>
                    <i>01</i>
                    Choose Your Cake Size
                  </span>

                  <small>{size.label}</small>

                </div>

                <div
                  className="cake-collection__sizes"
                  role="group"
                  aria-label="Cake weight"
                >

                  {SIZES.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() =>
                        changeSize(item.id)
                      }
                      className={`cake-collection__size ${
                        selectedSize === item.id
                          ? 'is-active'
                          : ''
                      }`}
                      aria-pressed={
                        selectedSize === item.id
                      }
                    >

                      <span>
                        {item.label}
                      </span>

                      <small>
                        Rs. {formatPrice(
                          getSizePrice(
                            cake.price,
                            item.pounds
                          )
                        )}
                      </small>

                    </button>
                  ))}

                </div>

                <div className="cake-collection__custom-size">

                  <span className="cake-collection__custom-size-icon">
                    <WandSparkles size={20} />
                  </span>

                  <div className="cake-collection__custom-size-copy">

                    <strong>
                      Looking for a custom size?
                    </strong>

                    <p>
                      Other cake weights are available on
                      request. Contact our bakery for
                      availability and a personalized quote.
                    </p>

                  </div>

                  <span className="cake-collection__custom-size-badge">
                    MADE TO ORDER
                  </span>

                </div>

              </div>

              <div className="cake-collection__field">

                <div className="cake-collection__field-heading">

                  <span>
                    <i>02</i>
                    A Personal Message
                  </span>

                  <small>OPTIONAL</small>

                </div>

                <div className="cake-collection__message-field">

                  <input
                    id="cake-personal-message"
                    type="text"
                    maxLength={40}
                    value={cakeMessage}
                    placeholder="e.g. Happy Birthday, My Love!"
                    onChange={(event) =>
                      changeMessage(event.target.value)
                    }
                    aria-label="Personalized cake message"
                  />

                  <span>
                    {cakeMessage.length}/40
                  </span>

                </div>

                <p className="cake-collection__message-hint">
                  Your message is saved with your cake order.
                  Placement can be confirmed separately.
                </p>

              </div>

            </div>

            <div className="cake-collection__purchase">

              <div className="cake-collection__purchase-top">

                <div
                  className="cake-collection__price"
                  aria-live="polite"
                >

                  <span>
                    YOUR CAKE TOTAL
                  </span>

                  <strong>
                    Rs. {formatPrice(totalPrice)}
                  </strong>

                  <small>
                    {cake.name} · {size.label}
                    {quantity > 1
                      ? ` · Qty ${quantity}`
                      : ''}
                  </small>

                </div>

                <div className="cake-collection__quantity">

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    aria-label="Decrease cake quantity"
                  >
                    <Minus size={15} />
                  </button>

                  <output aria-live="polite">
                    {String(quantity).padStart(2, '0')}
                  </output>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= 10}
                    aria-label="Increase cake quantity"
                  >
                    <Plus size={15} />
                  </button>

                </div>

              </div>

              <button
                type="button"
                className={`cake-collection__add-button ${
                  isAdded ? 'is-added' : ''
                }`}
                onClick={handleAddToCart}
              >

                {isAdded ? (
                  <>
                    <Check size={18} />
                    ADDED TO YOUR BAG
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    ADD YOUR CAKE TO BAG
                    <ArrowUpRight size={18} />
                  </>
                )}

              </button>

              <div className="cake-collection__purchase-note">
                <Sparkles size={14} />
                A LITTLE CELEBRATION, MADE WITH LOVE.
              </div>

            </div>

          </div>

        </div>

        <div className="cake-collection__bottom">

          <span>
            THE SWEETEST MOMENTS DESERVE SOMETHING SPECIAL.
          </span>

          <span aria-hidden="true">
            ✳
          </span>

          <span>
            HANDCRAFTED AT CRUMB & CO.
          </span>

        </div>

      </div>
    </section>
  );
}

export default CakeCollection;

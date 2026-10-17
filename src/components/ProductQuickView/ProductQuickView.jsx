
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { createPortal } from 'react-dom';
import { gsap } from 'gsap';

import {
  ArrowUpRight,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';

import { useCart } from '../../context/CartContext';

import './ProductQuickView.scss';

const formatPrice = (amount) =>
  Number(amount || 0).toLocaleString('en-PK');

function ProductImage({ product }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [product.image]);

  return (
    <div className="quick-view__image">
      {!imageFailed && product.image ? (
        <img
          src={product.image}
          alt={product.name}
          draggable={false}
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span
          className="quick-view__fallback"
          role="img"
          aria-label={product.name}
        >
          {product.emoji || '🍰'}
        </span>
      )}
    </div>
  );
}

function ProductQuickView({ product, onClose }) {
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);

  const [selectedServingId, setSelectedServingId] =
    useState(product?.servings?.[0]?.id || null);

  const backdropRef = useRef(null);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const scrollRef = useRef(null);

  const hasServings = Boolean(product?.servings?.length);

  const selectedServing = hasServings
    ? product.servings.find(
        (item) => item.id === selectedServingId
      ) || product.servings[0]
    : null;

  const unitPrice =
    selectedServing?.price ?? product?.price ?? 0;

  const totalPrice = unitPrice * quantity;

  // Reset selected options when a different product opens.
  useEffect(() => {
    if (!product) return;

    setQuantity(1);

    setSelectedServingId(
      product.servings?.[0]?.id || null
    );

    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [product?.id]);

  // Lock page scrolling and handle keyboard accessibility.
  useEffect(() => {
    if (!product) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;

    document.body.style.overflow = 'hidden';

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (
        event.key !== 'Tab' ||
        !modalRef.current
      ) {
        return;
      }

      const focusable = Array.from(
        modalRef.current.querySelectorAll(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
        )
      );

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      const focusInside = modalRef.current.contains(
        document.activeElement
      );

      if (
        event.shiftKey &&
        (
          !focusInside ||
          document.activeElement === first
        )
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (
          !focusInside ||
          document.activeElement === last
        )
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);

      if (
        previousFocus?.isConnected &&
        typeof previousFocus.focus === 'function'
      ) {
        previousFocus.focus();
      }
    };
  }, [product, onClose]);

  // Preserve the original premium modal entrance animation.
  useLayoutEffect(() => {
    if (
      !product ||
      !modalRef.current ||
      !backdropRef.current
    ) {
      return;
    }

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        backdropRef.current,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.35,
          ease: 'power2.out',
        }
      );

      gsap.fromTo(
        modalRef.current,
        {
          y: 45,
          scale: 0.95,
          autoAlpha: 0,
        },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.55,
          ease: 'power3.out',
        }
      );
    });

    return () => context.revert();
  }, [product?.id]);

  if (!product || typeof document === 'undefined') {
    return null;
  }

  const decreaseQuantity = () => {
    setQuantity((previous) => Math.max(1, previous - 1));
  };

  const increaseQuantity = () => {
    setQuantity((previous) => Math.min(20, previous + 1));
  };

  const handleAddToBag = () => {
    let cartProduct = product;

    if (selectedServing) {
      const { servings, ...baseProduct } = product;

      cartProduct = {
        ...baseProduct,
        id: `${product.id}--${selectedServing.id}`,
        productId: product.id,
        originalName: product.name,
        price: selectedServing.price,
        serving: selectedServing.label,
        size: selectedServing.label,
        servingDetails: selectedServing.detail,
        customization: {
          serving: selectedServing.label,
          size: selectedServing.label,
          details: selectedServing.detail,
        },
      };
    }

    addToCart(cartProduct, quantity);
    onClose();
  };

  return createPortal(
    <div
      ref={backdropRef}
      className="quick-view__backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        ref={modalRef}
        className="quick-view"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        aria-describedby="quick-view-description"
        style={{
          '--quick-accent': product.accent || '#c88a52',
          '--quick-background': product.background || '#f3dec4',
        }}
      >
        {/* CLOSE BUTTON */}

        <button
          ref={closeButtonRef}
          type="button"
          className="quick-view__close"
          onClick={onClose}
          aria-label="Close product details"
        >
          <X size={21} />
        </button>

        {/* LEFT PRODUCT VISUAL */}

        <div className="quick-view__visual">
          <div className="quick-view__visual-orbit" />

          <div
            className="quick-view__visual-orbit quick-view__visual-orbit--inner"
          />

          <span className="quick-view__visual-label">
            <Sparkles size={14} />
            {product.badge || 'BAKED WITH LOVE'}
          </span>

          <ProductImage
            key={product.id}
            product={product}
          />

          <span
            className="quick-view__sparkle quick-view__sparkle--one"
            aria-hidden="true"
          >
            ✦
          </span>

          <span
            className="quick-view__sparkle quick-view__sparkle--two"
            aria-hidden="true"
          >
            ✳
          </span>

          <span className="quick-view__visual-caption">
            CRUMB & CO. / SWEET SELECTION
          </span>
        </div>

        {/* RIGHT PRODUCT PANEL */}

        <div className="quick-view__content">

          {/* SCROLLABLE PRODUCT INFORMATION */}

          <div
            ref={scrollRef}
            className="quick-view__scroll"
            tabIndex={0}
            aria-label="Product details and options"
          >
            <div className="quick-view__eyebrow">
              <span className="quick-view__eyebrow-dot" />

              {product.label ||
                product.category ||
                'FRESH BAKES'}
            </div>

            <h2
              id="quick-view-title"
              className="quick-view__title"
            >
              {product.name}
            </h2>

            <p
              id="quick-view-description"
              className="quick-view__description"
            >
              {product.description}
            </p>

            <div className="quick-view__highlight">
              <Sparkles size={17} />

              <span>
                {product.details ||
                  'A little moment of happiness in every bite.'}
              </span>
            </div>

            {/* SERVING SELECTION */}

            {hasServings && (
              <div className="quick-view__serving-section">
                <div className="quick-view__serving-heading">
                  <span>CHOOSE YOUR SERVING</span>

                  <small>
                    {selectedServing?.detail}
                  </small>
                </div>

                <div
                  className="quick-view__servings"
                  role="group"
                  aria-label="Select dessert serving"
                >
                  {product.servings.map((serving) => (
                    <button
                      type="button"
                      key={serving.id}
                      onClick={() =>
                        setSelectedServingId(serving.id)
                      }
                      className={`quick-view__serving-option ${
                        selectedServing?.id === serving.id
                          ? 'is-active'
                          : ''
                      }`}
                      aria-pressed={
                        selectedServing?.id === serving.id
                      }
                    >
                      <span className="quick-view__serving-name">
                        {serving.label}

                        {selectedServing?.id === serving.id && (
                          <Check size={13} />
                        )}
                      </span>

                      <small>
                        {serving.detail}
                      </small>

                      <strong>
                        Rs. {formatPrice(serving.price)}
                      </strong>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SELECTED ITEM PRICE */}

            <div className="quick-view__price-section">
              <div className="quick-view__price">
                <small>
                  {hasServings
                    ? 'SELECTED SERVING PRICE'
                    : 'PRICE PER ITEM'}
                </small>

                <strong>
                  Rs. {formatPrice(unitPrice)}
                </strong>
              </div>

              <span className="quick-view__price-note">
                MADE WITH LOVE ♡
              </span>
            </div>

            {/* QUANTITY CONTROLS */}

            <div className="quick-view__quantity-section">
              <div className="quick-view__quantity-heading">
                <span>CHOOSE YOUR QUANTITY</span>
                <small>MAX 20 ITEMS</small>
              </div>

              <div className="quick-view__quantity-controls">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={19} />
                </button>

                <output aria-live="polite">
                  {String(quantity).padStart(2, '0')}
                </output>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= 20}
                  aria-label="Increase quantity"
                >
                  <Plus size={19} />
                </button>
              </div>
            </div>
          </div>

          {/* ALWAYS-VISIBLE PURCHASE AREA */}

          <div className="quick-view__purchase">
            <div
              className="quick-view__order-summary"
              aria-live="polite"
            >
              <span>YOUR TOTAL</span>

              <strong>
                Rs. {formatPrice(totalPrice)}
              </strong>
            </div>

            <button
              type="button"
              className="quick-view__add-button"
              onClick={handleAddToBag}
            >
              <ShoppingBag size={19} />

              <span>ADD TO BAG</span>

              <ArrowUpRight size={19} />
            </button>

            <p className="quick-view__footer-note">
              A little treat, a lot of happiness.
            </p>
          </div>

        </div>
      </section>
    </div>,
    document.body
  );
}

export default ProductQuickView;

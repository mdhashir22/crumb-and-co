
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { createPortal } from 'react-dom';

import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { gsap } from 'gsap';

import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

import { useCart } from '../../context/CartContext';

import './CartDrawer.scss';

const formatPrice = (amount) =>
  Number(amount).toLocaleString('en-PK');

function CartProductImage({ item }) {
  const [imageFailed, setImageFailed] =
    useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [item.image]);

  return (
    <div
      className="cart-drawer__item-image"
      style={{
        '--item-background':
          item.background || '#f3e4d7',
      }}
    >
      {!imageFailed && item.image ? (
        <img
          src={item.image}
          alt={item.originalName || item.name}
          draggable={false}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span
          className="cart-drawer__item-fallback"
          role="img"
          aria-label={
            item.originalName || item.name
          }
        >
          <ShoppingBag
            size={24}
            strokeWidth={1.4}
          />
        </span>
      )}
    </div>
  );
}

function CartItem({ item }) {
  const {
    updateQuantity,
    removeFromCart,
  } = useCart();

  const customization = item.customization || {};

  const flavour =
    customization.flavour || item.flavour;

  const size =
    customization.size || item.size;

  const message =
    customization.message || item.message;

  const hasCustomization = Boolean(
    flavour || size || message
  );

  return (
    <article
      className="cart-drawer__item"
      style={{
        '--item-accent':
          item.accent || '#c88a52',
      }}
    >
      <CartProductImage item={item} />

      <div className="cart-drawer__item-info">

        <span className="cart-drawer__item-category">
          {item.category || 'FRESHLY BAKED'}
        </span>

        <h3>
          {item.originalName || item.name}
        </h3>

        {hasCustomization && (
          <div className="cart-drawer__item-customization">

            {flavour && (
              <span>
                Flavour: {flavour}
              </span>
            )}

            {size && (
  <span>
    {item.serving ? 'Serving' : 'Size'}: {size}
  </span>
)}

            {message && (
              <span className="cart-drawer__item-message">
                Message: "{message}"
              </span>
            )}

          </div>
        )}

        <span className="cart-drawer__item-unit-price">
          Rs. {formatPrice(item.price)} each
        </span>

        <div className="cart-drawer__item-bottom">

          <div
            className="cart-drawer__quantity"
            aria-label={`Quantity of ${item.name}`}
          >

            <button
              type="button"
              onClick={() =>
                updateQuantity(item.id, -1)
              }
              aria-label={`Decrease ${item.name} quantity`}
              title="Decrease quantity"
            >
              <Minus size={14} />
            </button>

            <output aria-live="polite">
              {String(item.quantity).padStart(2, '0')}
            </output>

            <button
              type="button"
              onClick={() =>
                updateQuantity(item.id, 1)
              }
              aria-label={`Increase ${item.name} quantity`}
              title="Increase quantity"
              disabled={item.quantity >= 20}
            >
              <Plus size={14} />
            </button>

          </div>

          <strong className="cart-drawer__item-total">
            Rs. {formatPrice(
              item.price * item.quantity
            )}
          </strong>

        </div>
      </div>

      <button
        type="button"
        className="cart-drawer__remove"
        onClick={() =>
          removeFromCart(item.id)
        }
        aria-label={`Remove ${item.name} from bag`}
        title="Remove product"
      >
        <Trash2 size={16} />
      </button>

    </article>
  );
}

function CartDrawer() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    cartItems,
    cartCount,
    subtotal,
    isCartOpen,
    closeCart,
    clearCart,
  } = useCart();

  const backdropRef = useRef(null);
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isCartOpen) return;

    const previousOverflow =
      document.body.style.overflow;

    const previousFocus =
      document.activeElement;

    document.body.style.overflow = 'hidden';

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        closeCart();
        return;
      }

      if (
        event.key !== 'Tab' ||
        !drawerRef.current
      ) {
        return;
      }

      const focusableElements = Array.from(
        drawerRef.current.querySelectorAll(
          'button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])'
        )
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement =
        focusableElements[0];

      const lastElement =
        focusableElements[
          focusableElements.length - 1
        ];

      const focusIsInside =
        drawerRef.current.contains(
          document.activeElement
        );

      if (
        event.shiftKey &&
        (
          !focusIsInside ||
          document.activeElement === firstElement
        )
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        (
          !focusIsInside ||
          document.activeElement === lastElement
        )
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        'keydown',
        handleKeyDown
      );

      if (
        previousFocus?.isConnected &&
        typeof previousFocus.focus === 'function'
      ) {
        previousFocus.focus();
      }
    };
  }, [isCartOpen, closeCart]);

  useLayoutEffect(() => {
    if (
      !isCartOpen ||
      !drawerRef.current ||
      !backdropRef.current
    ) {
      return;
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        backdropRef.current,
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
          duration: 0.4,
          ease: 'power2.out',
        }
      );

      gsap.fromTo(
        drawerRef.current,
        {
          xPercent: 105,
        },
        {
          xPercent: 0,
          duration: 0.7,
          ease: 'power3.out',
        }
      );

      gsap.fromTo(
        '.cart-drawer__animate',
        {
          y: 22,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.55,
          stagger: 0.07,
          delay: 0.22,
          ease: 'power3.out',
        }
      );
    }, drawerRef.current);

    return () => context.revert();
  }, [isCartOpen]);

  function handleExploreBakes() {
    closeCart();

    if (location.pathname !== '/') {
      navigate('/#fresh-bakes');
      return;
    }

    document
      .getElementById('fresh-bakes')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
  }

  function handleContinueShopping() {
    closeCart();

    if (location.pathname !== '/') {
      navigate('/#fresh-bakes');
    }
  }

  function handleProceedToCheckout() {
    if (cartItems.length === 0) return;

    closeCart();
    navigate('/checkout');
  }

  const drawerContent = isCartOpen ? (
    <div
      className="cart-drawer__backdrop"
      ref={backdropRef}
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          closeCart();
        }
      }}
    >
      <aside
        className="cart-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        aria-describedby="cart-drawer-description"
      >

        <header className="cart-drawer__header">

          <div className="cart-drawer__heading">

            <div className="cart-drawer__eyebrow">
              <Sparkles size={14} />
              YOUR LITTLE BAG OF JOY
            </div>

            <h2 id="cart-drawer-title">
              Your Bag
              <span>({cartCount})</span>
            </h2>

            <p id="cart-drawer-description">
              Sweet moments are just a bite away.
            </p>

          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="cart-drawer__close"
            onClick={closeCart}
            aria-label="Close shopping bag"
          >
            <X size={21} />
          </button>

        </header>

        <div className="cart-drawer__body">

          {cartItems.length === 0 ? (
            <div className="cart-drawer__empty">

              <div className="cart-drawer__empty-icon">
                <ShoppingBag
                  size={54}
                  strokeWidth={1.2}
                />

                <span aria-hidden="true">
                  ✦
                </span>
              </div>

              <span className="cart-drawer__empty-eyebrow">
                YOUR BAG IS WAITING
              </span>

              <h3>
                Nothing sweet
                <em>in here yet.</em>
              </h3>

              <p>
                Looks like your bag needs a little
                bakery happiness. Explore our fresh
                treats and pick your favourites.
              </p>

              <button
                type="button"
                className="cart-drawer__explore"
                onClick={handleExploreBakes}
              >
                EXPLORE OUR BAKES
                <ArrowRight size={17} />
              </button>

            </div>
          ) : (
            <>
              <div className="cart-drawer__items-top cart-drawer__animate">

                <span>
                  YOUR SWEET SELECTION
                </span>

                <span>
                  {String(cartCount).padStart(2, '0')}{' '}
                  {cartCount === 1
                    ? 'ITEM'
                    : 'ITEMS'}
                </span>

              </div>

              <div className="cart-drawer__items">

                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                  />
                ))}

              </div>

              <button
                type="button"
                className="cart-drawer__clear"
                onClick={clearCart}
              >
                <Trash2 size={14} />
                CLEAR SHOPPING BAG
              </button>

            </>
          )}

        </div>

        {cartItems.length > 0 && (
          <footer className="cart-drawer__footer">

            <div className="cart-drawer__footer-top">

              <span>
                SUBTOTAL
              </span>

              <strong>
                Rs. {formatPrice(subtotal)}
              </strong>

            </div>

            <p className="cart-drawer__shipping-note">
              Delivery charges are not included
              in the subtotal.
            </p>

            <button
              type="button"
              className="cart-drawer__checkout"
              onClick={handleProceedToCheckout}
              aria-label="Proceed to checkout"
            >
              <span>
                PROCEED TO CHECKOUT
              </span>

              <ArrowRight size={19} />
            </button>

            <button
              type="button"
              className="cart-drawer__continue"
              onClick={handleContinueShopping}
            >
              <ArrowLeft size={16} />
              CONTINUE SHOPPING
            </button>

            <div className="cart-drawer__footer-caption">
              MADE WITH LOVE ♡ CRUMB & CO.
            </div>

          </footer>
        )}

      </aside>
    </div>
  ) : null;

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    drawerContent,
    document.body
  );
}

export default CartDrawer;

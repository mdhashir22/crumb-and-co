
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CreditCard,
  Heart,
  LockKeyhole,
  MapPin,
  PackageCheck,
  Phone,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react';

import { useCart } from '../context/CartContext';

import './Checkout.scss';

const STORAGE_KEY = 'crumb-and-co-orders';

const formatPrice = (amount) =>
  Number(amount).toLocaleString('en-PK');

function generateOrderNumber() {
  const date = new Date();

  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('');

  const randomPart =
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 6).toUpperCase()
      : Math.random()
          .toString(36)
          .slice(2, 8)
          .toUpperCase();

  return `CC-${datePart}-${randomPart}`;
}

function CheckoutItem({ item }) {
  const customization = item.customization || {};

  const flavour =
    customization.flavour || item.flavour;

  const serving =
    customization.serving || item.serving;

  const size =
    customization.size || item.size;

  const message =
    customization.message || item.message;

  const servingDetails =
    customization.details || item.servingDetails;

  const hasCustomization = Boolean(
    flavour || serving || size || message
  );

  return (
    <div className="crumb-checkout__item">

      <div
        className="crumb-checkout__item-image"
        style={{
          background:
            item.background || '#f5e8dc',
        }}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.originalName || item.name}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <ShoppingBag size={25} />
        )}

        <span className="crumb-checkout__item-quantity">
          {item.quantity}
        </span>
      </div>

      <div className="crumb-checkout__item-info">

        <span>
          {item.category || 'FRESH BAKES'}
        </span>

        <h3>
          {item.originalName || item.name}
        </h3>

        {hasCustomization && (
          <div className="crumb-checkout__item-options">

            {flavour && (
              <span>
                Flavour: {flavour}
              </span>
            )}

            {serving ? (
              <span>
                Serving: {serving}
              </span>
            ) : (
              size && (
                <span>
                  Size: {size}
                </span>
              )
            )}

            {servingDetails && (
              <span>
                {servingDetails}
              </span>
            )}

            {message && (
              <span className="crumb-checkout__item-message">
                Message: "{message}"
              </span>
            )}

          </div>
        )}

        <small>
          Rs. {formatPrice(item.price)}
          {' × '}
          {item.quantity}
        </small>

      </div>

      <strong>
        Rs. {formatPrice(
          item.price * item.quantity
        )}
      </strong>

    </div>
  );
}

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    subtotal,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    area: '',
    address: '',
    instructions: '',
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState('');

  const [confirmedOrder, setConfirmedOrder] =
    useState(null);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError('');
    }
  }

  function returnToBakery() {
    navigate('/#fresh-bakes');
  }

  function handlePlaceOrder(event) {
    event.preventDefault();

    if (
      isSubmitting ||
      cartItems.length === 0
    ) {
      return;
    }

    setError('');

    const customer = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.replace(
        /[\s-]/g,
        ''
      ),
      email: formData.email.trim(),
      city: formData.city.trim(),
      area: formData.area.trim(),
      address: formData.address.trim(),
      instructions:
        formData.instructions.trim(),
    };

    if (
      !customer.fullName ||
      !customer.city ||
      !customer.area ||
      !customer.address
    ) {
      setError(
        'Please complete all required delivery details.'
      );
      return;
    }

    if (!/^03\d{9}$/.test(customer.phone)) {
      setError(
        'Please enter a valid 11-digit Pakistani mobile number.'
      );
      return;
    }

    setIsSubmitting(true);

    const order = {
      id: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      status: 'Saved Locally',
      paymentMethod: 'Cash on Delivery',
      customer,
      items: cartItems.map((item) => ({
        ...item,
        lineTotal:
          item.price * item.quantity,
      })),
      itemCount: cartCount,
      subtotal,
      deliveryFee: null,
      savedInBrowser: true,
    };

    try {
      const existingOrders = JSON.parse(
        window.localStorage.getItem(
          STORAGE_KEY
        ) || '[]'
      );

      const orders = Array.isArray(
        existingOrders
      )
        ? existingOrders
        : [];

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([
          order,
          ...orders,
        ])
      );

      setConfirmedOrder(order);

      clearCart();

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (saveError) {
      console.error(
        'Unable to save order:',
        saveError
      );

      setError(
        'Your order could not be saved. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (confirmedOrder) {
    return (
      <main className="crumb-checkout crumb-checkout--success">

        <div className="crumb-checkout__success">

          <div className="crumb-checkout__success-icon">
            <PackageCheck
              size={42}
              strokeWidth={1.5}
            />
          </div>

          <span className="crumb-checkout__eyebrow">
            <Sparkles size={14} />
            SWEET MOMENTS START HERE
          </span>

          <h1>
            Order Confirmed.
            <em>Sweet Moments Ahead!</em>
          </h1>

          <p className="crumb-checkout__success-description">
            Your order details have been saved
            successfully in this browser.
            Keep your order number for reference.
          </p>

          <div className="crumb-checkout__confirmation">

            <div>
              <span>ORDER NUMBER</span>
              <strong>
                {confirmedOrder.id}
              </strong>
            </div>

            <div>
              <span>PAYMENT METHOD</span>
              <strong>
                Cash on Delivery
              </strong>
            </div>

            <div>
              <span>ITEMS ORDERED</span>
              <strong>
                {confirmedOrder.itemCount}
              </strong>
            </div>

            <div>
              <span>ITEMS SUBTOTAL</span>
              <strong>
                Rs. {formatPrice(
                  confirmedOrder.subtotal
                )}
              </strong>
            </div>

          </div>


<p className="crumb-checkout__local-notice">
  Your sweet order is all set! We've saved your
  selections and created a special order reference
  just for you. Keep your order number handy,
  and thank you for choosing CRUMB & CO.
</p>


          <div className="crumb-checkout__success-note">
            <Heart size={17} />
            Made with love. Baked for happiness.
          </div>

          <button
            type="button"
            className="crumb-checkout__primary-button"
            onClick={returnToBakery}
          >
            BACK TO OUR BAKERY
            <ArrowRight size={19} />
          </button>

        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="crumb-checkout crumb-checkout--empty">

        <div className="crumb-checkout__empty">

          <ShoppingBag
            size={55}
            strokeWidth={1.3}
          />

          <span className="crumb-checkout__eyebrow">
            YOUR SWEET JOURNEY
          </span>

          <h1>
            Your Bag
            <em>Is Feeling Empty.</em>
          </h1>

          <p>
            Add some delicious bakery treats
            before heading to checkout.
          </p>

          <button
            type="button"
            className="crumb-checkout__primary-button"
            onClick={returnToBakery}
          >
            EXPLORE OUR BAKES
            <ArrowRight size={18} />
          </button>

        </div>

      </main>
    );
  }

  return (
    <main className="crumb-checkout">

      <div className="crumb-checkout__container">

        <header className="crumb-checkout__header">

          <button
            type="button"
            className="crumb-checkout__back"
            onClick={returnToBakery}
          >
            <ArrowLeft size={17} />
            CONTINUE SHOPPING
          </button>

          <div className="crumb-checkout__heading">

            <div className="crumb-checkout__eyebrow">
              <Sparkles size={15} />
              ALMOST THERE, SWEET THING
            </div>

            <h1>
              Your Sweet
              <em>Checkout.</em>
            </h1>

            <p>
              Just a few little details before
              saving your bakery favourites.
            </p>

          </div>

          <div className="crumb-checkout__steps">

            <span className="is-complete">
              <Check size={13} />
              YOUR BAG
            </span>

            <span className="crumb-checkout__step-line" />

            <span className="is-active">
              02
              DELIVERY DETAILS
            </span>

            <span className="crumb-checkout__step-line" />

            <span>
              03
              CONFIRMATION
            </span>

          </div>

        </header>

        <div className="crumb-checkout__layout">

          <form
            className="crumb-checkout__form"
            onSubmit={handlePlaceOrder}
          >

            <section className="crumb-checkout__panel">

              <div className="crumb-checkout__panel-heading">

                <div className="crumb-checkout__panel-icon">
                  <Phone size={20} />
                </div>

                <div>
                  <span>STEP 01</span>
                  <h2>Contact Details</h2>
                  <p>How can we reach you?</p>
                </div>

              </div>

              <div className="crumb-checkout__fields">

                <div className="crumb-checkout__field">

                  <label htmlFor="checkout-name">
                    FULL NAME *
                  </label>

                  <input
                    id="checkout-name"
                    name="fullName"
                    type="text"
                    placeholder="Your full name"
                    autoComplete="name"
                    minLength={2}
                    maxLength={100}
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />

                </div>

                <div className="crumb-checkout__field">

                  <label htmlFor="checkout-phone">
                    MOBILE NUMBER *
                  </label>

                  <input
                    id="checkout-phone"
                    name="phone"
                    type="tel"
                    placeholder="03XXXXXXXXX"
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={13}
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />

                </div>

                <div className="crumb-checkout__field crumb-checkout__field--full">

                  <label htmlFor="checkout-email">
                    EMAIL ADDRESS (OPTIONAL)
                  </label>

                  <input
                    id="checkout-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    maxLength={150}
                    value={formData.email}
                    onChange={handleInputChange}
                  />

                </div>

              </div>

            </section>

            <section className="crumb-checkout__panel">

              <div className="crumb-checkout__panel-heading">

                <div className="crumb-checkout__panel-icon">
                  <MapPin size={20} />
                </div>

                <div>
                  <span>STEP 02</span>
                  <h2>Delivery Address</h2>
                  <p>Where should your treats go?</p>
                </div>

              </div>

              <div className="crumb-checkout__fields">

                <div className="crumb-checkout__field">

                  <label htmlFor="checkout-city">
                    CITY *
                  </label>

                  <input
                    id="checkout-city"
                    name="city"
                    type="text"
                    placeholder="e.g. Karachi"
                    autoComplete="address-level2"
                    maxLength={80}
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />

                </div>

                <div className="crumb-checkout__field">

                  <label htmlFor="checkout-area">
                    AREA / LOCALITY *
                  </label>

                  <input
                    id="checkout-area"
                    name="area"
                    type="text"
                    placeholder="e.g. Gulshan-e-Iqbal"
                    autoComplete="address-level3"
                    maxLength={100}
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                  />

                </div>

                <div className="crumb-checkout__field crumb-checkout__field--full">

                  <label htmlFor="checkout-address">
                    COMPLETE DELIVERY ADDRESS *
                  </label>

                  <textarea
                    id="checkout-address"
                    name="address"
                    rows={3}
                    placeholder="House or flat number, street, building..."
                    autoComplete="street-address"
                    maxLength={350}
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />

                </div>

                <div className="crumb-checkout__field crumb-checkout__field--full">

                  <label htmlFor="checkout-instructions">
                    DELIVERY INSTRUCTIONS (OPTIONAL)
                  </label>

                  <textarea
                    id="checkout-instructions"
                    name="instructions"
                    rows={2}
                    placeholder="Any special instructions?"
                    maxLength={300}
                    value={formData.instructions}
                    onChange={handleInputChange}
                  />

                </div>

              </div>

            </section>

            <section className="crumb-checkout__panel">

              <div className="crumb-checkout__panel-heading">

                <div className="crumb-checkout__panel-icon">
                  <CreditCard size={20} />
                </div>

                <div>
                  <span>STEP 03</span>
                  <h2>Payment Method</h2>
                  <p>Simple, easy and convenient.</p>
                </div>

              </div>

              <div className="crumb-checkout__payment">

                <div className="crumb-checkout__payment-radio">
                  <span />
                </div>

                <div className="crumb-checkout__payment-text">

                  <strong>
                    CASH ON DELIVERY
                  </strong>

                  <small>
                    Selected payment preference.
                  </small>

                </div>

                <BadgeCheck size={21} />

              </div>

              <p className="crumb-checkout__payment-note">
                <LockKeyhole size={14} />
                No payment is collected or processed.
              </p>

            </section>

            {error && (
              <p
                className="crumb-checkout__error"
                role="alert"
              >
                {error}
              </p>
            )}

            <div className="crumb-checkout__submit-area">

              <button
                type="submit"
                className="crumb-checkout__primary-button"
                disabled={isSubmitting}
              >
                <ShoppingBag size={19} />

                {isSubmitting
                  ? 'SAVING YOUR ORDER...'
                  : 'PLACE ORDER'}

                <ArrowRight size={19} />
              </button>

              <p>
                Your order details will be saved
                in this browser only. No order
                will be transmitted to the bakery.
              </p>

            </div>

          </form>

          <aside className="crumb-checkout__summary">

            <div className="crumb-checkout__summary-header">

              <div>
                <span>YOUR LITTLE BAG OF JOY</span>
                <h2>Order Summary</h2>
              </div>

              <ShoppingBag size={22} />

            </div>

            <div className="crumb-checkout__summary-items">

              {cartItems.map((item) => (
                <CheckoutItem
                  key={item.id}
                  item={item}
                />
              ))}

            </div>

            <div className="crumb-checkout__summary-totals">

              <div>
                <span>
                  Items ({cartCount})
                </span>

                <strong>
                  Rs. {formatPrice(subtotal)}
                </strong>
              </div>

              <div>
                <span>
                  Delivery charges
                </span>

                <span>
                  Not calculated
                </span>
              </div>

            </div>

            <div className="crumb-checkout__summary-total">

              <span>
                ITEMS SUBTOTAL
              </span>

              <strong>
                Rs. {formatPrice(subtotal)}
              </strong>

            </div>

            <p className="crumb-checkout__summary-disclaimer">
              Delivery charges are not included.
              This amount is the selected products'
              subtotal only.
            </p>

            <div className="crumb-checkout__summary-note">

              <Truck size={21} />

              <div>
                <strong>
                  Freshly baked with love
                </strong>

                <p>
                  A little sweetness for every moment.
                </p>
              </div>

            </div>

            <div className="crumb-checkout__summary-footer">
              <Heart size={15} />
              HAPPINESS, FRESHLY BAKED.
            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}

export default Checkout;

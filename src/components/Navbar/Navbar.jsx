
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Link,
  useLocation,
} from 'react-router-dom';

import {
  ArrowUpRight,
  Menu,
  ShoppingBag,
  X,
} from 'lucide-react';

import { useCart } from '../../context/CartContext';

import './Navbar.scss';

const navigation = [
  {
    id: 'nav-home',
    label: 'Home',
    to: '/#nav-home',
  },
  {
    id: 'nav-bakes',
    label: 'Our Bakes',
    to: '/#nav-bakes',
  },
  {
    id: 'nav-croissant',
    label: 'Croissant Journey',
    to: '/#nav-croissant',
  },
  {
    id: 'nav-lab',
    label: 'Bake Lab',
    to: '/#nav-lab',
  },
  {
    id: 'nav-cakes',
    label: 'Cakes',
    to: '/#nav-cakes',
  },
  {
    id: 'nav-story',
    label: 'Our Story',
    to: '/#nav-story',
  },
  {
    id: 'nav-love',
    label: 'Customer Love',
    to: '/#nav-love',
  },
  {
    id: 'nav-contact',
    label: 'Contact',
    to: '/#nav-contact',
  },
];

function Navbar() {
  const location = useLocation();
  const navbarRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(
    'nav-home'
  );
  const [isScrolled, setIsScrolled] = useState(false);

  const { cartCount, openCart } = useCart();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    let frame = null;

    function updateNavigation() {
      frame = null;

      const scrollTop = window.scrollY;

      setIsScrolled(scrollTop > 15);

      if (location.pathname !== '/') {
        return;
      }

      const offset =
        (navbarRef.current?.offsetHeight || 88) + 85;

      let currentSection = 'nav-home';

      for (const item of navigation) {
        const element = document.getElementById(item.id);

        if (!element) continue;

        const elementTop =
          element.getBoundingClientRect().top +
          window.scrollY;

        if (scrollTop + offset >= elementTop) {
          currentSection = item.id;
        }
      }

      setActiveSection((previous) =>
        previous === currentSection
          ? previous
          : currentSection
      );
    }

    function onScroll() {
      if (frame !== null) return;

      frame = window.requestAnimationFrame(
        updateNavigation
      );
    }

    updateNavigation();

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);

      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }

    function handleOutsideClick(event) {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    function handleResize() {
      if (window.innerWidth > 1240) {
        setMenuOpen(false);
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    document.addEventListener(
      'pointerdown',
      handleOutsideClick
    );

    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );

      document.removeEventListener(
        'pointerdown',
        handleOutsideClick
      );

      window.removeEventListener(
        'resize',
        handleResize
      );
    };
  }, [menuOpen]);

  function handleNavigate(event, item) {
    setMenuOpen(false);
    setActiveSection(item.id);

    if (
      location.pathname === '/' &&
      location.hash === `#${item.id}`
    ) {
      event.preventDefault();

      document.getElementById(item.id)
        ?.scrollIntoView({
          behavior: window.matchMedia(
            '(prefers-reduced-motion: reduce)'
          ).matches
            ? 'auto'
            : 'smooth',
          block: 'start',
        });
    }
  }

  function handleOpenCart() {
    setMenuOpen(false);
    openCart();
  }

  return (
    <header
      ref={navbarRef}
      className={`crumb-navbar ${
        isScrolled ? 'is-scrolled' : ''
      }`}
    >
      <div className="crumb-navbar__inner">

        <Link
          to="/#nav-home"
          className="crumb-navbar__logo"
          onClick={(event) =>
            handleNavigate(event, navigation[0])
          }
          aria-label="CRUMB & CO. Home"
        >
          crumb<span>&</span>co.
          <small>BAKED WITH LOVE</small>
        </Link>

        <nav
          id="crumb-navbar-navigation"
          className={`crumb-navbar__links ${
            menuOpen ? 'is-open' : ''
          }`}
          aria-label="Main navigation"
        >
          <div className="crumb-navbar__mobile-heading">
            <span>EXPLORE CRUMB & CO.</span>
            <span>01 — 08</span>
          </div>

          {navigation.map((item, index) => (
            <Link
              key={item.id}
              to={item.to}
              className={`crumb-navbar__link ${
                location.pathname === '/' &&
                activeSection === item.id
                  ? 'is-active'
                  : ''
              }`}
              aria-current={
                location.pathname === '/' &&
                activeSection === item.id
                  ? 'location'
                  : undefined
              }
              onClick={(event) =>
                handleNavigate(event, item)
              }
            >
              <span className="crumb-navbar__link-number">
                {String(index + 1).padStart(2, '0')}
              </span>

              <span className="crumb-navbar__link-label">
                {item.label}
              </span>

              <ArrowUpRight
                className="crumb-navbar__link-arrow"
                size={16}
                aria-hidden="true"
              />
            </Link>
          ))}

          <div className="crumb-navbar__mobile-bottom">
            <span>A LITTLE SWEETNESS, A LOT OF LOVE.</span>
          </div>

        </nav>

        <div className="crumb-navbar__actions">

          <Link
            to="/#nav-bakes"
            className="crumb-navbar__shop"
            onClick={(event) =>
              handleNavigate(event, navigation[1])
            }
          >
            EXPLORE MENU
            <ArrowUpRight size={16} />
          </Link>

          <button
            type="button"
            className="crumb-navbar__bag"
            onClick={handleOpenCart}
            aria-label={`Open shopping bag, ${cartCount} ${
              cartCount === 1 ? 'item' : 'items'
            }`}
            title={`Your Bag (${cartCount})`}
          >
            <ShoppingBag
              size={20}
              strokeWidth={1.8}
            />

            <i
              key={cartCount}
              aria-hidden="true"
            >
              {cartCount > 99 ? '99+' : cartCount}
            </i>
          </button>

          <button
            type="button"
            className="crumb-navbar__toggle"
            aria-label={
              menuOpen
                ? 'Close navigation'
                : 'Open navigation'
            }
            aria-expanded={menuOpen}
            aria-controls="crumb-navbar-navigation"
            onClick={() =>
              setMenuOpen((previous) => !previous)
            }
          >
            {menuOpen ? (
              <X size={23} strokeWidth={1.7} />
            ) : (
              <Menu size={23} strokeWidth={1.7} />
            )}
          </button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;

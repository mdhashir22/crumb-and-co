
import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Clock3,
  Heart,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';

import './Footer.scss';

gsap.registerPlugin(ScrollTrigger);


const navigation = [
  { label: 'Home', to: '/#nav-home' },
  { label: 'Our Bakes', to: '/#nav-bakes' },
  { label: 'Croissant Journey', to: '/#nav-croissant' },
  { label: 'Bake Lab', to: '/#nav-lab' },
  { label: 'Signature Cakes', to: '/#nav-cakes' },
  { label: 'Our Story', to: '/#nav-story' },
  { label: 'Customer Love', to: '/#nav-love' },
  { label: 'Contact', to: '/#nav-contact' },
];


const contactEmail = 'hashir03189006264@gmail.com';

function Footer() {
  const footerRef = useRef(null);

  const currentYear = new Date().getFullYear();

  useLayoutEffect(() => {
    const footer = footerRef.current;

    if (!footer) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        '.site-footer__reveal',
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.11,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 85%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.site-footer__brand-name',
        {
          opacity: 0,
          yPercent: 30,
        },
        {
          opacity: 1,
          yPercent: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.site-footer__brand-stage',
            start: 'top 92%',
            once: true,
          },
        }
      );
    }, footer);

    return () => context.revert();
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
        ? 'instant'
        : 'smooth',
    });
  }

  return (
    <footer
      className="site-footer"
      id="site-footer"
      ref={footerRef}
      aria-label="CRUMB & CO. footer"
    >
      <div className="site-footer__container">

        <div className="site-footer__top">

          <div className="site-footer__invitation site-footer__reveal">

            <span className="site-footer__eyebrow">
              <Sparkles size={16} />
              SOMETHING SWEET AWAITS
            </span>

            <h2>
              Life is better
              <em>with a little sweetness.</em>
            </h2>

            <p>
              Beautiful bakes, thoughtful details,
              and little moments worth sharing.
            </p>

            <Link
              to="/#fresh-bakes"
              className="site-footer__shop-link"
            >
              <span>
                EXPLORE OUR BAKES
              </span>

              <span className="site-footer__shop-arrow">
                <ArrowUpRight size={19} />
              </span>
            </Link>

          </div>

          <div className="site-footer__signature-card site-footer__reveal">

            <div className="site-footer__signature-top">
              <span>THE LITTLE THINGS MATTER</span>
              <Heart size={20} strokeWidth={1.5} />
            </div>

            <div className="site-footer__signature-art">
              <span aria-hidden="true">✳</span>
            </div>

            <p>
              Freshly imagined.
              <br />
              Thoughtfully made.
              <br />
              Always with love.
            </p>

            <div className="site-footer__signature-bottom">
              <span>CRUMB & CO.</span>
              <ArrowDownRight size={18} />
            </div>

          </div>

        </div>

        <div className="site-footer__links-grid">

          <div className="site-footer__about site-footer__reveal">

            <Link
              to="/"
              className="site-footer__small-logo"
              aria-label="CRUMB & CO. homepage"
            >
              crumb<span>&</span>co.
            </Link>

            <span className="site-footer__logo-caption">
              BAKED WITH LOVE
            </span>

            <p>
              A little corner of sweetness,
              crafted for everyday treats
              and beautiful celebrations.
            </p>

          </div>

          <nav
            className="site-footer__navigation site-footer__reveal"
            aria-label="Footer navigation"
          >

            <h3>EXPLORE</h3>

            <div className="site-footer__nav-links">

              {navigation.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                >
                  {item.label}
                  <ArrowUpRight size={14} />
                </Link>
              ))}

            </div>

          </nav>

          <div className="site-footer__contact site-footer__reveal">

            <h3>SAY HELLO</h3>

            <a
              href={`mailto:${contactEmail}`}
              className="site-footer__email"
            >
              {contactEmail}
              <ArrowUpRight size={16} />
            </a>

            <div className="site-footer__contact-detail">
              <MapPin size={16} />
              <span>Karachi, Pakistan</span>
            </div>

            <div className="site-footer__contact-detail">
              <Clock3 size={16} />
              <span>10:00 AM – 12:00 PM</span>
            </div>

            <Link
              to="/#contact"
              className="site-footer__enquiry-link"
            >
              SEND AN ENQUIRY
              <ArrowRight size={16} />
            </Link>

          </div>

        </div>

        <div className="site-footer__brand-stage">
          <div className="site-footer__brand-name">
            CRUMB<span>&</span>CO.
          </div>

          <div className="site-footer__brand-subline">
            <span>BAKED WITH LOVE.</span>

            <span aria-hidden="true">✳</span>

            <span>MADE FOR THE SWEETEST MOMENTS.</span>
          </div>
        </div>

        <div className="site-footer__bottom">

          <span>
            © {currentYear} CRUMB & CO. ALL RIGHTS RESERVED.
          </span>

          <span className="site-footer__bottom-heart">
            MADE WITH <Heart size={13} fill="currentColor" /> LOVE
          </span>

          <button
            type="button"
            className="site-footer__back-top"
            onClick={scrollToTop}
          >
            BACK TO TOP

            <span>
              <ArrowUp size={17} />
            </span>
          </button>

        </div>

      </div>
    </footer>
  );
}

export default Footer;

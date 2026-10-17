
import {
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  AlertCircle,
  ArrowUpRight,
  CakeSlice,
  Check,
  Clock3,
  GamepadDirectional,
  Heart,
  LoaderCircle,
  MapPin,
  MessageCircleHeart,
  Send,
  Sparkles,
} from 'lucide-react';

import './Contact.scss';

gsap.registerPlugin(ScrollTrigger);

const businessDetails = {
  address: 'Karachi, Pakistan',
  openingHours: '10:00 AM – 12:00 PM',
  email: 'hashir03189006264@gmail.com',
};

const enquiryTypes = [
  'Signature Cake Order',
  'Custom Cake Enquiry',
  'Bakery Products',
  'Special Occasion',
  'Something Else',
];

const initialForm = {
  name: '',
  email: '',
  type: '',
  date: '',
  message: '',
};

const ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim();

function Contact() {
  const sectionRef = useRef(null);
  const honeypotRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [isSending, setIsSending] = useState(false);

  const [sendStatus, setSendStatus] = useState({
    type: '',
    message: '',
  });

  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (sendStatus.type) {
      setSendStatus({
        type: '',
        message: '',
      });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSending) return;

    setSendStatus({
      type: '',
      message: '',
    });

    if (
      !ACCESS_KEY ||
      ACCESS_KEY === 'PASTE_YOUR_ACCESS_KEY_HERE'
    ) {
      setSendStatus({
        type: 'error',
        message:
          'Email service is not configured yet. Please add your Web3Forms access key.',
      });

      return;
    }

    if (honeypotRef.current?.value) {
      return;
    }

    setIsSending(true);

    const submission = {
      access_key: ACCESS_KEY,
      subject: `CRUMB & CO. — ${form.type}`,
      from_name: 'CRUMB & CO. Website',
      name: form.name.trim(),
      email: form.email.trim(),
      enquiry_type: form.type,
      preferred_date: form.date || 'Not specified',
      message: form.message.trim(),
      botcheck: '',
    };

    try {
      const response = await fetch(
        'https://api.web3forms.com/submit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(submission),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            'Unable to submit your enquiry.'
        );
      }

      setSendStatus({
        type: 'success',
        message:
          'Your enquiry has been submitted successfully. Thank you for getting in touch!',
      });

      setForm(initialForm);
    } catch (error) {
      console.error(
        'Contact form submission failed:',
        error
      );

      setSendStatus({
        type: 'error',
        message:
          'Your enquiry could not be sent. Please try again in a moment.',
      });
    } finally {
      setIsSending(false);
    }
  }

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        '.contact-visit__reveal',
        {
          opacity: 0,
          y: 42,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.contact-visit__field',
        {
          opacity: 0,
          y: 18,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.085,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.contact-visit__form-card',
            start: 'top 85%',
            once: true,
          },
        }
      );

      gsap.to('.contact-visit__ornament', {
        rotation: 140,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      id="contact"
      className="contact-visit"
      ref={sectionRef}
      aria-labelledby="contact-visit-heading"
    >
      <div className="contact-visit__container">

        <header className="contact-visit__heading">

          <div className="contact-visit__heading-main contact-visit__reveal">

            <span className="contact-visit__eyebrow">
              <Sparkles size={15} />
              A LITTLE NOTE FROM YOU
              <span className="contact-visit__eyebrow-line" />
              008
            </span>

            <h2 id="contact-visit-heading">
              Let's make
              <em>something sweet happen.</em>
            </h2>

          </div>

          <p className="contact-visit__heading-copy contact-visit__reveal">
            Celebrating something special? Have a
            lovely little idea? We'd love to hear
            what's on your mind.
          </p>

        </header>

        <div className="contact-visit__workspace">

          <div className="contact-visit__editorial contact-visit__reveal">

            <div className="contact-visit__editorial-top">
              <span>CRUMB & CO. / SAY HELLO</span>
              <Heart size={19} strokeWidth={1.4} />
            </div>

            <div className="contact-visit__editorial-orbit contact-visit__editorial-orbit--one" />
            <div className="contact-visit__editorial-orbit contact-visit__editorial-orbit--two" />

            <div className="contact-visit__editorial-content">

              <div
                className="contact-visit__ornament"
                aria-hidden="true"
              >
                ✳
              </div>

              <span className="contact-visit__editorial-kicker">
                FOR ALL THINGS SWEET
              </span>

              <h3>
                A little
                <em>hello goes</em>
                a long way.
              </h3>

              <p>
                From a thoughtful cake to a box of
                freshly baked happiness, every lovely
                idea starts with a conversation.
              </p>

              <div className="contact-visit__editorial-signature">
                <span />
                MADE WITH LOVE, ALWAYS.
              </div>

            </div>

            <div className="contact-visit__editorial-bottom">

              <div className="contact-visit__editorial-emblem">
                <CakeSlice size={25} strokeWidth={1.3} />
              </div>

              <div>
                <strong>SWEET MOMENTS AWAIT</strong>
                <span>CRUMB & CO. — BAKED WITH LOVE</span>
              </div>

              <ArrowUpRight size={20} strokeWidth={1.5} />

            </div>

          </div>

          <div className="contact-visit__form-card contact-visit__reveal">

            <div className="contact-visit__form-top">

              <span>
                <MessageCircleHeart size={17} />
                WRITE US A LITTLE NOTE
              </span>

              <span>01 / 01</span>

            </div>

            <div className="contact-visit__form-content">

              <span className="contact-visit__form-kicker">
                WE'D LOVE TO HEAR FROM YOU
              </span>

              <h3>
                Tell us your
                <em>sweet little idea.</em>
              </h3>

              <p className="contact-visit__form-description">
                Share a few details and send
                your enquiry directly to our inbox.
              </p>

              <form onSubmit={handleSubmit}>

                <input
                  ref={honeypotRef}
                  type="text"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: '-9999px',
                  }}
                />

                <div className="contact-visit__form-grid">

                  <div className="contact-visit__field">

                    <label htmlFor="contact-name">
                      YOUR NAME <span>*</span>
                    </label>

                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      autoComplete="name"
                      maxLength={80}
                      value={form.name}
                      onChange={updateField}
                      disabled={isSending}
                      required
                    />

                  </div>

                  <div className="contact-visit__field">

                    <label htmlFor="contact-email">
                      EMAIL ADDRESS <span>*</span>
                    </label>

                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      maxLength={150}
                      value={form.email}
                      onChange={updateField}
                      disabled={isSending}
                      required
                    />

                  </div>

                  <div className="contact-visit__field">

                    <label htmlFor="contact-type">
                      WHAT'S THE OCCASION? <span>*</span>
                    </label>

                    <select
                      id="contact-type"
                      name="type"
                      value={form.type}
                      onChange={updateField}
                      disabled={isSending}
                      required
                    >
                      <option value="" disabled>
                        Select an enquiry type
                      </option>

                      {enquiryTypes.map((type) => (
                        <option
                          key={type}
                          value={type}
                        >
                          {type}
                        </option>
                      ))}
                    </select>

                  </div>

                  <div className="contact-visit__field">

                    <label htmlFor="contact-date">
                      PREFERRED DATE
                      <small>OPTIONAL</small>
                    </label>

                    <input
                      id="contact-date"
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={updateField}
                      disabled={isSending}
                    />

                  </div>

                  <div className="contact-visit__field contact-visit__field--full">

                    <label htmlFor="contact-message">
                      YOUR MESSAGE <span>*</span>
                    </label>

                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      placeholder="Tell us a little about what you have in mind..."
                      maxLength={1000}
                      value={form.message}
                      onChange={updateField}
                      disabled={isSending}
                      required
                    />

                    <span className="contact-visit__character-count">
                      {form.message.length} / 1000
                    </span>

                  </div>

                </div>

                <button
                  className="contact-visit__submit"
                  type="submit"
                  disabled={isSending}
                >
                  <span>

                    {isSending ? (
                      <>
                        <LoaderCircle
                          size={17}
                          className="contact-visit__spinner"
                        />
                        SENDING YOUR ENQUIRY...
                      </>
                    ) : (
                      <>
                        <Send size={17} />
                        SEND YOUR ENQUIRY
                      </>
                    )}

                  </span>

                  <span className="contact-visit__submit-arrow">

                    {isSending ? (
                      <LoaderCircle
                        size={18}
                        className="contact-visit__spinner"
                      />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}

                  </span>

                </button>

              </form>

              {sendStatus.type && (
                <div
                  className={`contact-visit__prepared ${
                    sendStatus.type === 'error'
                      ? 'contact-visit__prepared--error'
                      : ''
                  }`}
                  role="status"
                  aria-live="polite"
                >

                  <div className="contact-visit__prepared-heading">

                    {sendStatus.type === 'success' ? (
                      <Check size={19} />
                    ) : (
                      <AlertCircle size={19} />
                    )}

                    <strong>
                      {sendStatus.type === 'success'
                        ? 'Enquiry submitted!'
                        : 'Something went wrong'}
                    </strong>

                  </div>

                  <p>{sendStatus.message}</p>

                </div>
              )}

              <div className="contact-visit__form-note">
                <Heart size={14} />
                THOUGHTFULLY MADE FOR THE SWEETEST MOMENTS.
              </div>

            </div>

          </div>

        </div>

        <div className="contact-visit__info-grid">

          <div className="contact-visit__info-item">

            <span className="contact-visit__info-icon">
              <MapPin size={21} strokeWidth={1.5} />
            </span>

            <div>
              <span className="contact-visit__info-label">
                FIND OUR BAKERY
              </span>

              <h4>Visit & Say Hello</h4>

              <p>
                {businessDetails.address ||
                  'Location details coming soon.'}
              </p>
            </div>

          </div>

          <div className="contact-visit__info-item">

            <span className="contact-visit__info-icon">
              <Clock3 size={21} strokeWidth={1.5} />
            </span>

            <div>
              <span className="contact-visit__info-label">
                PLAN YOUR VISIT
              </span>

              <h4>Opening Hours</h4>

              <p>{businessDetails.openingHours}</p>
            </div>

          </div>

          <div className="contact-visit__info-item">

            <span className="contact-visit__info-icon">
              <Send size={21} strokeWidth={1.5} />
            </span>

            <div>
              <span className="contact-visit__info-label">
                KEEP IN TOUCH
              </span>

              <h4>Sweet Conversations</h4>

              {businessDetails.email ? (
                <a
                  href={`mailto:${businessDetails.email}`}
                >
                  {businessDetails.email}
                </a>
              ) : (
                <p>
                  Send your enquiry using the form above.
                </p>
              )}

            </div>

          </div>

        </div>

        <div className="contact-visit__bottom">

          <span>
            GOOD THINGS BEGIN WITH A LITTLE HELLO.
          </span>

          <span aria-hidden="true">✳</span>

          <span>
            WITH LOVE, CRUMB & CO.
          </span>

        </div>

      </div>
    </section>
  );
}

export default Contact;

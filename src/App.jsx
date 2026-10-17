
import { useEffect } from 'react';

import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import FreshBakes from './components/FreshBakes/FreshBakes';
import CroissantStory from './components/CroissantStory/CroissantStory';
import BakeryLab from './components/BakeryLab/BakeryLab';
import CakeCollection from './components/CakeCollection/CakeCollection';
import OurStory from './components/OurStory/OurStory';
import CustomerLove from './components/CustomerLove/CustomerLove';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import CartDrawer from './components/CartDrawer/CartDrawer';

import Checkout from './pages/Checkout';

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    let sectionId;

    try {
      sectionId = decodeURIComponent(
        location.hash.slice(1)
      );
    } catch {
      return;
    }

    const frame = requestAnimationFrame(() => {
      const section = document.getElementById(sectionId);

      if (!section) return;

      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      section.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [location.hash]);

  return (
    <main>

      <div
        id="nav-home"
        style={{ scrollMarginTop: '95px' }}
      >
        <Hero />
      </div>

      <div
        id="nav-bakes"
        style={{ scrollMarginTop: '95px' }}
      >
        <FreshBakes />
      </div>

      <div
        id="nav-croissant"
        style={{ scrollMarginTop: '95px' }}
      >
        <CroissantStory />
      </div>

      <div
        id="nav-lab"
        style={{ scrollMarginTop: '95px' }}
      >
        <BakeryLab />
      </div>

      <div
        id="nav-cakes"
        style={{ scrollMarginTop: '95px' }}
      >
        <CakeCollection />
      </div>

      <div
        id="nav-story"
        style={{ scrollMarginTop: '95px' }}
      >
        <OurStory />
      </div>

      <div
        id="nav-love"
        style={{ scrollMarginTop: '95px' }}
      >
        <CustomerLove />
      </div>

      <div
        id="nav-contact"
        style={{ scrollMarginTop: '95px' }}
      >
        <Contact />
      </div>

      <Footer />

    </main>
  );
}

function CheckoutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <Checkout />;
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/checkout"
          element={<CheckoutPage />}
        />

        <Route
          path="*"
          element={
            <Navigate to="/" replace />
          }
        />
      </Routes>

      <CartDrawer />
    </>
  );
}

export default App;

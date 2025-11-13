import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import { Dashboard } from './Pages/Dashboard';
import { ProtectedRoute } from './Components/ProtectedRoute'; 
import MemorialProvider  from './Contexts/MemorialContext';
import { PreviewPage } from './Pages/Preview';
import AboutUs from './Components/AboutUs';
import WhatWeOffer from './Components/WhatWeOffer';
import ContactUs from './Components/Contact';
import Pricing from './Components/Pricing';
import HowItWorks from './Components/HowItWorks';
import MemoryGuide from './Components/MemoryGuide';
import TermsOfService from './Components/TermsOfService';
import PrivacyPolicy from './Components/PrivacyPolicy';
import { PDFPreviewPage } from './Pages/PDFPreviewPage';

import './App.css';

function App() {
  return (
    <MemorialProvider>
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/preview/:memorialId" element={<PreviewPage />} />
        <Route path="/services" element={<WhatWeOffer />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/guide" element={<MemoryGuide />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/memorial/:id" element={<PDFPreviewPage />} />

        {/* Protected dashboard route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    </MemorialProvider>
  );
}

export default App;

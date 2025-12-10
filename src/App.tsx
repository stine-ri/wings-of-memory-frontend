// App.tsx - UPDATED VERSION
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import { Dashboard } from './Pages/Dashboard';
import { ProtectedRoute } from './Components/ProtectedRoute'; 
import MemorialProvider from './Contexts/MemorialContext';
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
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import Help from './Components/Help';
// import PublicMemorialPage from './Pages/PublicMemorialPage';
import {MemorialDisplayPage} from './Pages/MemorialDisplayPage';
import './App.css';

function App() {
  return (
    <MemorialProvider>
      <Router>
        <Routes>
          {/* Public routes */}
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/help" element={<Help />} />
          
          {/* Separate routes for different purposes */}
          <Route path="/memorial/pdf/:id" element={<PDFPreviewPage />} />
          
          {/* FIXED: Separate routes for public memorial and display */}
         <Route path="/memorial/:identifier" element={<MemorialDisplayPage />} />
          {/* <Route path="/memorial/:identifier" element={<PublicMemorialPage />} /> */}

          
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
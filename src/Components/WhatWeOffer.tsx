import React, { useState } from 'react';
import { 
  Download, 
  CreditCard, 
  FileText, 
  Users, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Camera,
  Calendar,
  MapPin,
  BookOpen,
  Clock,
  Sparkles,
  User,
  Crown
} from 'lucide-react';
import { TopNav } from '../Components/TopNav';
import { Footer } from '../Components/Footer';
import { useNavigate } from 'react-router-dom';

const WhatWeOffer: React.FC = () => {
  const [activeStep] = useState(1);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const services = [
    {
      icon: BookOpen,
      title: "Digital Memorial Creation",
      description: "Create beautiful, personalized digital memorial pages with photos, stories, and memories of your loved one.",
      features: ["Unlimited photos", "Life story section", "Memory wall", "Timeline of life events"]
    },
    {
      icon: FileText,
      title: "PDF Memorial Book",
      description: "Download a professionally designed PDF memorial book that you can print, share, or keep as a digital keepsake.",
      features: ["Multiple templates", "High-quality print", "Customizable layout", "Family tree section"]
    },
    {
      icon: Users,
      title: "Family Collaboration",
      description: "Invite family members to contribute memories, photos, and stories to create a comprehensive tribute together.",
      features: ["Multi-user access", "Real-time updates", "Moderation controls", "Private sharing"]
    }
  ];

  const steps = [
    {
      step: 1,
      icon: BookOpen,
      title: "Register Free",
      description: "Create your free account and get your first memorial template absolutely free"
    },
    {
      step: 2,
      title: "Create Memorial",
      icon: User,
      description: "Fill in details about your loved one - name, photos, life story, and special memories"
    },
    {
      step: 3,
      title: "Design & Preview",
      icon: Sparkles,
      description: "Choose from beautiful templates and preview your memorial before payment"
    },
    {
      step: 4,
      title: "Pay via M-Pesa",
      icon: CreditCard,
      description: "Pay KSh 500 via M-Pesa to unlock additional memorials and premium features"
    },
    {
      step: 5,
      title: "Download & Share",
      icon: Download,
      description: "Download your high-quality PDF and share with family and friends"
    }
  ];

  const pricingPlans = [
    {
      name: "First Memorial",
      price: "Free",
      description: "Your first memorial template is completely free",
      features: [
        "One free memorial PDF",
        "Digital memorial page",
        "Unlimited photos",
        "Basic template",
        "Family collaboration"
      ],
      cta: "Get Started Free",
      popular: false,
      note: "Perfect for trying our service"
    },
    {
      name: "Premium Access",
      price: "KSh 500",
      description: "Additional memorials and premium features",
      features: [
        "Additional memorial PDFs",
        "Premium templates",
        "High-resolution printing",
        "Priority support",
        "Lifetime access",
        "M-Pesa payment"
      ],
      cta: "Create Memorial",
      popular: true,
      note: "After your first free memorial"
    }
  ];

  const memorialFormFields = [
    { name: 'fullName', label: 'Full Name', type: 'text', icon: User },
    { name: 'birthDate', label: 'Date of Birth', type: 'date', icon: Calendar },
    { name: 'passingDate', label: 'Date of Passing', type: 'date', icon: Clock },
    { name: 'birthPlace', label: 'Place of Birth', type: 'text', icon: MapPin },
    { name: 'biography', label: 'Life Story', type: 'textarea', icon: BookOpen },
    { name: 'photos', label: 'Photos', type: 'file', icon: Camera, multiple: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/20 to-gray-50/20">
      <TopNav />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600/90 via-orange-500/90 to-amber-600/90 text-white py-16 sm:py-20 lg:py-28">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-6">
              <Crown className="w-4 h-4 fill-white" />
              <span className="text-sm font-semibold">First Memorial Free</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Create Beautiful Memorials
            </h1>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Get your first memorial template absolutely free. Honor your loved ones with beautifully designed digital memorials and printable PDF tributes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleGetStarted}
                className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              >
                Get First Memorial Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50">
                View Examples
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Free Offer Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4">
            <Crown className="w-6 h-6 fill-white" />
            <p className="text-lg font-semibold">
              🎁 Your first memorial template is completely FREE! Register now to get started.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Start with a free memorial, then unlock more with simple M-Pesa payments
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8 mb-12">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    activeStep >= step.step 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className={`text-sm font-semibold mb-2 ${
                    activeStep >= step.step ? 'text-orange-600' : 'text-gray-400'
                  }`}>
                    Step {step.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>

          {/* Memorial Form Preview */}
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-8 border-2 border-orange-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4">
                <Crown className="w-4 h-4 fill-orange-600" />
                <span className="text-sm font-semibold">Free Template Preview</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Create Your Memorial
              </h3>
              <p className="text-gray-600">
                Register to access the full memorial creation form
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 opacity-75">
              {memorialFormFields.slice(0, 4).map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.name} className={
                    field.type === 'textarea' ? 'md:col-span-2' : ''
                  }>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Icon className="w-4 h-4" />
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        disabled
                        className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
                        placeholder="Register to unlock this feature..."
                      />
                    ) : field.type === 'file' ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-100">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Register to upload photos</p>
                      </div>
                    ) : (
                      <input
                        disabled
                        type={field.type}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
                        placeholder="Register to unlock this feature..."
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-8">
              <button 
                onClick={handleGetStarted}
                className="px-8 py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Register to Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gradient-to-b from-orange-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to create a meaningful tribute
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-orange-200 transition-all duration-300">
                  <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple & Affordable
            </h2>
            <p className="text-lg text-gray-600">
              Start free, then pay only for additional memorials
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative rounded-2xl p-8 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200' 
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== "Free" && <span className="text-gray-600"> per memorial</span>}
                </div>
                <p className="text-gray-600 mb-2">{plan.description}</p>
                {plan.note && (
                  <p className="text-sm text-orange-600 mb-4 font-semibold">{plan.note}</p>
                )}
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-orange-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={handleGetStarted}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    plan.popular
                      ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* M-Pesa Payment Info */}
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
              <CreditCard className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">M-Pesa Payments</h3>
              <p className="text-gray-600 mb-4">
                After your free memorial, pay KSh 500 via M-Pesa for additional memorials. Simple, secure, and instant.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-700">
                <Shield className="w-5 h-5 text-orange-600" />
                <span>Secure & Encrypted</span>
                <span>•</span>
                <span>Instant Confirmation</span>
                <span>•</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Crown className="w-16 h-16 mx-auto mb-6 fill-orange-500" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Create Your Free Memorial?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Get your first memorial template completely free. No credit card required. 
            Beautiful PDF downloads, easy M-Pesa payments for additional memorials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="px-8 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Get First Memorial Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50">
              Contact Support
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WhatWeOffer;
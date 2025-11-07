import React from 'react';
import { 
  Crown,
  CheckCircle,
  XCircle,
  Star,
  Zap,
  Heart,
  Users,
  Download,
  FileText,
  Shield,
  Clock,
  ArrowRight,
  CreditCard,
  Gift,
  Calendar
} from 'lucide-react';
import TopNav from '../Components/TopNav';
import { Footer } from '../Components/Footer';

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for your first memorial",
      price: "Free",
      originalPrice: "",
      period: "First memorial",
      popular: false,
      featured: true,
      cta: "Get Started Free",
      href: "/register",
      icon: Gift,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      features: [
        { text: "One free memorial PDF", included: true },
        { text: "Digital memorial page", included: true },
        { text: "Up to 10 photos", included: true },
        { text: "Basic template designs", included: true },
        { text: "Family collaboration", included: true },
        { text: "Memory wall", included: true },
        { text: "Life timeline", included: true },
        { text: "Additional memorials", included: false },
        { text: "Premium templates", included: false },
        { text: "Unlimited photos", included: false },
        { text: "Priority support", included: false },
        { text: "Custom branding", included: false }
      ]
    },
    {
      name: "Premium",
      description: "For creating multiple memorials",
      price: "Coming Soon",
      originalPrice: "",
      period: "per memorial",
      popular: true,
      featured: false,
      cta: "Notify Me When Available",
      href: "/waitlist",
      icon: Crown,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-600",
      features: [
        { text: "Additional memorial PDFs", included: true },
        { text: "All Starter features", included: true },
        { text: "Premium template designs", included: true },
        { text: "Unlimited photos", included: true },
        { text: "High-resolution PDF", included: true },
        { text: "Priority support", included: true },
        { text: "Custom color schemes", included: true },
        { text: "Family tree section", included: true },
        { text: "QR code sharing", included: true },
        { text: "Lifetime access", included: true },
        { text: "M-Pesa payment", included: true },
        { text: "30-day satisfaction guarantee", included: true }
      ]
    },
    {
      name: "Family Plan",
      description: "For families creating multiple tributes",
      price: "Coming Soon",
      originalPrice: "",
      period: "for 4 memorials",
      popular: false,
      featured: false,
      cta: "Notify Me When Available",
      href: "/waitlist",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-600",
      features: [
        { text: "4 memorial PDFs", included: true },
        { text: "All Premium features", included: true },
        { text: "Bulk discount (save 25%)", included: true },
        { text: "Shared family account", included: true },
        { text: "Dedicated support", included: true },
        { text: "Custom templates", included: true },
        { text: "Video memorials", included: true },
        { text: "Digital guestbook", included: true },
        { text: "Memory vault", included: true },
        { text: "Annual updates", included: true },
        { text: "Family tree builder", included: true },
        { text: "Legacy planning tools", included: true }
      ]
    }
  ];

  const features = [
    {
      icon: FileText,
      title: "Beautiful PDF Memorials",
      description: "Professionally designed templates that create stunning printable tributes"
    },
    {
      icon: Download,
      title: "Instant Download",
      description: "Get your memorial PDF immediately after creation"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your data is encrypted and protected with bank-level security"
    },
    {
      icon: Clock,
      title: "Lifetime Access",
      description: "Access and edit your memorials anytime, forever"
    }
  ];

  const faqs = [
    {
      question: "Is the first memorial really free?",
      answer: "Yes! Your first memorial PDF is completely free with no hidden costs. Create a beautiful tribute at no cost to experience our service."
    },
    {
      question: "When will paid plans be available?",
      answer: "We're currently focusing on building our community and gathering feedback. Paid plans for additional memorials will be introduced later this year. Sign up for our newsletter to be notified when they launch."
    },
    {
      question: "Can I edit my memorial after creation?",
      answer: "Yes! You can edit and update your memorial anytime. All changes are saved automatically and you can download updated versions."
    },
    {
      question: "How many photos can I include?",
      answer: "The free plan includes up to 10 photos. When premium plans launch, they will include unlimited photos for your memorials."
    },
    {
      question: "Can family members contribute?",
      answer: "Yes! All memorials include family collaboration features, allowing multiple people to add memories and photos."
    },
    {
      question: "What happens to my free memorial when paid plans launch?",
      answer: "Your first memorial will always remain free. Any memorials created before paid plans launch will be grandfathered in at no cost."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <TopNav />
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-20 pb-16 bg-gradient-to-b from-white via-orange-50/20 to-gray-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 sm:px-4 sm:py-2 rounded-full mb-3 sm:mb-4">
              <Crown className="w-3 h-3 sm:w-4 sm:h-4 fill-orange-600" />
              <span className="text-xs sm:text-sm font-semibold">First Memorial Free</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Simple & Transparent
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Start with a completely free memorial. Additional features and paid plans will be introduced as we grow our community.
            </p>
          </div>

          {/* Coming Soon Banner */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white text-center">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-lg font-semibold">Paid Plans Coming Soon!</span>
              </div>
              <p className="text-blue-100 text-sm sm:text-base">
                We're currently in early access. Get your first memorial free now, and be the first to know when premium features launch.
              </p>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 lg:mb-20">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <div
                  key={index}
                  className={`relative rounded-xl sm:rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
                    plan.popular
                      ? 'bg-white shadow-xl sm:shadow-2xl border-2 border-orange-200 lg:transform lg:scale-105'
                      : 'bg-white shadow-lg border-2 border-gray-200'
                  } ${plan.featured ? 'ring-2 ring-blue-500 ring-opacity-50' : ''} ${
                    plan.price === "Coming Soon" ? 'opacity-90' : ''
                  }`}
                >
                  {/* Coming Soon Badge for paid plans */}
                  {plan.price === "Coming Soon" && (
                    <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        Coming Soon
                      </div>
                    </div>
                  )}

                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Featured Badge */}
                  {plan.featured && (
                    <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1">
                        <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
                        Available Now
                      </div>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="text-center mb-6 sm:mb-8">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${plan.bgColor} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                      <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${plan.textColor}`} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">{plan.description}</p>
                    
                    <div className="mb-2">
                      <span className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                        plan.price === "Coming Soon" ? 'text-gray-500' : 'text-gray-900'
                      }`}>
                        {plan.price}
                      </span>
                      {plan.originalPrice && (
                        <span className="text-base sm:text-lg text-gray-500 line-through ml-2">{plan.originalPrice}</span>
                      )}
                    </div>
                    <div className={`text-sm sm:text-base ${
                      plan.price === "Coming Soon" ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {plan.period}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg mb-6 sm:mb-8 transition-all duration-300 ${
                      plan.price === "Coming Soon"
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl'
                        : plan.featured
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                    disabled={plan.price === "Coming Soon"}
                  >
                    {plan.cta}
                  </button>

                  {/* Features List */}
                  <div className="space-y-3 sm:space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                        {feature.included ? (
                          <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            plan.price === "Coming Soon" ? 'text-gray-400' : 'text-green-500'
                          } shrink-0 mt-0.5`} />
                        ) : (
                          <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 shrink-0 mt-0.5" />
                        )}
                        <span className={`text-xs sm:text-sm ${
                          feature.included 
                            ? plan.price === "Coming Soon" ? 'text-gray-500' : 'text-gray-700'
                            : 'text-gray-400'
                        }`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Future Payment Section */}
          <div className="max-w-4xl mx-auto mb-12 sm:mb-16 lg:mb-20">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-blue-200">
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Future Payment Options</h3>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
                    When we introduce paid plans, we'll offer secure, convenient payment options including M-Pesa for our Kenyan users and other payment methods for international users.
                  </p>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      <span className="text-gray-700 text-sm sm:text-base">Bank-level security</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      <span className="text-gray-700 text-sm sm:text-base">Instant confirmation</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      <span className="text-gray-700 text-sm sm:text-base">24/7 payment processing</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg inline-block">
                    <div className="text-3xl sm:text-4xl mb-2">🚀</div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Coming Soon</div>
                    <div className="text-gray-600 text-sm sm:text-base">Premium Features</div>
                    <div className="text-xs sm:text-sm text-blue-600 font-semibold mt-2">
                      Get notified at launch
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Frequently Asked Questions
              </h3>
              <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                Everything you need to know about our current offering and future plans.
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-gray-100">
                  <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">
                    {faq.question}
                  </h4>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-12 sm:mt-16">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-white max-w-4xl mx-auto">
              <Heart className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 fill-white" />
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                Start Creating Today - It's Free!
              </h3>
              <p className="text-orange-100 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
                Create your first beautiful memorial at no cost. No credit card required. Be part of our growing community and get early access to future features.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-orange-600 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3">
                  Create Free Memorial
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button className="px-6 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50">
                  Join Waitlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="bg-white border-t border-gray-200">
        <Footer />
      </div>
    </div>
  );
};

export default Pricing;
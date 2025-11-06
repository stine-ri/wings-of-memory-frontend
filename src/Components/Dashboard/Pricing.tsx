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
  Gift
} from 'lucide-react';

const Pricing: React.FC = () => {
  // Removed unused billingPeriod and setBillingPeriod

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
      price: "KSh 500",
      originalPrice: "KSh 800",
      period: "per memorial",
      popular: true,
      featured: false,
      cta: "Create Memorial",
      href: "/create",
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
      price: "KSh 1,500",
      originalPrice: "KSh 2,400",
      period: "for 4 memorials",
      popular: false,
      featured: false,
      cta: "Choose Family Plan",
      href: "/family-plan",
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
      description: "Get your memorial PDF immediately after payment confirmation"
    },
    {
      icon: Shield,
      title: "Secure M-Pesa Payments",
      description: "Safe and encrypted payment processing via M-Pesa"
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
      answer: "Yes! Your first memorial PDF is completely free with no hidden costs. You only pay for additional memorials."
    },
    {
      question: "How does the M-Pesa payment work?",
      answer: "After creating your memorial, you'll enter your M-Pesa number. You'll receive a prompt on your phone to confirm the KSh 500 payment. It's secure and instant."
    },
    {
      question: "Can I edit my memorial after payment?",
      answer: "Yes! You can edit and update your memorial anytime. All changes are saved automatically and you can download updated versions."
    },
    {
      question: "What if I'm not satisfied with my memorial?",
      answer: "We offer a 30-day satisfaction guarantee. If you're not happy with your memorial, we'll help you improve it or provide a full refund."
    },
    {
      question: "How many photos can I include?",
      answer: "The free plan includes up to 10 photos. Premium plans include unlimited photos for your memorials."
    },
    {
      question: "Can family members contribute?",
      answer: "Yes! All plans include family collaboration features, allowing multiple people to add memories and photos."
    }
  ];

  return (
    <div className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-orange-50/20 to-gray-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4">
            <Crown className="w-4 h-4 fill-orange-600" />
            <span className="text-sm font-semibold">First Memorial Free</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Simple, Honest Pricing
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Start with a free memorial. Only pay when you need additional beautiful tributes. No hidden fees, no subscriptions.
          </p>
        </div>

        {/* Free Offer Banner */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Gift className="w-6 h-6" />
              <span className="text-lg font-semibold">Special Offer: Your First Memorial is Free!</span>
            </div>
            <p className="text-green-100">
              Create your first beautiful memorial PDF at no cost. Perfect for trying our service risk-free.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16 lg:mb-20">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={index}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.popular
                    ? 'bg-white shadow-2xl border-2 border-orange-200 transform scale-105'
                    : 'bg-white shadow-lg border-2 border-gray-200'
                } ${plan.featured ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Featured Badge */}
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Gift className="w-4 h-4" />
                      Perfect for Starters
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 ${plan.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 ${plan.textColor}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-500 line-through ml-2">{plan.originalPrice}</span>
                    )}
                  </div>
                  <div className="text-gray-600">{plan.period}</div>
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-4 rounded-xl font-bold text-lg mb-8 transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl'
                      : plan.featured
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.cta}
                </button>

                {/* Features List */}
                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      {feature.included ? (
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300 shrink-0" />
                      )}
                      <span className={`text-sm ${
                        feature.included ? 'text-gray-700' : 'text-gray-400'
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 lg:mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* M-Pesa Payment Section */}
        <div className="max-w-4xl mx-auto mb-16 lg:mb-20">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border-2 border-orange-200">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-8 h-8 text-orange-600" />
                  <h3 className="text-2xl font-bold text-gray-900">M-Pesa Payments</h3>
                </div>
                <p className="text-gray-700 mb-4 text-lg">
                  Secure, instant payments via M-Pesa. Simply enter your phone number and confirm the payment on your device.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Bank-level security</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Instant confirmation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">24/7 payment processing</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-2xl p-6 shadow-lg inline-block">
                  <div className="text-4xl mb-2">📱</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">KSh 500</div>
                  <div className="text-gray-600">per memorial</div>
                  <div className="text-sm text-orange-600 font-semibold mt-2">
                    After first free memorial
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our pricing and memorial creation process.
            </p>
          </div>

          <div className="grid gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                  {faq.question}
                </h4>
                <p className="text-gray-700">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 sm:p-12 text-white max-w-4xl mx-auto">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 fill-white" />
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Honor Your Loved One?
            </h3>
            <p className="text-orange-100 text-lg mb-6 max-w-2xl mx-auto">
              Start with a free memorial today. No credit card required. Create a beautiful tribute in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                Get Your Free Memorial
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
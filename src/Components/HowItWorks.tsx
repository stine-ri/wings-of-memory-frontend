import React, { useState } from 'react';
import { 
  User, 
  FileText, 
  Sparkles, 
  Eye, 
  Download, 
  CheckCircle,
  ArrowRight,
  Crown,
  Heart,
  Clock,
  Shield,
  Calendar
} from 'lucide-react';
import TopNav from '../Components/TopNav';
import { Footer } from '../Components/Footer';

const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      step: 1,
      icon: User,
      title: "Register Free",
      description: "Create your free account in under 2 minutes",
      details: "No credit card required. Get immediate access to create your first memorial.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      step: 2,
      icon: FileText,
      title: "Create Memorial",
      description: "Fill in your loved one's details and upload photos",
      details: "Add life story, important dates, memories, and cherished photos.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      step: 3,
      icon: Sparkles,
      title: "Design & Customize",
      description: "Choose from beautiful templates and customize the layout",
      details: "Select from multiple professional designs that match your loved one's personality.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      step: 4,
      icon: Eye,
      title: "Preview & Review",
      description: "Preview your memorial and make final adjustments",
      details: "See exactly how your memorial will look before downloading.",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-100",
      textColor: "text-amber-600"
    },
    {
      step: 5,
      icon: Download,
      title: "Download & Share",
      description: "Get your beautiful PDF memorial instantly",
      details: "Download high-quality PDF and share with family and friends.",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600"
    }
  ];

  const features = [
    {
      icon: Crown,
      title: "First Memorial Free",
      description: "Your first memorial PDF is completely free. No hidden costs."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and protected. We respect your privacy."
    },
    {
      icon: Clock,
      title: "30-Minute Creation",
      description: "Create a beautiful memorial in under 30 minutes."
    },
    {
      icon: Heart,
      title: "Lifetime Access",
      description: "Access and edit your memorial anytime, forever."
    }
  ];

  type StepDetail = {
    title: string;
    points: string[];
    image: string;
  };

  type StepDetailsMap = {
    [key: number]: StepDetail;
  };

  const stepDetails: StepDetailsMap = {
    1: {
      title: "Quick Registration",
      points: [
        "Enter basic information",
        "Verify your email",
        "Get immediate access",
        "No payment required"
      ],
      image: "📝"
    },
    2: {
      title: "Memorial Creation",
      points: [
        "Add personal details",
        "Upload photos",
        "Write life story",
        "Include special memories"
      ],
      image: "📖"
    },
    3: {
      title: "Beautiful Design",
      points: [
        "Choose from multiple templates",
        "Customize colors and fonts",
        "Add family tree section",
        "Preview different layouts"
      ],
      image: "🎨"
    },
    4: {
      title: "Perfect Preview",
      points: [
        "View full memorial layout",
        "Check photo quality",
        "Review text formatting",
        "Make final edits"
      ],
      image: "👀"
    },
    5: {
      title: "Instant Download",
      points: [
        "High-quality PDF",
        "Print-ready format",
        "Share via link/QR code",
        "Lifetime access"
      ],
      image: "📄"
    }
  };

  const StepIcon = steps[activeStep - 1].icon;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <TopNav />
      </div>

      {/* Main Content - Pushed down by navbar and up by footer */}
      <div className="flex-1 pt-20 pb-16 bg-gradient-to-b from-white via-orange-50/20 to-gray-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4">
              <Crown className="w-4 h-4 fill-orange-600" />
              <span className="text-sm font-semibold">Completely Free</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Create a beautiful memorial in 5 simple steps. Start with our free template - no payment required.
            </p>
          </div>

          {/* Coming Soon Notice */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-6 text-white text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-lg font-semibold">Premium Features Coming Soon!</span>
              </div>
              <p className="text-blue-100">
                We're currently offering completely free memorials. Additional features and paid plans for multiple memorials will be introduced later.
              </p>
            </div>
          </div>

          {/* Steps Navigation */}
          <div className="mb-12 lg:mb-16">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {steps.map((step) => (
                <button
                  key={step.step}
                  onClick={() => setActiveStep(step.step)}
                  className={`text-left p-4 sm:p-6 rounded-2xl transition-all duration-300 ${
                    activeStep === step.step
                      ? 'bg-white shadow-xl border-2 border-orange-200 transform -translate-y-1'
                      : 'bg-gray-50/50 border-2 border-transparent hover:border-orange-100 hover:shadow-lg'
                  }`}
                >
                  <div className={`w-12 h-12 ${step.bgColor} rounded-xl flex items-center justify-center mb-3`}>
                    <step.icon className={`w-6 h-6 ${step.textColor}`} />
                  </div>
                  <div className={`text-sm font-semibold mb-1 ${
                    activeStep === step.step ? 'text-orange-600' : 'text-gray-500'
                  }`}>
                    Step {step.step}
                  </div>
                  <h3 className={`font-bold text-base sm:text-lg ${
                    activeStep === step.step ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {step.title}
                  </h3>
                </button>
              ))}
            </div>
          </div>

          {/* Step Details */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16 lg:mb-20">
            {/* Step Content */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-orange-100">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${steps[activeStep - 1].color} rounded-2xl flex items-center justify-center`}>
                  <StepIcon className="w-8 h-8 text-white" />
                </div>

                <div>
                  <div className="text-sm font-semibold text-orange-600 mb-1">
                    Step {activeStep}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {steps[activeStep - 1].title}
                  </h3>
                </div>
              </div>

              <p className="text-lg text-gray-700 mb-6">
                {steps[activeStep - 1].description}
              </p>

              <div className="space-y-4">
                {stepDetails[activeStep].points.map((point: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </div>
                ))}
              </div>

              {/* Progress & Navigation */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                    disabled={activeStep === 1}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeStep === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-800 text-white hover:bg-gray-900'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                      Step {activeStep} of {steps.length}
                    </div>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(activeStep / steps.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
                    disabled={activeStep === steps.length}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeStep === steps.length
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Visual & Features */}
            <div className="space-y-8">
              {/* Step Visual */}
              <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-8 text-white text-center">
                <div className="text-6xl mb-4">
                  {stepDetails[activeStep].image}
                </div>
                <h4 className="text-xl font-bold mb-2">
                  {stepDetails[activeStep].title}
                </h4>
                <p className="text-orange-100">
                  {steps[activeStep - 1].details}
                </p>
              </div>

              {/* Key Features */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-100">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Why Choose 4revah?
                </h4>
                <div className="space-y-4">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 text-sm">
                            {feature.title}
                          </h5>
                          <p className="text-gray-600 text-xs">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 sm:p-12 text-white">
            <Crown className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 fill-white" />
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Create Your Free Memorial?
            </h3>
            <p className="text-orange-100 text-lg mb-6 max-w-2xl mx-auto">
              Join our growing community and create a beautiful tribute for your loved one. 
              No payment required - your first memorial is completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50">
                View Examples
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="bg-white border-t border-gray-200">
        <Footer />
      </div>
    </div>
  );
};

export default HowItWorks;
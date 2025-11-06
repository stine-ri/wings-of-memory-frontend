import React, { useState } from 'react';
import { 
  MessageCircle, 
  Facebook, 
  Send, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  MessageSquare,
  Heart,
  ArrowRight
} from 'lucide-react';
import { TopNav } from '../Components/TopNav';
import { Footer } from '../Components/Footer';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Encode the form data for Facebook Messenger
    const message = `New Contact Form Submission:%0A%0AName: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0ASubject: ${formData.subject}%0AMessage: ${formData.message}`;
    
    // Replace with your actual Facebook page ID or username
    const facebookPageId = 'your-facebook-page-id';
    
    // Open Facebook Messenger with pre-filled message
    window.open(`https://m.me/${facebookPageId}?text=${message}`, '_blank');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Facebook Messenger",
      description: "Get instant support via Messenger",
      details: "We typically reply within minutes",
      action: "Message Us",
      color: "bg-blue-100 text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      details: "support@4revah.com",
      action: "Send Email",
      color: "bg-orange-100 text-orange-600",
      borderColor: "border-orange-200"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon - Fri, 9am - 5pm EAT",
      details: "+254 700 000 000",
      action: "Call Now",
      color: "bg-green-100 text-green-600",
      borderColor: "border-green-200"
    }
  ];

  const faqs = [
    {
      question: "How long does it take to create a memorial?",
      answer: "You can create a beautiful memorial in under 30 minutes. Our intuitive platform makes the process simple and straightforward."
    },
    {
      question: "Is my first memorial really free?",
      answer: "Yes! Your first memorial PDF is completely free. You only pay for additional memorials or premium features."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept M-Pesa payments for Kenyan customers. The process is secure and instant."
    },
    {
      question: "Can I edit the memorial after creating it?",
      answer: "Yes, you can edit and update your memorial anytime. All changes are saved automatically."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/20 to-gray-50/20">
      <TopNav />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600/90 via-orange-500/90 to-amber-600/90 text-white py-16 sm:py-20 lg:py-24">
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
              <MessageCircle className="w-4 h-4 fill-white" />
              <span className="text-sm font-semibold">Contact Us</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
              We're Here to Help
            </h1>
            
            <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
              Have questions about creating memorials? Need support? Reach out to us - we're always happy to help you honor your loved ones.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Choose the most convenient way to reach us
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div 
                  key={index}
                  className={`bg-white rounded-2xl p-6 sm:p-8 border-2 ${method.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm sm:text-base">
                    {method.description}
                  </p>
                  <p className="text-gray-800 font-semibold mb-6 text-sm sm:text-base">
                    {method.details}
                  </p>
                  <button 
                    onClick={() => {
                      if (method.title === "Facebook Messenger") {
                        window.open(`https://m.me/your-facebook-page-id`, '_blank');
                      } else if (method.title === "Email Us") {
                        window.location.href = 'mailto:support@4revah.com';
                      } else {
                        window.location.href = 'tel:+254700000000';
                      }
                    }}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {method.action}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-orange-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Form */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border-2 border-orange-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm font-semibold">Send us a Message</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Contact Form
                </h2>
                <p className="text-gray-600">
                  Fill out the form and we'll contact you via Facebook Messenger
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <User className="w-4 h-4" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      placeholder="+254 700 000 000"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4" />
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select a subject</option>
                    <option value="Memorial Support">Memorial Support</option>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Technical Help">Technical Help</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MessageCircle className="w-4 h-4" />
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  <Send className="w-5 h-5" />
                  Send via Facebook Messenger
                  <Facebook className="w-5 h-5 fill-current" />
                </button>

                <p className="text-center text-sm text-gray-600">
                  By clicking above, you'll be redirected to Facebook Messenger to send your message
                </p>
              </form>
            </div>

            {/* Info & FAQ */}
            <div className="space-y-8 lg:space-y-12">
              {/* Contact Info */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-orange-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Facebook Messenger</p>
                      <p className="text-gray-600 text-sm">Fastest response time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <p className="text-gray-600 text-sm">support@4revah.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Response Time</p>
                      <p className="text-gray-600 text-sm">Within 2 hours during business hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-orange-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-orange-600" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                        {faq.question}
                      </h4>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-6 fill-orange-500" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
            Need Immediate Assistance?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
            Message us directly on Facebook Messenger for the fastest response. We're here to help you create meaningful memorials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.open('https://m.me/your-facebook-page-id', '_blank')}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-orange-500 text-white rounded-xl font-bold text-base sm:text-lg hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <Facebook className="w-5 h-5 fill-current" />
              Message us on Messenger
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => window.location.href = 'mailto:support@4revah.com'}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50"
            >
              Send us an Email
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  ChevronDown, 
  ChevronUp,
  Send,
  CheckCircle,
  BookOpen,
  Download,
  Users,
  Shield,
  Clock,
  FileText,
  Search
} from 'lucide-react';
import TopNav from '../Components/TopNav';
import { Footer } from '../Components/Footer';

const Help: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'email'>('whatsapp');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  // WhatsApp business number (replace with your actual number)
  const whatsappNumber = '254700000000'; // Format: country code + number (no + or spaces)

  const faqCategories = [
    {
      category: 'Getting Started',
      icon: BookOpen,
      questions: [
        {
          question: 'How do I create my first memorial?',
          answer: 'Creating your first memorial is simple and completely free! Just register for an account, click "Create Memorial," and follow our step-by-step guide. You\'ll add your loved one\'s information, photos, and stories. Our intuitive interface makes it easy, and you can save your progress at any time.'
        },
        {
          question: 'Is it really free?',
          answer: 'Yes! Your first memorial is completely free, including the PDF download, digital memorial page, and all basic features. We believe everyone deserves to honor their loved ones beautifully without financial barriers. Premium features for additional memorials will be available in the future.'
        },
        {
          question: 'What information do I need to get started?',
          answer: 'You\'ll need basic information like your loved one\'s full name, birth and passing dates, and a few photos. You can also include their life story, achievements, and special memories. Don\'t worry - you can always come back and add more information later.'
        },
        {
          question: 'Can I preview my memorial before downloading?',
          answer: 'Absolutely! You can preview your memorial at any time during creation. We offer multiple template options, and you can switch between them to see which style best honors your loved one. Only download when you\'re completely satisfied.'
        }
      ]
    },
    {
      category: 'Features & Functionality',
      icon: FileText,
      questions: [
        {
          question: 'What\'s included in the digital memorial page?',
          answer: 'Your digital memorial page includes a personalized URL, photo galleries, life timeline, biography section, memory wall where family and friends can share stories, and a guest book for condolences. It\'s accessible 24/7 and can be shared via link or QR code.'
        },
        {
          question: 'How do I download the PDF memorial book?',
          answer: 'Once you\'ve completed your memorial, simply click the "Download PDF" button. You\'ll receive a high-quality, professionally formatted PDF that you can print at home or at a print shop. The PDF includes all the information and photos you\'ve added.'
        },
        {
          question: 'Can family members contribute to the memorial?',
          answer: 'Yes! You can invite family and friends to contribute memories, photos, and stories. Simply share your memorial\'s unique link with them. You maintain control as the memorial creator and can moderate all contributions before they\'re added.'
        },
        {
          question: 'Can I edit my memorial after creating it?',
          answer: 'Yes, you can edit your memorial at any time. Log into your account, go to "My Memorials," and make any changes you need. Your updates will be reflected in both the digital memorial and in any future PDF downloads.'
        }
      ]
    },
    {
      category: 'Photos & Media',
      icon: Download,
      questions: [
        {
          question: 'How many photos can I upload?',
          answer: 'You can upload unlimited photos to your memorial! We recommend including photos from different life stages - childhood, young adult, family moments, and special occasions. High-quality images work best for both digital viewing and PDF printing.'
        },
        {
          question: 'What photo formats are supported?',
          answer: 'We support JPG, PNG, and GIF formats. For best results, use high-resolution photos (at least 1MB). The system will automatically optimize your photos for both web viewing and print quality.'
        },
        {
          question: 'Can I add videos to the memorial?',
          answer: 'Video support is coming soon! Currently, you can add photos and written content. We\'re working on video memorial features that will be included in our upcoming premium tier.'
        },
        {
          question: 'How do I organize my photos?',
          answer: 'You can create photo albums by life period (childhood, adulthood, family), add captions to each photo, and arrange them in your preferred order. Our timeline feature automatically organizes photos chronologically when you add dates.'
        }
      ]
    },
    {
      category: 'Privacy & Security',
      icon: Shield,
      questions: [
        {
          question: 'Who can see my memorial?',
          answer: 'You have full control! Memorials can be public (searchable and shareable), private (only accessible via direct link), or completely private (password protected). You can change these settings at any time.'
        },
        {
          question: 'Is my data secure?',
          answer: 'Absolutely. We use industry-standard encryption to protect all your data. Your memorials are backed up regularly, and we never share your information with third parties. Read our full Privacy Policy for details.'
        },
        {
          question: 'Can I delete my memorial?',
          answer: 'Yes, you can delete your memorial at any time from your account settings. However, we recommend downloading a PDF copy first, as deletion is permanent. We also offer the option to simply make it private instead of deleting.'
        },
        {
          question: 'How long will my memorial be stored?',
          answer: 'Your memorial is stored permanently as long as your account remains active. We\'re committed to preserving these important tributes forever. Even if we introduce premium features, your free memorial will always remain accessible.'
        }
      ]
    },
    {
      category: 'Collaboration & Sharing',
      icon: Users,
      questions: [
        {
          question: 'How do I invite others to contribute?',
          answer: 'From your memorial dashboard, click "Invite Contributors" and enter their email addresses. They\'ll receive an invitation link to add their memories, photos, and condolences. You can set permissions for each contributor.'
        },
        {
          question: 'Can I share my memorial on social media?',
          answer: 'Yes! Each memorial has share buttons for Facebook, Twitter, WhatsApp, and email. You can also copy the direct link or download a QR code to include in printed materials like funeral programs.'
        },
        {
          question: 'How do guest book entries work?',
          answer: 'Visitors can leave condolences and memories in the guest book without creating an account. You can moderate entries before they appear publicly, and all entries include the visitor\'s name and date.'
        },
        {
          question: 'Can I print and share the PDF?',
          answer: 'Absolutely! The PDF is yours to print, share, and distribute as you wish. Many families print copies for funeral services, mail them to distant relatives, or keep them as keepsakes.'
        }
      ]
    },
    {
      category: 'Technical Support',
      icon: HelpCircle,
      questions: [
        {
          question: 'What if I need help creating my memorial?',
          answer: 'We\'re here to help! Use this contact form to reach us via WhatsApp or email. We also have detailed guides in our Memory Guide section. Most families complete their first memorial in 30-45 minutes with our step-by-step interface.'
        },
        {
          question: 'My photos won\'t upload. What should I do?',
          answer: 'First, check that your photos are in JPG or PNG format and under 10MB each. If issues persist, try using a different browser or clearing your cache. Contact us if you continue experiencing problems - we\'ll help you troubleshoot.'
        },
        {
          question: 'Can I use 4revah on my mobile device?',
          answer: 'Yes! 4revah works on all devices - desktop, tablet, and mobile. The interface adapts to your screen size. However, we recommend using a desktop or tablet for the initial creation for easier photo uploading and editing.'
        },
        {
          question: 'What browsers are supported?',
          answer: 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, please use the latest version of your browser.'
        }
      ]
    },
    {
      category: 'Future Features',
      icon: Clock,
      questions: [
        {
          question: 'What premium features are coming?',
          answer: 'We\'re developing additional memorial templates, video support, high-resolution print options, priority support, and the ability to create multiple memorials. These will be available later this year at affordable prices.'
        },
        {
          question: 'Will my free memorial always be free?',
          answer: 'Yes! Your first memorial will always remain free with full access to all core features. Any premium features we introduce will be optional add-ons - your existing memorial won\'t be affected.'
        },
        {
          question: 'Can I suggest new features?',
          answer: 'We\'d love to hear your ideas! Use the contact form below to share feature suggestions. We actively listen to our community and many of our best features come from user feedback.'
        }
      ]
    }
  ];

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      searchQuery === '' || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all fields');
      return;
    }
    
    if (contactMethod === 'whatsapp') {
      const message = `Hello 4revah Support!

Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}`;
      
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    } else {
      const subject = encodeURIComponent(`4revah Support: ${formData.subject}`);
      const body = encodeURIComponent(`Name: ${formData.name}
Email: ${formData.email}

${formData.message}`);
      
      window.location.href = `mailto:support@4revah.com?subject=${subject}&body=${body}`;
    }
  };

  const quickTopics = [
    { icon: BookOpen, text: 'Getting Started', query: 'create memorial' },
    { icon: Download, text: 'PDF Download', query: 'download pdf' },
    { icon: Users, text: 'Family Collaboration', query: 'invite' },
    { icon: Shield, text: 'Privacy', query: 'private' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/20 to-gray-50/20">
      <TopNav />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <HelpCircle className="w-5 h-5" />
              <span className="font-semibold">Help Center</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">How Can We Help You?</h1>
            <p className="text-xl text-white/90 mb-8">
              Find answers to common questions or reach out to our support team
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
            </div>

            {/* Quick Topics */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {quickTopics.map((topic, index) => {
                const Icon = topic.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(topic.query)}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{topic.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              {searchQuery ? `Search results for "${searchQuery}"` : 'Browse by category to find answers'}
            </p>
          </div>

          <div className="space-y-8">
            {filteredFaqs.map((category, catIndex) => {
              const CategoryIcon = category.icon;
              return (
                <div key={catIndex}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <CategoryIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
                  </div>

                  <div className="space-y-3">
                    {category.questions.map((faq, faqIndex) => {
                      const globalIndex = catIndex * 100 + faqIndex;
                      const isOpen = openFaq === globalIndex;
                      
                      return (
                        <div
                          key={faqIndex}
                          className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden hover:border-orange-200 transition-all duration-300"
                        >
                          <button
                            onClick={() => setOpenFaq(isOpen ? null : globalIndex)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-semibold text-gray-900 pr-4">
                              {faq.question}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-orange-600 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                          </button>
                          
                          {isOpen && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                              <p className="text-gray-700 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                Try a different search term or contact us directly below
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-orange-600 hover:text-orange-700 font-semibold"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-lg text-gray-600">
              Choose how you'd like to reach us
            </p>
          </div>

          {/* Contact Method Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setContactMethod('whatsapp')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  contactMethod === 'whatsapp'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
              <button
                onClick={() => setContactMethod('email')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  contactMethod === 'email'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail className="w-5 h-5" />
                Email
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-100 shadow-lg">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="How can we help you?"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Please describe your question or issue in detail..."
              />
            </div>

            <div className="bg-orange-50 rounded-xl p-4 mb-6 border border-orange-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  {contactMethod === 'whatsapp' ? (
                    <>
                      <strong>WhatsApp Response:</strong> Your message will open in WhatsApp where you can send it directly to our support team. We typically respond within 1-2 hours during business hours.
                    </>
                  ) : (
                    <>
                      <strong>Email Response:</strong> Your default email client will open with a pre-filled message. We typically respond within 24 hours.
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                contactMethod === 'whatsapp'
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              <Send className="w-5 h-5" />
              Send via {contactMethod === 'whatsapp' ? 'WhatsApp' : 'Email'}
            </button>
          </div>

          {/* Additional Contact Info */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">WhatsApp</h4>
              <p className="text-sm text-gray-600 mb-3">Fast response time</p>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 font-semibold hover:text-green-700"
              >
                Start Chat
              </a>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Email</h4>
              <p className="text-sm text-gray-600 mb-3">support@4revah.com</p>
              <a
                href="mailto:support@4revah.com"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Send Email
              </a>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Phone</h4>
              <p className="text-sm text-gray-600 mb-3">Mon-Fri, 9am-5pm EAT</p>
              <a
                href={`tel:+${whatsappNumber}`}
                className="text-purple-600 font-semibold hover:text-purple-700"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Support Hours */}
      <section className="py-12 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-orange-400" />
          <h3 className="text-2xl font-bold mb-4">Our Support Hours</h3>
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h4 className="font-bold mb-3">Business Days</h4>
              <p className="text-white/90">Monday - Friday</p>
              <p className="text-white/90">9:00 AM - 5:00 PM EAT</p>
              <p className="text-sm text-white/70 mt-2">Typical response: 1-2 hours</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h4 className="font-bold mb-3">Weekends</h4>
              <p className="text-white/90">Saturday - Sunday</p>
              <p className="text-white/90">10:00 AM - 3:00 PM EAT</p>
              <p className="text-sm text-white/70 mt-2">Typical response: 2-4 hours</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Help;
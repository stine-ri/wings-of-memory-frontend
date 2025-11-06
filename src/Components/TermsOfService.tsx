import React, { useState } from 'react';
import { 
  FileText,
  Shield,
  UserCheck,
  CreditCard,
  AlertCircle,
  BookOpen,
  Heart,
  ArrowRight,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  Users,
  Download
} from 'lucide-react';

const TermsOfService: React.FC = () => {
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: UserCheck,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      id: 'services',
      title: 'Services Description',
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      id: 'user-responsibilities',
      title: 'User Responsibilities',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      id: 'payments',
      title: 'Payments & Refunds',
      icon: CreditCard,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      icon: Shield,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600'
    },
    {
      id: 'liability',
      title: 'Liability',
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    }
  ];

  const termsContent = {
    'acceptance': {
      title: 'Acceptance of Terms',
      content: [
        {
          type: 'paragraph',
          text: 'By accessing and using 4revah ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.'
        },
        {
          type: 'paragraph',
          text: 'Additionally, when using this Service, you shall be subject to any posted guidelines or rules applicable. Any participation in this Service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this Service.'
        },
        {
          type: 'list',
          title: 'Key Points:',
          items: [
            'You must be at least 18 years old to use our Service',
            'You are responsible for maintaining the confidentiality of your account',
            'You agree to provide accurate and complete information',
            'We reserve the right to modify these terms at any time'
          ]
        }
      ]
    },
    'services': {
      title: 'Services Description',
      content: [
        {
          type: 'paragraph',
          text: '4revah provides digital memorial creation services, allowing users to create beautiful tributes for their loved ones.'
        },
        {
          type: 'list',
          title: 'Our Services Include:',
          items: [
            'Digital memorial page creation and hosting',
            'PDF memorial book generation and download',
            'Photo upload and storage services',
            'Family collaboration tools',
            'Template designs for memorials'
          ]
        },
        {
          type: 'paragraph',
          text: 'We offer one free memorial creation for first-time users. Additional memorials and premium features may require payment.'
        },
        {
          type: 'notice',
          text: 'Note: Our services are designed for personal, non-commercial use only. Commercial use of memorials requires written permission.'
        }
      ]
    },
    'user-responsibilities': {
      title: 'User Responsibilities',
      content: [
        {
          type: 'paragraph',
          text: 'As a user of our Service, you have certain responsibilities to ensure proper use and respect for all parties involved.'
        },
        {
          type: 'list',
          title: 'User Must:',
          items: [
            'Provide accurate information about the memorial subject',
            'Respect copyright and intellectual property rights',
            'Obtain necessary permissions for uploaded photos',
            'Maintain appropriate and respectful content',
            'Keep login credentials secure and confidential'
          ]
        },
        {
          type: 'list',
          title: 'User Must Not:',
          items: [
            'Upload inappropriate, offensive, or illegal content',
            'Impersonate others or provide false information',
            'Attempt to hack or disrupt our services',
            'Share memorials without consent of involved parties',
            'Use the service for commercial purposes without permission'
          ]
        },
        {
          type: 'paragraph',
          text: 'We reserve the right to remove any content that violates these terms or is deemed inappropriate.'
        }
      ]
    },
    'payments': {
      title: 'Payments & Refund Policy',
      content: [
        {
          type: 'paragraph',
          text: '4revah operates on a "first memorial free" model, with fees applied for additional memorials and premium features.'
        },
        {
          type: 'list',
          title: 'Payment Terms:',
          items: [
            'First memorial PDF: FREE',
            'Additional memorial PDFs: KSh 500 each',
            'Family plan (4 memorials): KSh 1,500',
            'Payments processed securely via M-Pesa',
            'All prices in Kenyan Shillings (KSh)'
          ]
        },
        {
          type: 'list',
          title: 'Refund Policy:',
          items: [
            'Full refunds available within 30 days of payment if service not used',
            'Partial refunds considered for technical issues we cannot resolve',
            'No refunds for completed memorial downloads',
            'Refund requests must be submitted via email to support@4revah.com'
          ]
        },
        {
          type: 'notice',
          text: 'We reserve the right to change pricing with 30 days notice. Current users will maintain their existing rates for active memorials.'
        }
      ]
    },
    'privacy': {
      title: 'Privacy & Data Protection',
      content: [
        {
          type: 'paragraph',
          text: 'We take your privacy seriously and are committed to protecting your personal information and memorial data.'
        },
        {
          type: 'list',
          title: 'Data We Collect:',
          items: [
            'Account information (name, email, phone)',
            'Memorial content (photos, stories, dates)',
            'Payment information (processed securely via M-Pesa)',
            'Usage data and analytics'
          ]
        },
        {
          type: 'list',
          title: 'How We Use Your Data:',
          items: [
            'To provide and maintain our Service',
            'To process your payments',
            'To communicate with you about your memorials',
            'To improve our services',
            'To comply with legal obligations'
          ]
        },
        {
          type: 'paragraph',
          text: 'We do not sell your personal data to third parties. Memorial data is stored securely and can be deleted upon request.'
        },
        {
          type: 'notice',
          text: 'By using our Service, you consent to our Privacy Policy and data practices as described therein.'
        }
      ]
    },
    'liability': {
      title: 'Limitation of Liability',
      content: [
        {
          type: 'paragraph',
          text: '4revah provides its services on an "as-is" basis and makes no warranties regarding uninterrupted service or data loss prevention.'
        },
        {
          type: 'list',
          title: 'Limitations:',
          items: [
            'We are not liable for emotional distress related to memorial content',
            'We are not responsible for user-generated content accuracy',
            'We do not guarantee permanent data storage',
            'Service may be interrupted for maintenance or updates',
            'Users are responsible for backing up their memorial data'
          ]
        },
        {
          type: 'list',
          title: 'Indemnification:',
          items: [
            'You agree to indemnify 4revah against claims arising from your use',
            'You are responsible for content you upload and share',
            'You accept liability for any copyright violations',
            'You agree to resolve disputes through Kenyan law and courts'
          ]
        },
        {
          type: 'paragraph',
          text: 'Our maximum liability to you shall not exceed the amount you have paid for our services in the past 6 months.'
        }
      ]
    }
  };

  const quickFacts = [
    {
      icon: Heart,
      title: "Respectful Service",
      description: "We treat every memorial with the dignity and respect it deserves"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your data is protected with industry-standard security measures"
    },
    {
      icon: Download,
      title: "Lifetime Access",
      description: "Access your memorials anytime, with lifetime storage included"
    },
    {
      icon: Users,
      title: "Family Friendly",
      description: "Designed for families to collaborate and remember together"
    }
  ];

  const prohibitedContent = [
    "Hate speech or discriminatory content",
    "Violent or graphic material",
    "Sexually explicit content",
    "Copyrighted material without permission",
    "False or misleading information",
    "Commercial advertising",
    "Personal attacks or harassment",
    "Illegal activities or content"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/20 to-gray-50/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-6">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-semibold">Legal Documents</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
            Terms of Service
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Please read these terms carefully before using our memorial creation services. 
            By using 4revah, you agree to be bound by these terms and conditions.
          </p>

          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Important Notice</h3>
            </div>
            <p className="text-gray-700 text-sm">
              Last updated: {new Date().toLocaleDateString()}. These terms constitute a legal agreement between you and 4revah. 
              We recommend reviewing them thoroughly.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 sticky top-8">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                Sections
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-orange-50 border-2 border-orange-200 text-orange-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${section.bgColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${section.textColor}`} />
                        </div>
                        <span className="text-sm">{section.title}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Facts */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Key Principles</h4>
                <div className="space-y-3">
                  {quickFacts.map((fact, index) => {
                    const Icon = fact.icon;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{fact.title}</div>
                          <div className="text-xs text-gray-600">{fact.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-12 h-12 bg-gradient-to-r ${sections.find(s => s.id === activeSection)?.color} rounded-xl flex items-center justify-center`}>
                  {React.createElement(sections.find(s => s.id === activeSection)?.icon || FileText, { 
                    className: "w-6 h-6 text-white" 
                  })}
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {termsContent[activeSection as keyof typeof termsContent]?.title}
                  </h2>
                  <p className="text-gray-600">Understanding your rights and responsibilities</p>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                {termsContent[activeSection as keyof typeof termsContent]?.content.map((item, index) => (
                  <div key={index} className="mb-6">
                    {item.type === 'paragraph' && (
                      <p className="text-gray-700 leading-relaxed">{item.text}</p>
                    )}
                    
                    {item.type === 'list' && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">{item.title}</h4>
                        <ul className="space-y-2">
                          {item.items?.map((listItem, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-3 text-gray-700">
                              {activeSection === 'user-responsibilities' && item.title.includes('Must Not') ? (
                                <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                              ) : (
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                              )}
                              {listItem}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {item.type === 'notice' && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">{item.text}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Prohibited Content Section */}
              {activeSection === 'user-responsibilities' && (
                <div className="mt-8 p-6 bg-red-50 rounded-2xl border-2 border-red-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    Prohibited Content
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {prohibitedContent.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Questions?</h4>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">support@4revah.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">+254 700 000 000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Acceptance Footer */}
            <div className="mt-6 text-center">
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <p className="text-gray-700 mb-4">
                  By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 sm:p-12 text-white">
            <Shield className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" />
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Create Your Memorial?
            </h3>
            <p className="text-orange-100 text-lg mb-6 max-w-2xl mx-auto">
              Start honoring your loved ones with our secure and respectful platform. 
              Your first memorial is completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
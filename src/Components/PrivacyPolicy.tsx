import React, { useState } from 'react';
import { 
  Shield,
  Lock,
  User,
  FileText,
  Eye,
  Share2,
  Trash2,
  Download,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  Heart,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import TopNav from '../Components/TopNav';
import {Footer} from '../Components/Footer';

const PrivacyPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      id: 'data-collection',
      title: 'Data We Collect',
      icon: Download,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      id: 'data-use',
      title: 'How We Use Data',
      icon: Share2,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      id: 'data-protection',
      title: 'Data Protection',
      icon: Lock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    },
    {
      id: 'your-rights',
      title: 'Your Rights',
      icon: User,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600'
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: Mail,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600'
    }
  ];

  const privacyContent = {
    'introduction': {
      title: 'Introduction & Commitment',
      content: [
        {
          type: 'paragraph',
          text: 'At 4revah, we understand that memorial data is deeply personal and sensitive. We are committed to protecting your privacy and handling your personal information with the utmost care and respect.'
        },
        {
          type: 'paragraph',
          text: 'This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our memorial creation services. Please read this policy carefully to understand our practices.'
        },
        {
          type: 'list',
          title: 'Our Commitment:',
          items: [
            'We treat all memorial data with dignity and respect',
            'We implement strong security measures to protect your information',
            'We are transparent about our data practices',
            'We never sell your personal data to third parties',
            'We give you control over your information'
          ]
        },
        {
          type: 'notice',
          text: 'By using our services, you agree to the collection and use of information in accordance with this policy. We are compliant with applicable data protection laws, including the Data Protection Act of Kenya.'
        }
      ]
    },
    'data-collection': {
      title: 'Information We Collect',
      content: [
        {
          type: 'paragraph',
          text: 'We collect several types of information to provide and improve our services to you. This includes:'
        },
        {
          type: 'list',
          title: 'Personal Information:',
          items: [
            'Account information (name, email address, phone number)',
            'Payment information processed securely via M-Pesa',
            'Contact details for memorial collaboration'
          ]
        },
        {
          type: 'list',
          title: 'Memorial Content:',
          items: [
            'Photos and images of your loved ones',
            'Life stories, biographies, and memories',
            'Dates of birth, passing, and other significant events',
            'Family relationships and connections',
            'User-contributed stories and condolences'
          ]
        },
        {
          type: 'list',
          title: 'Technical Information:',
          items: [
            'IP addresses and device information',
            'Browser type and version',
            'Usage patterns and service interactions',
            'Cookies and similar tracking technologies'
          ]
        },
        {
          type: 'paragraph',
          text: 'We only collect information that is necessary to provide our services and enhance your experience.'
        }
      ]
    },
    'data-use': {
      title: 'How We Use Your Information',
      content: [
        {
          type: 'paragraph',
          text: 'We use the collected information for various purposes to provide and improve our services while maintaining the dignity and respect that memorial content deserves.'
        },
        {
          type: 'list',
          title: 'Service Provision:',
          items: [
            'Create and display digital memorial pages',
            'Generate and deliver PDF memorial books',
            'Process payments via M-Pesa',
            'Enable family collaboration features',
            'Provide customer support'
          ]
        },
        {
          type: 'list',
          title: 'Communication:',
          items: [
            'Send service-related notifications',
            'Respond to your inquiries and requests',
            'Send important updates about our services',
            'Provide memorial status updates'
          ]
        },
        {
          type: 'list',
          title: 'Improvement & Analytics:',
          items: [
            'Understand how users interact with our services',
            'Improve website functionality and user experience',
            'Develop new features and services',
            'Ensure platform security and prevent fraud'
          ]
        },
        {
          type: 'notice',
          text: 'We do not use memorial content for marketing purposes or share specific memorial data with third parties for advertising. Aggregated, anonymized data may be used for service improvement.'
        }
      ]
    },
    'data-protection': {
      title: 'Data Protection & Security',
      content: [
        {
          type: 'paragraph',
          text: 'We implement comprehensive security measures to protect your sensitive memorial data from unauthorized access, alteration, disclosure, or destruction.'
        },
        {
          type: 'list',
          title: 'Security Measures:',
          items: [
            'SSL encryption for all data transmissions',
            'Secure server infrastructure with regular updates',
            'Access controls and authentication systems',
            'Regular security audits and monitoring',
            'Data backup and disaster recovery procedures'
          ]
        },
        {
          type: 'list',
          title: 'Data Storage:',
          items: [
            'Memorial data stored on secure cloud servers',
            'Regular backups to prevent data loss',
            'Data retention according to user preferences',
            'Secure deletion processes for removed content'
          ]
        },
        {
          type: 'list',
          title: 'Third-Party Services:',
          items: [
            'M-Pesa for secure payment processing',
            'Cloud storage providers with strong security',
            'Analytics services with data anonymization',
            'All partners are vetted for privacy compliance'
          ]
        },
        {
          type: 'paragraph',
          text: 'While we implement robust security measures, no method of transmission over the Internet or electronic storage is 100% secure. We continuously work to maintain the highest security standards.'
        }
      ]
    },
    'your-rights': {
      title: 'Your Data Protection Rights',
      content: [
        {
          type: 'paragraph',
          text: 'You have several rights regarding your personal data. We are committed to honoring these rights and providing you with control over your information.'
        },
        {
          type: 'list',
          title: 'Your Rights Include:',
          items: [
            'Access to your personal data we hold',
            'Correction of inaccurate or incomplete data',
            'Deletion of your personal data (right to be forgotten)',
            'Restriction of processing your data',
            'Data portability to another service',
            'Objection to processing of your data'
          ]
        },
        {
          type: 'list',
          title: 'How to Exercise Your Rights:',
          items: [
            'Access and update your account information through your profile',
            'Contact us at support@4revah.com for data requests',
            'Use the delete function to remove memorials',
            'Export your memorial data using our download tools'
          ]
        },
        {
          type: 'paragraph',
          text: 'We will respond to all legitimate requests within 30 days. Some data may be retained for legal or legitimate business purposes, such as financial record-keeping.'
        },
        {
          type: 'notice',
          text: 'You can withdraw consent for data processing at any time, though this may affect our ability to provide certain services. Memorial content may be preserved if other family members have contributed.'
        }
      ]
    },
    'contact': {
      title: 'Contact & Questions',
      content: [
        {
          type: 'paragraph',
          text: 'We welcome your questions, concerns, and feedback about our privacy practices. Our team is dedicated to addressing your privacy concerns promptly and transparently.'
        },
        {
          type: 'list',
          title: 'Contact Information:',
          items: [
            'Email: support@4revah.com',
            'Phone: +254 700 000 000',
            'Facebook Messenger: @4revah',
            'Response Time: Within 24 hours for privacy-related inquiries'
          ]
        },
        {
          type: 'list',
          title: 'Data Protection Officer:',
          items: [
            'All privacy-related matters are handled by our dedicated team',
            'Trained in data protection best practices',
            'Available to address complex privacy concerns',
            'Committed to resolving issues satisfactorily'
          ]
        },
        {
          type: 'paragraph',
          text: 'If you have concerns about how we handle your personal data, you also have the right to lodge a complaint with the Office of the Data Protection Commissioner in Kenya.'
        },
        {
          type: 'notice',
          text: 'This Privacy Policy may be updated periodically to reflect changes in our practices or legal requirements. We will notify users of significant changes through email or platform notifications.'
        }
      ]
    }
  };

  const dataPrinciples = [
    {
      icon: Shield,
      title: "Respect & Dignity",
      description: "All memorial data is treated with the respect and dignity it deserves"
    },
    {
      icon: Lock,
      title: "Security First",
      description: "Enterprise-grade security measures protect your sensitive information"
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "Clear communication about how we handle and use your data"
    },
    {
      icon: Trash2,
      title: "Your Control",
      description: "You have full control over your data and can delete it anytime"
    }
  ];

  const dataRetention = [
    {
      period: "Account Data",
      duration: "As long as your account is active",
      notes: "Deleted upon account closure request"
    },
    {
      period: "Memorial Content",
      duration: "Indefinitely (unless deleted)",
      notes: "Preserved to honor your loved one's memory"
    },
    {
      period: "Payment Records",
      duration: "7 years",
      notes: "Required for financial and tax compliance"
    },
    {
      period: "Analytics Data",
      duration: "26 months",
      notes: "Anonymized and aggregated for service improvement"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-gray-50/20 py-8">
      <TopNav/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-semibold">Privacy & Data Protection</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your privacy is our priority. We are committed to protecting your personal information 
            and memorial data with the highest standards of security and respect.
          </p>

          <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Our Promise to You</h3>
            </div>
            <p className="text-gray-700 text-sm">
              We never sell your personal data. Your memorial content is treated with dignity and respect. 
              You have full control over your information at all times.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 sticky top-8">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Policy Sections
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
                          ? 'bg-blue-50 border-2 border-blue-200 text-blue-700 font-semibold'
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

              {/* Data Principles */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Our Data Principles</h4>
                <div className="space-y-3">
                  {dataPrinciples.map((principle, index) => {
                    const Icon = principle.icon;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{principle.title}</div>
                          <div className="text-xs text-gray-600">{principle.description}</div>
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
                    {privacyContent[activeSection as keyof typeof privacyContent]?.title}
                  </h2>
                  <p className="text-gray-600">Understanding how we protect and handle your data</p>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                {privacyContent[activeSection as keyof typeof privacyContent]?.content.map((item, index) => (
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
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                              {listItem}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {item.type === 'notice' && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded-r-lg">
                        <div className="flex">
                          <div className="shrink-0">
                            <AlertCircle className="h-5 w-5 text-blue-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-blue-700">{item.text}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Data Retention Table */}
              {activeSection === 'data-protection' && (
                <div className="mt-8 p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    Data Retention Periods
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-300">
                          <th className="text-left py-3 font-semibold text-gray-900">Data Type</th>
                          <th className="text-left py-3 font-semibold text-gray-900">Retention Period</th>
                          <th className="text-left py-3 font-semibold text-gray-900">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {dataRetention.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-100">
                            <td className="py-3 font-medium text-gray-900">{item.period}</td>
                            <td className="py-3 text-gray-700">{item.duration}</td>
                            <td className="py-3 text-gray-600">{item.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {activeSection === 'your-rights' && (
                <div className="mt-8 grid sm:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Download className="w-5 h-5 text-green-600" />
                      <h5 className="font-semibold text-gray-900">Export Your Data</h5>
                    </div>
                    <p className="text-sm text-gray-600">
                      Download all your memorial data in a portable format anytime from your account settings.
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Trash2 className="w-5 h-5 text-blue-600" />
                      <h5 className="font-semibold text-gray-900">Delete Your Data</h5>
                    </div>
                    <p className="text-sm text-gray-600">
                      Permanently remove your account and all associated data through the account deletion feature.
                    </p>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Need Help?</h4>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">Email Support</div>
                      <div className="text-gray-600">support@4revah.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">Phone Support</div>
                      <div className="text-gray-600">+254 700 000 000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Policy Footer */}
            <div className="mt-6 text-center">
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">Last updated: {new Date().toLocaleDateString()}</span>
                </div>
                <p className="text-gray-600 text-sm">
                  We may update this policy to reflect changes in our practices. Continued use of our services 
                  after changes constitutes acceptance of the updated policy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 sm:p-12 text-white">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" />
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Create with Confidence
            </h3>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              Your memorials are safe with us. Start creating beautiful tributes with the assurance 
              that your data is protected with enterprise-grade security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                Start Your Memorial
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50">
                Contact Privacy Team
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

    </div>
  );
};

export default PrivacyPolicy;
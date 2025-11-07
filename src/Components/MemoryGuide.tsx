import React, { useState } from 'react';
import { 
  Heart,
  BookOpen,
  Camera,
  Users,
  Clock,
  Star,
  FileText,
  Lightbulb,
  Quote,
  Image,
  Cake,
  GraduationCap,
  Briefcase,
  Globe,
  Award,
  TreePine,
  ArrowRight,
  Share2,
  CheckCircle
} from 'lucide-react';
import TopNav from '../Components/TopNav';
import {Footer} from '../Components/Footer';

const MemoryGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const guideSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      id: 'life-story',
      title: 'Writing Life Story',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      id: 'photos',
      title: 'Choosing Photos',
      icon: Camera,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      id: 'memories',
      title: 'Special Memories',
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600'
    },
    {
      id: 'timeline',
      title: 'Life Timeline',
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    },
    {
      id: 'family',
      title: 'Family & Friends',
      icon: Users,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600'
    }
  ];

  const gettingStarted = {
    title: "How to Begin Your Memorial",
    steps: [
      {
        step: 1,
        icon: BookOpen,
        title: "Gather Information",
        description: "Collect basic information about your loved one",
        details: [
          "Full name and nickname",
          "Date and place of birth",
          "Date and place of passing",
          "Family members' names"
        ]
      },
      {
        step: 2,
        icon: Camera,
        title: "Select Photos",
        description: "Choose meaningful photos that tell their story",
        details: [
          "Recent and childhood photos",
          "Photos with family and friends",
          "Special moments and achievements",
          "Candid and formal portraits"
        ]
      },
      {
        step: 3,
        icon: FileText,
        title: "Write from the Heart",
        description: "Share stories that capture their essence",
        details: [
          "Start with key life events",
          "Include personality traits",
          "Share favorite memories",
          "Mention hobbies and passions"
        ]
      },
      {
        step: 4,
        icon: Users,
        title: "Invite Contributions",
        description: "Ask family and friends to share memories",
        details: [
          "Send invitation links",
          "Collect stories and photos",
          "Include different perspectives",
          "Create a collective tribute"
        ]
      }
    ],
    tips: [
      "Take your time - there's no rush to complete everything at once",
      "Work on sections that feel comfortable first",
      "Save your progress and return later",
      "Ask other family members to help with different sections"
    ]
  };

  const lifeStoryTips = [
    {
      icon: Lightbulb,
      title: "Start with Basics",
      description: "Begin with their early life, family background, and upbringing",
      examples: ["Born in Nairobi in 1950...", "Growing up in a family of six..."]
    },
    {
      icon: Heart,
      title: "Capture Personality",
      description: "Describe their character, values, and what made them special",
      examples: ["Known for her infectious laugh...", "Always put family first..."]
    },
    {
      icon: Briefcase,
      title: "Career & Passions",
      description: "Share their professional journey and personal interests",
      examples: ["Dedicated teacher for 35 years...", "Passionate about gardening..."]
    },
    {
      icon: Star,
      title: "Achievements & Legacy",
      description: "Highlight accomplishments and impact on others",
      examples: ["Founded the community library...", "Mentored countless young people..."]
    },
    {
      icon: Quote,
      title: "Favorite Sayings",
      description: "Include quotes, mottos, or phrases they lived by",
      examples: ["'Family is everything'", "'Work hard, be kind'"]
    }
  ];

  const photoCategories = [
    {
      icon: Cake,
      title: "Early Years",
      description: "Childhood and young adult photos",
      tips: ["Baby pictures", "School photos", "Graduation", "Early career"]
    },
    {
      icon: GraduationCap,
      title: "Milestones",
      description: "Important life events and achievements",
      tips: ["Wedding", "Graduations", "Career achievements", "Awards"]
    },
    {
      icon: Users,
      title: "Family & Friends",
      description: "Photos with loved ones and social connections",
      tips: ["Family gatherings", "Friendships", "Community events", "Group photos"]
    },
    {
      icon: TreePine,
      title: "Hobbies & Passions",
      description: "Activities and interests they enjoyed",
      tips: ["Travel photos", "Sports", "Arts and crafts", "Volunteer work"]
    },
    {
      icon: Heart,
      title: "Special Moments",
      description: "Candid shots showing their personality",
      tips: ["Laughing", "Helping others", "Relaxing", "Being themselves"]
    }
  ];

  const memoryPrompts = [
    {
      category: "Childhood Memories",
      prompts: [
        "What was their favorite childhood story to tell?",
        "What games did they love to play as a child?",
        "What were their school days like?",
        "Who were their childhood friends?"
      ]
    },
    {
      category: "Family Life",
      prompts: [
        "What family traditions did they cherish?",
        "How did they show love to family members?",
        "What was their role in the family?",
        "Favorite family vacation or gathering?"
      ]
    },
    {
      category: "Personality & Character",
      prompts: [
        "What made them laugh the hardest?",
        "How did they handle difficult situations?",
        "What values were most important to them?",
        "What were their little quirks or habits?"
      ]
    },
    {
      category: "Accomplishments",
      prompts: [
        "What achievement were they most proud of?",
        "How did they impact their community?",
        "What challenges did they overcome?",
        "What legacy did they leave behind?"
      ]
    }
  ];

  const timelineEvents = [
    {
      period: "Early Life",
      events: ["Birth and childhood", "Education", "First experiences", "Family background"]
    },
    {
      period: "Young Adulthood",
      events: ["Career beginnings", "Marriage/Partnership", "Starting a family", "Personal growth"]
    },
    {
      period: "Middle Years",
      events: ["Career achievements", "Community involvement", "Family milestones", "Travels"]
    },
    {
      period: "Later Life",
      events: ["Retirement", "Grandchildren", "Wisdom sharing", "Life reflections"]
    }
  ];

  const quickTemplates = [
    {
      name: "Simple & Elegant",
      description: "Clean layout focusing on key life events",
      bestFor: "Quick creation, modern style",
      features: ["Timeline format", "Key photos", "Essential biography"]
    },
    {
      name: "Family Tribute",
      description: "Emphasis on family connections and memories",
      bestFor: "Large families, multiple contributors",
      features: ["Family tree section", "Multiple photo galleries", "Shared memories"]
    },
    {
      name: "Life Celebration",
      description: "Comprehensive coverage of entire life journey",
      bestFor: "Detailed tributes, full life story",
      features: ["Detailed timeline", "Multiple sections", "Achievements highlight"]
    },
    {
      name: "Photo Memorial",
      description: "Visual-focused with minimal text",
      bestFor: "Photo-rich memories, visual storytelling",
      features: ["Photo gallery focus", "Caption-based storytelling", "Visual layout"]
    }
  ];

  // Define activeContent with proper TypeScript typing
const activeContent: Record<string, React.ReactNode> = {
    'getting-started': (
      <div className="space-y-8">
        
        <div className="grid md:grid-cols-2 gap-8">
          {gettingStarted.steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-blue-600">Step {step.step}</div>
                    <h3 className="font-bold text-gray-900">{step.title}</h3>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-orange-600" />
            Helpful Tips for Getting Started
          </h4>
          <ul className="space-y-2">
            {gettingStarted.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-700">
                <Star className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
    'life-story': (
      <div className="space-y-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lifeStoryTips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{tip.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{tip.description}</p>
                <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                  <strong>Example:</strong> {tip.examples[0]}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
          <h4 className="font-bold text-gray-900 mb-4">Writing Prompts</h4>
          <div className="grid md:grid-cols-2 gap-6">
            {memoryPrompts.map((category, index) => (
              <div key={index}>
                <h5 className="font-semibold text-gray-900 mb-3">{category.category}</h5>
                <ul className="space-y-2">
                  {category.prompts.map((prompt, promptIndex) => (
                    <li key={promptIndex} className="text-sm text-gray-700 flex items-start gap-2">
                      <Quote className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {prompt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    'photos': (
      <div className="space-y-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photoCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{category.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                <ul className="space-y-1">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-xs text-gray-600 flex items-center gap-2">
                      <Image className="w-3 h-3 text-purple-500" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
          <h4 className="font-bold text-gray-900 mb-4">Photo Selection Tips</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Do's</h5>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Choose high-quality, clear photos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Include photos from different life stages
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Select photos that show personality
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Mix candid and formal shots
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Don'ts</h5>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Avoid blurry or dark photos
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Don't use only recent photos
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Avoid photos with many people (hard to identify)
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Don't include inappropriate content
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    'memories': (
      <div className="space-y-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
          <h4 className="font-bold text-gray-900 mb-6 text-center">Memory Categories to Include</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Love Stories", examples: ["How they met their partner", "Romantic gestures", "Love letters"] },
              { icon: Users, title: "Friendships", examples: ["Best friends", "Social circles", "Community bonds"] },
              { icon: Award, title: "Achievements", examples: ["Career milestones", "Personal goals", "Overcoming challenges"] },
              { icon: Globe, title: "Travel & Adventures", examples: ["Favorite places", "Memorable trips", "Local explorations"] }
            ].map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-pink-600" />
                  </div>
                  <h5 className="font-semibold text-gray-900 mb-2">{category.title}</h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {category.examples.map((example, exIndex) => (
                      <li key={exIndex}>{example}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-pink-50 rounded-2xl p-6 border-2 border-pink-200">
          <h4 className="font-bold text-gray-900 mb-4">Tips for Sharing Memories</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">For Family Members</h5>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Share childhood stories and family traditions</li>
                <li>Describe their role in the family</li>
                <li>Recall holiday memories and gatherings</li>
                <li>Share lessons they taught you</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">For Friends & Colleagues</h5>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Share work or project memories</li>
                <li>Describe their sense of humor</li>
                <li>Recall social events and outings</li>
                <li>Share how they helped or inspired you</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    'timeline': (
      <div className="space-y-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
          <h4 className="font-bold text-gray-900 mb-6">Life Timeline Structure</h4>
          <div className="space-y-6">
            {timelineEvents.map((period, index) => (
              <div key={index} className="flex gap-6">
                <div className="shrink-0 w-32">
                  <div className="bg-orange-100 text-orange-700 px-3 py-2 rounded-lg font-semibold text-sm">
                    {period.period}
                  </div>
                </div>
                <div className="flex-1">
                  <ul className="space-y-2">
                    {period.events.map((event, eventIndex) => (
                      <li key={eventIndex} className="flex items-center gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
          <h4 className="font-bold text-gray-900 mb-4">Timeline Enhancement Tips</h4>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h5 className="font-semibold mb-3">Include Dates & Locations</h5>
              <ul className="space-y-2">
                <li>Birth and important dates</li>
                <li>Educational milestones</li>
                <li>Career progression</li>
                <li>Family events</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Add Context</h5>
              <ul className="space-y-2">
                <li>Historical events happening at the time</li>
                <li>Family circumstances</li>
                <li>Personal challenges and triumphs</li>
                <li>Social and community involvement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    'family': (
      <div className="space-y-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
          <h4 className="font-bold text-gray-900 mb-6">Family & Friends Collaboration</h4>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Involving Family
              </h5>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Assign different sections to family members
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Create a shared photo collection
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Schedule family memory-sharing sessions
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Include multiple generations' perspectives
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-600" />
                Gathering Stories
              </h5>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Send memory prompts to friends
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Create a shared digital space for contributions
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Record video or audio memories
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Include work colleagues and community members
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {quickTemplates.map((template, index) => (
            <div key={index} className="bg-indigo-50 rounded-2xl p-6 border-2 border-indigo-200">
              <h5 className="font-bold text-gray-900 mb-2">{template.name}</h5>
              <p className="text-gray-600 text-sm mb-3">{template.description}</p>
              <div className="text-xs text-indigo-600 font-semibold mb-3">
                Best for: {template.bestFor}
              </div>
              <ul className="space-y-1 text-xs text-gray-700">
                {template.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-indigo-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    )
  };

  return (
    <div className="py-16 sm:py-20 lg:py-24 bg-linear-to-b from-white via-orange-50/20 to-gray-50/20">
            <TopNav/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4">
            <BookOpen className="w-4 h-4 fill-orange-600" />
            <span className="text-sm font-semibold">Memory Guide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Creating Meaningful Memorials
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive guide to help you create a beautiful, heartfelt tribute that truly honors your loved one's life and legacy.
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-12 lg:mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {guideSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`text-left p-4 rounded-2xl transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-white shadow-xl border-2 border-orange-200 transform -translate-y-1'
                      : 'bg-gray-50/50 border-2 border-transparent hover:border-orange-100 hover:shadow-lg'
                  }`}
                >
                  <div className={`w-10 h-10 ${section.bgColor} rounded-xl flex items-center justify-center mb-2`}>
                    <Icon className={`w-5 h-5 ${section.textColor}`} />
                  </div>
                  <h3 className={`font-semibold text-sm ${
                    activeSection === section.id ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {section.title}
                  </h3>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Content */}
        <div className="mb-16 lg:mb-20">
          {activeContent[activeSection] || activeContent['getting-started']}
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="bg-linear-to-r from-orange-500 to-amber-500 rounded-2xl p-8 sm:p-12 text-white max-w-4xl mx-auto">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 fill-white" />
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Create Your Memorial?
            </h3>
            <p className="text-orange-100 text-lg mb-6 max-w-2xl mx-auto">
              Use this guide to create a beautiful tribute. Remember, your first memorial is completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                Start Creating Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50">
                Download Guide PDF
              </button>
            </div>
          </div>
        </div>
      </div>
         <Footer />
    </div>
  );
};

// Add the missing XCircle component
const XCircle: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default MemoryGuide;
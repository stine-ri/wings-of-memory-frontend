import React, { useState } from 'react';

interface FamilyMember {
  name: string;
  image?: string;
  relation: string;
}

interface FamilyTreeSectionProps {
  members: FamilyMember[];
  deceasedName?: string;
  deceasedImage?: string;
}

const FamilyTreeNode: React.FC<{ member: FamilyMember; index: number }> = ({ 
  member, 
  index 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="flex flex-col items-center animate-fade-in min-w-[160px] sm:min-w-[180px] md:min-w-[200px]"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-4">
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full blur-2xl transition-opacity duration-500 ${
            isHovered ? 'opacity-60' : 'opacity-0'
          }`}
        ></div>
        <div 
          className={`relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl transition-all duration-300 ${
            isHovered ? 'scale-110 shadow-2xl' : ''
          }`}
        >
          {member.image ? (
            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <svg className="w-14 h-14 md:w-16 md:h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      </div>
      <h3 className="font-semibold text-gray-800 text-center text-sm sm:text-base md:text-lg leading-tight mb-1 px-2">
        {member.name}
      </h3>
      <p className="text-xs sm:text-sm text-gray-600">{member.relation}</p>
    </div>
  );
};

export const FamilyTreeSection: React.FC<FamilyTreeSectionProps> = ({ 
  members,
  deceasedName = "Joanne J. Davis",
  deceasedImage
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Organize members by relation
  const father = members.find(m => m.relation === 'Father');
  const mother = members.find(m => m.relation === 'Mother');
  const spouse = members.find(m => m.relation === 'Spouse');
  const children = members.filter(m => m.relation === 'Son' || m.relation === 'Daughter');
  const siblings = members.filter(m => m.relation === 'Brother' || m.relation === 'Sister');

  return (
    <section id="family" className="py-12 md:py-20 px-4 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 inline-block relative animate-fade-in">
            Family tree
            <div className="absolute -bottom-3 left-0 w-24 md:w-32 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full px-4">
            
            {/* First Generation - Parents */}
            <div className="flex justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 mb-16 md:mb-20 relative">
              {father && (
                <div className="relative">
                  <FamilyTreeNode member={father} index={0} />
                </div>
              )}
              {mother && (
                <div className="relative">
                  <FamilyTreeNode member={mother} index={1} />
                </div>
              )}
              
              {/* Vertical line down from parents */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-16 md:h-20 bg-gray-400"></div>
            </div>

            {/* Horizontal connector line */}
            <div className="flex justify-center mb-16 md:mb-20">
              <div className="w-72 sm:w-96 md:w-[32rem] lg:w-[40rem] h-0.5 bg-gray-400 relative">
                {/* Center vertical line going down */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-16 md:h-20 bg-gray-400"></div>
              </div>
            </div>

            {/* Second Generation - Deceased & Spouse */}
            <div className="flex justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 mb-16 md:mb-20 relative">
              {/* Deceased person (Joanne) */}
              <div 
                className="flex flex-col items-center animate-fade-in min-w-[160px] sm:min-w-[180px] md:min-w-[200px]"
                style={{ animationDelay: '200ms' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="relative mb-4">
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full blur-2xl transition-opacity duration-500 ${
                      isHovered ? 'opacity-60' : 'opacity-0'
                    }`}
                  ></div>
                  <div 
                    className={`relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl transition-all duration-300 ${
                      isHovered ? 'scale-110 shadow-2xl' : ''
                    }`}
                  >
                    {deceasedImage ? (
                      <img src={deceasedImage} alt={deceasedName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <svg className="w-14 h-14 md:w-16 md:h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 text-center text-sm sm:text-base md:text-lg leading-tight mb-1 px-2">
                  {deceasedName}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">Deceased</p>
              </div>

              {spouse && (
                <div className="relative">
                  <FamilyTreeNode member={spouse} index={3} />
                </div>
              )}
              
              {/* Vertical line down to children */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-16 md:h-20 bg-gray-400"></div>
            </div>

            {/* Horizontal connector line for children */}
            {children.length > 0 && (
              <div className="flex justify-center mb-16 md:mb-20">
                <div className={`h-0.5 bg-gray-400 relative ${children.length === 2 ? 'w-56 sm:w-72 md:w-80 lg:w-96' : 'w-40 sm:w-56 md:w-64'}`}>
                  {children.map((_, index) => (
                    <div 
                      key={index}
                      className="absolute top-0 w-0.5 h-16 md:h-20 bg-gray-400"
                      style={{ 
                        left: children.length === 1 ? '50%' : `${(100 / (children.length - 1)) * index}%`,
                        transform: 'translateX(-50%)'
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {/* Third Generation - Children */}
            <div className="flex justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 mb-16">
              {children.map((member, index) => (
                <FamilyTreeNode key={index} member={member} index={4 + index} />
              ))}
            </div>

            {/* Siblings (side branch) */}
            {siblings.length > 0 && (
              <div className="flex justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 mt-12 pt-12 border-t-2 border-gray-300">
                {siblings.map((member, index) => (
                  <FamilyTreeNode key={index} member={member} index={6 + index} />
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 italic">Hover over family members to see them highlighted</p>
        </div>
      </div>
    </section>
  );
};
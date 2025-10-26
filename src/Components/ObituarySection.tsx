import React from 'react';

interface ObituarySectionProps {
  text: string;
}

export const ObituarySection: React.FC<ObituarySectionProps> = ({ text }) => {
  const paragraphs = text.split('\n\n');

  return (
    <section id="obituary" className="py-16 sm:py-20 px-3 sm:px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Left-aligned Title with Half Underline - Same as Timeline */}
        <div className="mb-8 sm:mb-12 sm:-ml-32">
          <h2 className="text-4xl sm:text-5xl font-serif text-gray-800 inline-block relative">
            Obituary
            <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-amber-500"></div>
          </h2>
        </div>
        <div className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed text-base sm:text-lg">
          {paragraphs.map((paragraph, index) => {
            if (index === 0) {
              return (
                <p key={index} className="first-letter:text-5xl sm:first-letter:text-7xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-amber-600 first-letter:leading-none first-letter:mt-1">
                  {paragraph}
                </p>
              );
            }
            return <p key={index} className="font-light">{paragraph}</p>;
          })}
        </div>
      </div>
    </section>
  );
};
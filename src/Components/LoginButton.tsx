import React from 'react';
import { LogIn } from 'lucide-react';

interface LoginButtonProps {
  onClick: () => void;
  mobile?: boolean;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ onClick, mobile = false }) => {
  if (mobile) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-amber-50 transition-colors rounded-lg text-sm sm:text-base"
      >
        <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Login</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-amber-600 transition-colors rounded-xl hover:bg-amber-50 text-sm lg:text-base"
    >
      <LogIn className="w-4 h-4 lg:w-5 lg:h-5" />
      <span>Login</span>
    </button>
  );
};
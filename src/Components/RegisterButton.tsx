import React from 'react';
import { UserPlus } from 'lucide-react';

interface RegisterButtonProps {
  onClick: () => void;
  mobile?: boolean;
}

export const RegisterButton: React.FC<RegisterButtonProps> = ({ onClick, mobile = false }) => {
  if (mobile) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all rounded-lg text-sm sm:text-base justify-center"
      >
        <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Register</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 lg:px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-md text-sm lg:text-base"
    >
      <UserPlus className="w-4 h-4 lg:w-5 lg:h-5" />
      <span>Register</span>
    </button>
  );
};
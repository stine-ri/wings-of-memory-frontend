import { useContext } from 'react';
import { MemorialContext } from '../Contexts/MemorialContext';
import type { MemorialContextType } from '../Contexts/MemorialContext';

export const useMemorial = (): MemorialContextType => {
  const context = useContext(MemorialContext);
  if (context === undefined) {
    throw new Error('useMemorial must be used within a MemorialProvider');
  }
  return context;
};
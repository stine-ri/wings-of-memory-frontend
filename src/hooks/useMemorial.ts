// hooks/useMemorial.ts - COMPLETE FIXED VERSION
import { useContext, useEffect, useState, useCallback } from 'react';
import { MemorialContext } from '../Contexts/MemorialContext';
import type { MemorialContextType } from '../Contexts/MemorialContext';

interface UseMemorialOptions {
  autoRetry?: boolean;
  maxRetries?: number;
  requiredFields?: string[];
}

interface UseMemorialReturn extends MemorialContextType {
  isReady: boolean;
  retryCount: number;
  retry: () => void;
}

/**
 * Enhanced hook for accessing memorial data with safety checks and retry logic
 * 
 * @example
 * ```tsx
 * const { memorialData, isReady, loading, retry } = useMemorial({
 *   autoRetry: true,
 *   maxRetries: 3
 * });
 * 
 * if (!isReady) return <LoadingSpinner />;
 * 
 * return <div>{memorialData.name}</div>
 * ```
 */
export const useMemorial = (options: UseMemorialOptions = {}): UseMemorialReturn => {
  const {
    autoRetry = false,
    maxRetries = 3,
    requiredFields = []
  } = options;

  const context = useContext(MemorialContext);
  const [retryCount, setRetryCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  if (!context) {
    throw new Error('useMemorial must be used within a MemorialProvider');
  }

  const { 
    memorialData, 
    loading, 
    dataIntegrity,
    refreshMemorial 
  } = context;

  // Check if data is ready
  useEffect(() => {
    if (!memorialData || loading) {
      setIsReady(false);
      return;
    }

    // If no specific fields required, check basic data integrity
    if (requiredFields.length === 0) {
      setIsReady(true);
      return;
    }

    // Check if all required fields are present and valid
    const allFieldsReady = requiredFields.every(field => {
      const value = memorialData[field as keyof typeof memorialData];
      
      // For arrays, check they exist
      if (Array.isArray(value)) {
        return true; // Arrays are valid even if empty
      }
      
      // For objects, check they exist
      if (typeof value === 'object' && value !== null) {
        return true;
      }
      
      // For strings, check they're not empty
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }
      
      // For other types, just check they exist
      return value != null;
    });

    setIsReady(allFieldsReady);

    // Auto-retry if fields not ready
    if (autoRetry && !allFieldsReady && retryCount < maxRetries && !loading) {
      const missingFields = requiredFields.filter(field => {
        const value = memorialData[field as keyof typeof memorialData];
        if (Array.isArray(value)) return false; // Arrays are valid
        if (typeof value === 'string') return !value.trim();
        return !value;
      });

      console.warn(`⚠️ useMemorial: Missing required fields, retrying... (${retryCount + 1}/${maxRetries})`, {
        missing: missingFields,
        dataIntegrity
      });

      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        refreshMemorial().catch(err => {
          console.error('❌ useMemorial: Retry failed:', err);
        });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [
    memorialData, 
    loading, 
    dataIntegrity, 
    requiredFields, 
    autoRetry, 
    maxRetries, 
    retryCount, 
    refreshMemorial
  ]);

  // Manual retry function
  const retry = useCallback(() => {
    console.log('🔄 useMemorial: Manual retry triggered');
    setRetryCount(0);
    refreshMemorial().catch(err => {
      console.error('❌ useMemorial: Manual retry failed:', err);
    });
  }, [refreshMemorial]);

  return {
    ...context,
    isReady,
    retryCount,
    retry
  };
};

// Default export for convenience
export default useMemorial;
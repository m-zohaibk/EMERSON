
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * A central listener for Firebase Security Rules errors.
 * Surfaces detailed contextual errors to the development overlay.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // Throwing the error here will trigger the Next.js Error Overlay in development
      // which shows the rich contextual JSON provided by the system.
      console.error('Firestore Permission Error Detected:', error.context);
      throw error;
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, []);

  return null;
}

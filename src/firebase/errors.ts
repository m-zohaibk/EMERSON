'use client';

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

/**
 * Custom error class for Firestore permission issues.
 * Explicitly structures context for better logging and debugging.
 */
export class FirestorePermissionError extends Error {
  path: string;
  operation: string;
  requestResourceData?: any;
  
  constructor(context: SecurityRuleContext) {
    super(`Missing or insufficient permissions: ${context.operation} at ${context.path}`);
    this.name = 'FirestorePermissionError';
    this.path = context.path;
    this.operation = context.operation;
    this.requestResourceData = context.requestResourceData;
  }

  /**
   * Returns a loggable representation of the error context.
   */
  get context(): SecurityRuleContext {
    return {
      path: this.path,
      operation: this.operation as any,
      requestResourceData: this.requestResourceData,
    };
  }
}
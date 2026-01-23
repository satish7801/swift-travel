
export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public readonly context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    // Sanitize resource data before logging to avoid leaking sensitive information in production logs.
    const displayContext = { ...context };
    if (displayContext.requestResourceData && 'savedAt' in displayContext.requestResourceData) {
        displayContext.requestResourceData.savedAt = '[Timestamp]';
    }


    const message = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${JSON.stringify(
      displayContext,
      null,
      2
    )}`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;

    // This is to make the error visible in the Next.js dev overlay
    if (typeof (this as any).stack === 'string') {
        (this as any).stack = `${this.message}\n${(this as any).stack
        .split('\n')
        .slice(1)
        .join('\n')}`;
    }
  }
}


export type SecurityRuleContext = {
    path: string;
    operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
    requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
    public readonly context: SecurityRuleContext;

    constructor(context: SecurityRuleContext) {
        const operation = context.operation.toUpperCase();
        const path = context.path;
        super(`Firestore Permission Denied: ${operation} on ${path}`);
        this.name = 'FirestorePermissionError';
        this.context = context;
        Object.setPrototypeOf(this, FirestorePermissionError.prototype);
    }

    public toMetric() {
        return {
            message: this.message,
            context: this.context,
        };
    }
}

export class ErrorHandler {
  static handle(error, context = '') {
    console.error(`Error in ${context}:`, error);
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logToService(error, context);
    }
    
    return this.getUserFriendlyMessage(error);
  }

  static getUserFriendlyMessage(error) {
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    if (error.status === 404) {
      return 'The requested item was not found.';
    }
    
    if (error.status === 500) {
      return 'Server error. Please try again later.';
    }
    
    if (error.status === 401) {
      return 'Please log in to continue.';
    }
    
    return error.message || 'Something went wrong. Please try again.';
  }

  static logToService(error, context) {
    // In production, send to logging service like Sentry, LogRocket, etc.
    console.log('Would log to external service:', { error, context });
  }

  static async withErrorHandling(asyncFn, context = '') {
    try {
      return await asyncFn();
    } catch (error) {
      const message = this.handle(error, context);
      throw new Error(message);
    }
  }
}

export default ErrorHandler;
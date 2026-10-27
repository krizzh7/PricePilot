// Shared validation rules. Keep these in sync with the client forms by
// importing the exported constants instead of duplicating regular expressions.
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PASSWORD_MIN_LENGTH = 8;
export const MAX_SEARCH_LENGTH = 200;

export const emailSchema = {
  parse(value: unknown): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error('Email is required');
    }
    const email = value.trim().toLowerCase();
    if (!EMAIL_REGEX.test(email)) {
      throw new Error('Please enter a valid email address');
    }
    return email;
  },
};

export const passwordSchema = {
  parse(value: unknown): string {
    if (typeof value !== 'string' || !value) {
      throw new Error('Password is required');
    }
    if (value.length < PASSWORD_MIN_LENGTH) {
      throw new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
    }
    return value;
  },
};

export const searchQuerySchema = {
  parse(value: unknown): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error('Please enter a product name');
    }
    return value.trim().slice(0, MAX_SEARCH_LENGTH);
  },
};

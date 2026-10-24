const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

export const emailSchema = {
  parse(value: unknown): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error('Email is required');
    }
    const email = value.trim();
    if (!GMAIL_REGEX.test(email)) {
      throw new Error('Please enter a valid Gmail address');
    }
    return email.toLowerCase();
  },
};

export const passwordSchema = {
  parse(value: unknown): string {
    if (typeof value !== 'string' || !value) {
      throw new Error('Password is required');
    }
    if (value.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    return value;
  },
};

export const searchQuerySchema = {
  parse(value: unknown): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error('Please enter a product name');
    }
    return value.trim().slice(0, 200);
  },
};

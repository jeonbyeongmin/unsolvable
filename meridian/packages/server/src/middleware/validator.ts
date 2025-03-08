/**
 * Request body validation middleware using JSON schemas.
 *
 * @module middleware/validator
 */
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './errorHandler';

type SchemaRule = {
  type: 'string' | 'number' | 'boolean' | 'array';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
};

type Schema = Record<string, SchemaRule>;

/** Predefined validation schemas for common request bodies */
const schemas: Record<string, Schema> = {
  register: {
    email: { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: 'string', required: true, minLength: 8, maxLength: 128 },
    displayName: { type: 'string', required: true, minLength: 2, maxLength: 64 },
  },
  login: {
    email: { type: 'string', required: true },
    password: { type: 'string', required: true },
  },
  forgotPassword: {
    email: { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  },
  updateProfile: {
    displayName: { type: 'string', minLength: 2, maxLength: 64 },
    bio: { type: 'string', maxLength: 500 },
    timezone: { type: 'string', maxLength: 50 },
  },
  createChannel: {
    name: { type: 'string', required: true, minLength: 1, maxLength: 80 },
    description: { type: 'string', maxLength: 1000 },
    isPrivate: { type: 'boolean' },
  },
  updateChannel: {
    name: { type: 'string', minLength: 1, maxLength: 80 },
    description: { type: 'string', maxLength: 1000 },
    topic: { type: 'string', maxLength: 250 },
  },
  sendMessage: {
    content: { type: 'string', required: true, minLength: 1, maxLength: 4000 },
    replyTo: { type: 'string' },
  },
  editMessage: {
    content: { type: 'string', required: true, minLength: 1, maxLength: 4000 },
  },
  createWebhook: {
    url: { type: 'string', required: true },
    channelId: { type: 'string', required: true },
  },
  updateWebhook: {
    url: { type: 'string' },
    events: { type: 'array' },
  },
};

function validateAgainstSchema(body: Record<string, unknown>, schema: Schema): Record<string, string>[] {
  const errors: Record<string, string>[] = [];

  for (const [field, rule] of Object.entries(schema)) {
    const value = body[field];

    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push({ field, message: `${field} is required` });
      continue;
    }

    if (value === undefined || value === null) continue;

    if (rule.type === 'string' && typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push({ field, message: `${field} must be at least ${rule.minLength} characters` });
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push({ field, message: `${field} must be at most ${rule.maxLength} characters` });
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push({ field, message: `${field} has an invalid format` });
      }
    }
  }

  return errors;
}

/**
 * Creates validation middleware for a named schema.
 */
export function validateBody(schemaName: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const schema = schemas[schemaName];
    if (!schema) {
      next();
      return;
    }

    const errors = validateAgainstSchema(req.body, schema);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    next();
  };
}





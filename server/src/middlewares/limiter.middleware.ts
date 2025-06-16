import { rateLimit } from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  statusCode:429
});

export const userDataAccessLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 500,
  message: {
    error: 'Too many requests, please try again later.',
    retryAfter: '5 minutes',
  },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  statusCode:429
});

export const postDataAccessLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 500,
  message: {
    error: 'Too many requests, please try again later.',
    retryAfter: '5 minutes',
  },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  statusCode:429
});


import { z } from 'zod';
import { insertVoteSchema, facts, VOTE_TYPES } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  facts: {
    today: {
      method: 'GET' as const,
      path: '/api/facts/today',
      responses: {
        200: z.object({
          id: z.number(),
          content: z.string(),
          category: z.string(),
          imageUrl: z.string().nullable(),
          source: z.string().nullable(),
          stats: z.record(z.number()),
          totalVotes: z.number(),
        }),
        404: errorSchemas.notFound,
      },
    },
  },
  votes: {
    create: {
      method: 'POST' as const,
      path: '/api/votes',
      input: insertVoteSchema,
      responses: {
        201: z.object({
          stats: z.record(z.number()),
          totalVotes: z.number(),
        }),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

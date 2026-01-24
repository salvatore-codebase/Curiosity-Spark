
import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const facts = pgTable("facts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  category: text("category").notNull(), // 'tech', 'science', 'nature', 'history', 'random'
  imageUrl: text("image_url"),
  source: text("source"),
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  factId: integer("fact_id").notNull(),
  voteType: text("vote_type").notNull(), // 'ok', 'radical', 'holy_cow', 'butter_backside'
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===
export const insertFactSchema = createInsertSchema(facts).omit({ id: true });
export const insertVoteSchema = createInsertSchema(votes).omit({ id: true, createdAt: true });

// === EXPLICIT TYPES ===
export type Fact = typeof facts.$inferSelect;
export type InsertFact = z.infer<typeof insertFactSchema>;
export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;

// Vote types enum for type safety
export const VOTE_TYPES = {
  OK: "ok",
  RADICAL: "radical",
  HOLY_COW: "holy_cow",
  BUTTER_BACKSIDE: "butter_backside"
} as const;

export type VoteType = typeof VOTE_TYPES[keyof typeof VOTE_TYPES];

// Response types
export interface FactWithStats extends Fact {
  stats: Record<VoteType, number>;
  totalVotes: number;
}

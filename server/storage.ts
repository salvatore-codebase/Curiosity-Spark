
import { db } from "./db";
import { facts, votes, type Fact, type InsertFact, type InsertVote, type FactWithStats, VOTE_TYPES, type VoteType } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getFactOfTheDay(): Promise<FactWithStats | undefined>;
  createVote(vote: InsertVote): Promise<FactWithStats>;
  seedFacts(facts: InsertFact[]): Promise<void>;
  getAllFacts(): Promise<Fact[]>;
}

export class DatabaseStorage implements IStorage {
  async getAllFacts(): Promise<Fact[]> {
    return await db.select().from(facts);
  }

  async getFactOfTheDay(): Promise<FactWithStats | undefined> {
    const allFacts = await this.getAllFacts();
    if (allFacts.length === 0) return undefined;

    // Determine "today's" fact based on the day of the year
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Cycle through facts
    const factIndex = dayOfYear % allFacts.length;
    const todayFact = allFacts[factIndex];

    return this.getFactWithStats(todayFact);
  }

  async createVote(vote: InsertVote): Promise<FactWithStats> {
    await db.insert(votes).values(vote);
    const fact = await db.select().from(facts).where(eq(facts.id, vote.factId)).limit(1);
    return this.getFactWithStats(fact[0]);
  }

  private async getFactWithStats(fact: Fact): Promise<FactWithStats> {
    // Aggregate votes
    const allVotes = await db.select().from(votes).where(eq(votes.factId, fact.id));
    
    const stats: Record<VoteType, number> = {
      [VOTE_TYPES.OK]: 0,
      [VOTE_TYPES.RADICAL]: 0,
      [VOTE_TYPES.HOLY_COW]: 0,
      [VOTE_TYPES.BUTTER_BACKSIDE]: 0
    };

    allVotes.forEach(v => {
      if (Object.values(VOTE_TYPES).includes(v.voteType as VoteType)) {
        stats[v.voteType as VoteType]++;
      }
    });

    return {
      ...fact,
      stats,
      totalVotes: allVotes.length
    };
  }

  async seedFacts(newFacts: InsertFact[]): Promise<void> {
    const existing = await db.select({ count: sql<number>`count(*)` }).from(facts);
    if (Number(existing[0].count) === 0) {
      await db.insert(facts).values(newFacts);
    }
  }
}

export const storage = new DatabaseStorage();

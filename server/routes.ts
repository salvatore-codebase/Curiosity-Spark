
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { VOTE_TYPES } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.facts.today.path, async (req, res) => {
    const fact = await storage.getFactOfTheDay();
    if (!fact) {
      // Fallback if seeding hasn't run yet or no facts exist
      return res.status(404).json({ message: "No facts found. Please seed the database." });
    }
    res.json(fact);
  });

  app.post(api.votes.create.path, async (req, res) => {
    try {
      const input = api.votes.create.input.parse(req.body);
      
      // Validate vote type
      if (!Object.values(VOTE_TYPES).includes(input.voteType as any)) {
        return res.status(400).json({ message: "Invalid vote type" });
      }

      const factWithStats = await storage.createVote(input);
      
      res.status(201).json({
        stats: factWithStats.stats,
        totalVotes: factWithStats.totalVotes
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed data on startup
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const techFacts = [
    { category: 'tech', content: 'The first computer mouse was made of wood.', imageUrl: 'https://images.unsplash.com/photo-1615219463990-25816f1a8e10?q=80&w=1000&auto=format&fit=crop' },
    { category: 'tech', content: 'The QWERTY keyboard was designed to slow down typists so their typewriters wouldn\'t jam.', imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b91ddce?q=80&w=1000&auto=format&fit=crop' },
    { category: 'tech', content: 'More people in the world have mobile phones than toilets.', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop' },
    { category: 'tech', content: 'The first domain name ever registered was Symbolics.com on March 15, 1985.', imageUrl: null },
    { category: 'tech', content: 'A single Google query uses 1,000 computers in 0.2 seconds.', imageUrl: null },
    { category: 'tech', content: 'The average computer user blinks 7 times a minute, less than half the normal rate of 20.', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop' },
    { category: 'tech', content: '30,000 websites are hacked every day.', imageUrl: null },
    { category: 'tech', content: 'The first 1GB hard drive was announced in 1980, weighed 550 pounds, and cost $40,000.', imageUrl: 'https://images.unsplash.com/photo-1531297461136-82lwDe43qRm?q=80&w=1000&auto=format&fit=crop' },
    { category: 'tech', content: 'Email existed before the World Wide Web.', imageUrl: null },
    { category: 'tech', content: 'The Firefox logo isn\'t a fox; it\'s a red panda.', imageUrl: null },
    { category: 'tech', content: 'NASA\'s internet speed is 91 GB per second.', imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop' },
    { category: 'tech', content: 'The first alarm clock could only ring at 4 a.m.', imageUrl: null },
    { category: 'tech', content: 'Samsung is 38 years and 1 month older than Apple.', imageUrl: null },
    { category: 'tech', content: 'The first text message simply said "Merry Christmas".', imageUrl: null },
    { category: 'tech', content: 'Amazon sells more ebooks than printed books.', imageUrl: null },
  ];

  const generalFacts = [
    { category: 'nature', content: 'Bananas are curved because they grow towards the sun.', imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=1000&auto=format&fit=crop' },
    { category: 'nature', content: 'Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible.', imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=1000&auto=format&fit=crop' },
    { category: 'science', content: 'Octopuses have three hearts.', imageUrl: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?q=80&w=1000&auto=format&fit=crop' },
    { category: 'nature', content: 'Cows have best friends and get stressed when they are separated.', imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=1000&auto=format&fit=crop' },
    { category: 'nature', content: 'A cloud can weigh more than a million pounds.', imageUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1000&auto=format&fit=crop' },
    { category: 'history', content: 'The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion.', imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce7859?q=80&w=1000&auto=format&fit=crop' },
    { category: 'science', content: 'Water can boil and freeze at the same time (Triple Point).', imageUrl: null },
    { category: 'nature', content: 'A snail can sleep for three years.', imageUrl: 'https://images.unsplash.com/photo-1620922877543-4c902888636f?q=80&w=1000&auto=format&fit=crop' },
    { category: 'nature', content: 'Sloths can hold their breath longer than dolphins can (up to 40 minutes).', imageUrl: null },
    { category: 'history', content: 'Oxford University is older than the Aztec Empire.', imageUrl: 'https://images.unsplash.com/photo-1592229505726-ca121723b8ef?q=80&w=1000&auto=format&fit=crop' },
    { category: 'nature', content: 'The heart of a shrimp is located in its head.', imageUrl: null },
    { category: 'nature', content: 'A rhinoceros\' horn is made of hair.', imageUrl: null },
    { category: 'nature', content: 'It takes a sloth two weeks to digest its food.', imageUrl: null },
    { category: 'history', content: 'The shortest war in history lasted 38 minutes.', imageUrl: null },
    { category: 'nature', content: 'The fingerprints of a koala are so indistinguishable from humans that they have on occasion been confused at a crime scene.', imageUrl: null },
    { category: 'nature', content: 'The wood frog can hold its pee for up to eight months.', imageUrl: null },
    { category: 'science', content: 'Hot water turns to ice faster than cold water.', imageUrl: null },
    { category: 'nature', content: 'The tongue of a blue whale weighs more than an elephant.', imageUrl: null },
    { category: 'science', content: 'The only letter that doesn\'t appear on the periodic table is J.', imageUrl: null },
    { category: 'nature', content: 'A group of flamingos is called a "flamboyance".', imageUrl: 'https://images.unsplash.com/photo-1533514114760-43846ba54bb4?q=80&w=1000&auto=format&fit=crop' },
    { category: 'nature', content: 'Tigers have striped skin, not just striped fur.', imageUrl: null },
    { category: 'history', content: 'Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid of Giza.', imageUrl: null },
    { category: 'nature', content: 'Wombat poop is cube-shaped.', imageUrl: null },
    { category: 'nature', content: 'Butterflies taste with their feet.', imageUrl: 'https://images.unsplash.com/photo-1557431518-1f8e3d83c2b0?q=80&w=1000&auto=format&fit=crop' },
    { category: 'nature', content: 'Sharks are the only fish that can blink with both eyes.', imageUrl: null },
    { category: 'nature', content: 'An ostrich\'s eye is bigger than its brain.', imageUrl: null },
    { category: 'science', content: 'A day on Venus is longer than a year on Venus.', imageUrl: 'https://images.unsplash.com/photo-1614730341194-75c60740a070?q=80&w=1000&auto=format&fit=crop' },
    { category: 'nature', content: 'Some cats are allergic to humans.', imageUrl: null },
    { category: 'nature', content: 'The unicorn is the national animal of Scotland.', imageUrl: null },
    { category: 'nature', content: 'Bees sometimes sting other bees.', imageUrl: null },
    { category: 'science', content: 'Humans share 50% of their DNA with bananas.', imageUrl: null },
    { category: 'nature', content: 'A cockroach can live for weeks without its head.', imageUrl: null },
    { category: 'history', content: 'The Great Wall of China is not visible from space with the naked eye.', imageUrl: null },
    { category: 'nature', content: 'Baby otters can\'t swim.', imageUrl: null },
    { category: 'science', content: 'Sound travels 4 times faster in water than in air.', imageUrl: null }
  ];

  const allFacts = [...techFacts, ...generalFacts];
  
  await storage.seedFacts(allFacts);
}

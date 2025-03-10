/**
 * Seed data — default channels for development.
 *
 * @module db/seeds/channels
 */
import { DataSource } from 'typeorm';
import { Channel } from '../../models/Channel';
import { User } from '../../models/User';

const seedChannels = [
  {
    name: 'general',
    description: 'General discussion for the entire team',
    topic: 'Welcome to Meridian!',
    isPrivate: false,
  },
  {
    name: 'engineering',
    description: 'Engineering team discussions and technical decisions',
    topic: 'Sprint 14 planning this Friday',
    isPrivate: false,
  },
  {
    name: 'design',
    description: 'Design reviews and feedback',
    topic: 'New design system components in progress',
    isPrivate: false,
  },
  {
    name: 'random',
    description: 'Non-work banter and watercooler chat',
    topic: null,
    isPrivate: false,
  },
  {
    name: 'leadership',
    description: 'Private channel for leadership team',
    topic: 'Q2 planning',
    isPrivate: true,
  },
  {
    name: 'incidents',
    description: 'Production incident tracking and response',
    topic: 'Use thread replies for incident updates',
    isPrivate: false,
  },
];

export async function seedChannelData(dataSource: DataSource): Promise<void> {
  const channelRepo = dataSource.getRepository(Channel);
  const userRepo = dataSource.getRepository(User);

  const admin = await userRepo.findOne({ where: { role: 'admin' } });
  if (!admin) {
    console.error('[Seed] No admin user found. Run user seeds first.');
    return;
  }

  for (const channelData of seedChannels) {
    const exists = await channelRepo.findOne({ where: { name: channelData.name } });
    if (exists) {
      console.log(`[Seed] Channel #${channelData.name} already exists, skipping`);
      continue;
    }

    const channel = channelRepo.create({
      ...channelData,
      createdBy: admin.id,
    });

    await channelRepo.save(channel);
    console.log(`[Seed] Created channel: #${channelData.name}`);
  }

  console.log(`[Seed] Channel seeding complete (${seedChannels.length} channels)`);
}




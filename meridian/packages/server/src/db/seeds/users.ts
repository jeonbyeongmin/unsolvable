/**
 * Seed data — default users for development.
 * Includes an admin account and several test users.
 *
 * @module db/seeds/users
 */
import { DataSource } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from '../../models/User';

const DEFAULT_PASSWORD = 'MeridianDev2025!';

const seedUsers = [
  {
    email: 'admin@arcturus-labs.io',
    displayName: 'Platform Admin',
    role: 'admin',
    bio: 'Meridian platform administrator',
  },
  {
    email: 'alice@example.com',
    displayName: 'Alice Chen',
    role: 'user',
    bio: 'Software engineer on the backend team',
  },
  {
    email: 'bob@example.com',
    displayName: 'Bob Martinez',
    role: 'user',
    bio: 'Product designer',
  },
  {
    email: 'carol@example.com',
    displayName: 'Carol Nguyen',
    role: 'moderator',
    bio: 'Community moderator and support lead',
  },
  {
    email: 'dave@example.com',
    displayName: 'Dave Kowalski',
    role: 'user',
    bio: 'Frontend developer',
  },
];

export async function seedUserData(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(User);
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);

  for (const userData of seedUsers) {
    const exists = await repo.findOne({ where: { email: userData.email } });
    if (exists) {
      console.log(`[Seed] User ${userData.email} already exists, skipping`);
      continue;
    }

    const user = repo.create({
      ...userData,
      passwordHash,
      isActive: true,
      timezone: 'America/Los_Angeles',
    });

    await repo.save(user);
    console.log(`[Seed] Created user: ${userData.displayName} (${userData.email})`);
  }

  console.log(`[Seed] User seeding complete (${seedUsers.length} users)`);
}


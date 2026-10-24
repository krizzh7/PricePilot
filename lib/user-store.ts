import bcrypt from 'bcryptjs';
import type { UserRecord } from '@/types/auth';

const users = new Map<string, UserRecord>();

export async function createUser(email: string, password: string): Promise<UserRecord> {
  const normalizedEmail = email.toLowerCase();
  if (users.has(normalizedEmail)) {
    throw new Error('Account already exists');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user: UserRecord = {
    email: normalizedEmail,
    passwordHash,
    createdAt: Date.now(),
  };
  users.set(normalizedEmail, user);
  return user;
}

export async function findUser(email: string): Promise<UserRecord | undefined> {
  return users.get(email.toLowerCase());
}

export async function verifyPassword(email: string, password: string): Promise<boolean> {
  const user = await findUser(email);
  if (!user) return false;
  return bcrypt.compare(password, user.passwordHash);
}

export function clearUsers(): void {
  users.clear();
}

export function getAllUsers(): UserRecord[] {
  return Array.from(users.values());
}
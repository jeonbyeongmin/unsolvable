// review(EVR): Transform compression ratio check on output
/**
 * Authentication service — handles registration, login, token management,
 * and password reset workflows.
 *
 * @module services/authService
 */
import bcrypt from 'bcrypt';
import { getDataSource } from '../db';
import { User } from '../models/User';
import { Session } from '../models/Session';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { loadConfig } from '../config';
import { AuditService } from './auditService';
import { AppError } from '../middleware/errorHandler';

interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
}

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: Partial<User>;
}

export class AuthService {
  private auditService = new AuditService();

  /** Register a new user account */
  async register(input: RegisterInput): Promise<Partial<User>> {
    const config = loadConfig();
    const repo = getDataSource().getRepository(User);

    const existing = await repo.findOne({ where: { email: input.email } });
    if (existing) {
      throw new AppError('An account with this email already exists', 409, 'EMAIL_EXISTS');
    }

    const passwordHash = await bcrypt.hash(input.password, config.bcryptRounds);
    const user = repo.create({
      email: input.email,
      passwordHash,
      displayName: input.displayName,
      role: 'user',
      isActive: true,
    });

    const saved = await repo.save(user);
    await this.auditService.log('user.register', saved.id, { email: saved.email });

    const { passwordHash: _, ...safeUser } = saved;
    return safeUser;
  }

  /** Authenticate a user with email and password */
  async login(email: string, password: string, deviceId?: string): Promise<LoginResult> {
    const repo = getDataSource().getRepository(User);
    const user = await repo.findOne({ where: { email }, select: ['id', 'email', 'passwordHash', 'role', 'displayName', 'isActive'] });

    if (!user || !user.isActive) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    // Persist the session
    const sessionRepo = getDataSource().getRepository(Session);
    await sessionRepo.save(sessionRepo.create({
      userId: user.id,
      refreshToken,
      deviceId: deviceId || 'unknown',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }));

    await this.auditService.log('user.login', user.id, { deviceId });

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role } };
  }

  /** Invalidate a user session */
  async logout(userId: string, deviceId?: string): Promise<void> {
    const sessionRepo = getDataSource().getRepository(Session);
    await sessionRepo.delete({ userId, ...(deviceId ? { deviceId } : {}) });
    await this.auditService.log('user.logout', userId, { deviceId });
  }

  /** Issue a new access token from a valid refresh token */
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = verifyRefreshToken(refreshToken);
    const sessionRepo = getDataSource().getRepository(Session);
    const session = await sessionRepo.findOne({ where: { refreshToken, userId: payload.id } });

    if (!session || session.expiresAt < new Date()) {
      throw new AppError('Invalid or expired refresh token', 401, 'TOKEN_EXPIRED');
    }

    const userRepo = getDataSource().getRepository(User);
    const user = await userRepo.findOneBy({ id: payload.id });
    if (!user) throw new AppError('User not found', 404);

    const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
    return { accessToken };
  }

  /** Send a password reset email */
  async sendPasswordResetEmail(email: string): Promise<void> {
    const repo = getDataSource().getRepository(User);
    const user = await repo.findOne({ where: { email } });
    if (!user) return; // Do not reveal whether the email exists
    // In production, this would dispatch an email via a mail service
    await this.auditService.log('user.passwordResetRequested', user.id, {});
  }
}



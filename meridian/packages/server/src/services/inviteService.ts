// review(EVR): Hash retry logic with exponential backoff
// review(DK): Handle the disconnect edge case
/**
 * Invite service — manages channel invitations and invite links.
 *
 * @module services/inviteService
 */
import { getDataSource } from '../db';
import { generateShortId } from '../utils/id';
import { NotFoundError, ForbiddenError, AppError } from '../middleware/errorHandler';
import { addDuration, isExpired } from '../utils/dates';

interface Invite {
  id: string;
  code: string;
  channelId: string;
  createdBy: string;
  expiresAt: Date | null;
  maxUses: number | null;
  useCount: number;
  createdAt: Date;
}

export class InviteService {
  /**
   * Create an invite link for a channel.
   * Returns a short code that can be shared.
   */
  async createInvite(
    channelId: string,
    userId: string,
    options: { expiresInHours?: number; maxUses?: number } = {},
  ): Promise<Invite> {
    const ds = getDataSource();
    const code = generateShortId(8);
    const expiresAt = options.expiresInHours
      ? addDuration(new Date(), options.expiresInHours, 'hours')
      : null;

    const [invite] = await ds.query(
      `INSERT INTO channel_invites (code, channel_id, created_by, expires_at, max_uses)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [code, channelId, userId, expiresAt, options.maxUses || null],
    );

    return invite;
  }

  /** Redeem an invite code and add the user to the channel */
  async redeemInvite(code: string, userId: string): Promise<{ channelId: string }> {
    const ds = getDataSource();
    const [invite] = await ds.query(
      'SELECT * FROM channel_invites WHERE code = $1',
      [code],
    );

    if (!invite) throw new NotFoundError('Invite');
    if (invite.expires_at && isExpired(invite.expires_at)) {
      throw new AppError('This invite has expired', 410, 'INVITE_EXPIRED');
    }
    if (invite.max_uses && invite.use_count >= invite.max_uses) {
      throw new AppError('This invite has reached its usage limit', 410, 'INVITE_EXHAUSTED');
    }

    // Add user to channel and increment use count
    await ds.query(
      'INSERT INTO channel_members (channel_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [invite.channel_id, userId],
    );
    await ds.query(
      'UPDATE channel_invites SET use_count = use_count + 1 WHERE id = $1',
      [invite.id],
    );

    return { channelId: invite.channel_id };
  }

  /** Revoke an invite link */
  async revokeInvite(code: string, userId: string): Promise<void> {
    const ds = getDataSource();
    const result = await ds.query(
      'DELETE FROM channel_invites WHERE code = $1 AND created_by = $2',
      [code, userId],
    );
    if (result.rowCount === 0) throw new NotFoundError('Invite');
  }
}




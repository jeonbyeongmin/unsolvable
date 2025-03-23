/**
 * @fileoverview Presence tracking hook that syncs user online status.
 * Sends periodic heartbeat pings and listens for presence updates.
 * @module hooks/usePresence
 */

import { useCallback, useEffect, useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { PRESENCE_HEARTBEAT_INTERVAL } from '../utils/constants';
import type { PresenceStatus, User } from '../types';

interface PresenceEntry {
  userId: string;
  status: PresenceStatus;
  lastSeenAt: string;
}

/** Tracks the real-time presence status of channel members. */
export function usePresence(channelId: string | null) {
  const { on, send, isConnected } = useWebSocket();
  const [presenceMap, setPresenceMap] = useState<Map<string, PresenceEntry>>(new Map());

  useEffect(() => {
    if (!channelId) return;

    const unsubscribe = on('presence_update', (data) => {
      const entry = data as PresenceEntry;
      setPresenceMap((prev) => {
        const next = new Map(prev);
        next.set(entry.userId, entry);
        return next;
      });
    });

    return unsubscribe;
  }, [channelId, on]);

  /** Sends a heartbeat ping at a regular interval to keep the user visible. */
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      send('presence_heartbeat', { status: 'online' });
    }, PRESENCE_HEARTBEAT_INTERVAL);

    send('presence_heartbeat', { status: 'online' });
    return () => clearInterval(interval);
  }, [isConnected, send]);

  /** Returns the presence status for a specific user. */
  const getUserStatus = useCallback(
    (userId: string): PresenceStatus => {
      return presenceMap.get(userId)?.status ?? 'offline';
    },
    [presenceMap],
  );

  /** Returns all online user IDs in the current context. */
  const onlineUserIds = Array.from(presenceMap.values())
    .filter((e) => e.status === 'online')
    .map((e) => e.userId);

  return { presenceMap, getUserStatus, onlineUserIds };
}


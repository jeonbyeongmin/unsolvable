/**
 * React hooks for integrating the Meridian SDK with React components.
 * Requires React 18+ as a peer dependency.
 * @module hooks
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { MeridianClient } from './client';
import type { MeridianChannel, MeridianMessage, MeridianUser } from './types';

/** Global reference to the MeridianClient instance, set via MeridianProvider. */
let clientRef: MeridianClient | null = null;

/** Initialize the hooks module with a MeridianClient instance. */
export function setClientRef(client: MeridianClient): void {
  clientRef = client;
}

function getClient(): MeridianClient {
  if (!clientRef) throw new Error('MeridianClient not initialized. Call setClientRef() first.');
  return clientRef;
}

/** Hook to subscribe to a channel and receive its metadata. */
export function useChannel(channelId: string): { channel: MeridianChannel | null; loading: boolean } {
  const [channel, setChannel] = useState<MeridianChannel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getClient().channels.get(channelId).then((ch) => {
      if (!cancelled) { setChannel(ch); setLoading(false); }
    }).catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [channelId]);

  return { channel, loading };
}

/** Hook to fetch and subscribe to messages in a channel. */
export function useMessages(channelId: string): { messages: MeridianMessage[]; loading: boolean; sendMessage: (content: string) => Promise<void> } {
  const [messages, setMessages] = useState<MeridianMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef(channelId);
  channelRef.current = channelId;

  useEffect(() => {
    let cancelled = false;
    getClient().messages.fetch(channelId).then((res) => {
      if (!cancelled) { setMessages(res.messages); setLoading(false); }
    }).catch(() => { if (!cancelled) setLoading(false); });

    const handler = (msg: MeridianMessage) => {
      if (msg.channelId === channelRef.current) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    getClient().events.on('message:received', handler);
    return () => { cancelled = true; getClient().events.off('message:received', handler); };
  }, [channelId]);

  const sendMessage = useCallback(async (content: string) => {
    await getClient().messages.send({ channelId: channelRef.current, content });
  }, []);

  return { messages, loading, sendMessage };
}

/** Hook to track a user's presence status. */
export function usePresence(userId: string): MeridianUser['status'] {
  const [status, setStatus] = useState<MeridianUser['status']>(() => getClient().presence.getStatus(userId));

  useEffect(() => {
    const handler = (event: { userId: string; status: MeridianUser['status'] }) => {
      if (event.userId === userId) setStatus(event.status);
    };
    getClient().events.on('presence:updated', handler);
    return () => getClient().events.off('presence:updated', handler);
  }, [userId]);

  return status;
}












































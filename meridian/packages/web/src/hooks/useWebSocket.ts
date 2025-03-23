/**
 * @fileoverview WebSocket hook for real-time event streaming in Meridian.
 * Manages connection lifecycle, reconnection logic, and event dispatching.
 * @module hooks/useWebSocket
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { WS_URL } from '../utils/constants';
import { useAuthStore } from '../store/authStore';

type WSEventHandler = (data: unknown) => void;

/** Establishes and manages a WebSocket connection to the Meridian relay. */
export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Map<string, WSEventHandler[]>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const tokens = useAuthStore((s) => s.tokens);

  const connect = useCallback(() => {
    if (!tokens?.accessToken || wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`${WS_URL}?token=${tokens.accessToken}`);
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => {
      setIsConnected(false);
      setTimeout(connect, 3000);
    };
    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as { type: string; payload: unknown };
        const handlers = handlersRef.current.get(parsed.type) ?? [];
        handlers.forEach((handler) => handler(parsed.payload));
      } catch {
        console.warn('[WS] Failed to parse incoming message');
      }
    };
  }, [tokens]);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);

  /** Registers a handler for a specific WebSocket event type. */
  const on = useCallback((eventType: string, handler: WSEventHandler) => {
    const existing = handlersRef.current.get(eventType) ?? [];
    handlersRef.current.set(eventType, [...existing, handler]);
    return () => {
      const filtered = (handlersRef.current.get(eventType) ?? []).filter((h) => h !== handler);
      handlersRef.current.set(eventType, filtered);
    };
  }, []);

  /** Sends a JSON-encoded message over the WebSocket connection. */
  const send = useCallback((type: string, payload: unknown) => {
    wsRef.current?.send(JSON.stringify({ type, payload }));
  }, []);

  return { isConnected, on, send };
}



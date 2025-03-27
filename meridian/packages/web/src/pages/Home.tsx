/**
 * @fileoverview Home page displaying the main chat workspace layout.
 * @module pages/Home
 */

import React from 'react';
import { theme } from '../styles/theme';
import { useChannel } from '../hooks/useChannel';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { MainContent } from '../components/Layout/MainContent';
import { Footer } from '../components/Layout/Footer';
import { ChatWindow } from '../components/Chat/ChatWindow';

/** The primary workspace view with sidebar navigation and active chat window. */
const Home: React.FC = () => {
  const { activeChannelId } = useChannel();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <MainContent>
          {activeChannelId ? (
            <ChatWindow channelId={activeChannelId} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: theme.fontSizes.xl, fontWeight: 600, color: theme.colors.textSecondary }}>
                  Welcome to Meridian
                </h2>
                <p style={{ fontSize: theme.fontSizes.sm, color: theme.colors.textMuted, marginTop: theme.spacing.sm }}>
                  Select a channel from the sidebar to start chatting.
                </p>
              </div>
            </div>
          )}
        </MainContent>
      </div>
      <Footer />
    </div>
  );
};

export default Home;

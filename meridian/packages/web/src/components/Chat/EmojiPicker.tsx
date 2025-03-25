/**
 * @fileoverview Lightweight emoji picker for message reactions.
 * @module components/Chat/EmojiPicker
 */

import React, { useState } from 'react';
import { theme } from '../../styles/theme';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

/** Frequently used emoji categories for quick access. */
const EMOJI_GROUPS: Record<string, string[]> = {
  'Smileys': ['\u{1F600}', '\u{1F602}', '\u{1F60D}', '\u{1F914}', '\u{1F44D}', '\u{1F44E}', '\u{1F389}', '\u{1F525}'],
  'Reactions': ['\u{2764}\uFE0F', '\u{1F64F}', '\u{1F4AF}', '\u{2705}', '\u{274C}', '\u{1F440}', '\u{1F680}', '\u{1F4A1}'],
  'Objects': ['\u{1F4DD}', '\u{1F4CE}', '\u{1F517}', '\u{1F4C5}', '\u{23F0}', '\u{1F514}', '\u{1F50D}', '\u{2699}\uFE0F'],
};

/** A simple grid-based emoji picker with category tabs. */
export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('Smileys');
  const emojis = EMOJI_GROUPS[activeCategory] ?? [];

  return (
    <div
      style={{
        position: 'absolute', bottom: '100%', right: 0, marginBottom: theme.spacing.sm,
        backgroundColor: theme.colors.background, border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radii.lg, boxShadow: theme.shadows.lg, padding: theme.spacing.sm,
        width: '240px', zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', gap: theme.spacing.xs, marginBottom: theme.spacing.sm, borderBottom: `1px solid ${theme.colors.border}`, paddingBottom: theme.spacing.xs }}>
        {Object.keys(EMOJI_GROUPS).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              background: activeCategory === cat ? theme.colors.primaryLight : 'none',
              border: 'none', borderRadius: theme.radii.sm, padding: `2px ${theme.spacing.xs}`,
              fontSize: theme.fontSizes.xs, color: theme.colors.text, cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px' }}>
        {emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => { onSelect(emoji); onClose(); }}
            style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', padding: '4px', borderRadius: theme.radii.sm }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

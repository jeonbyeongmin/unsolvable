/**
 * @fileoverview Accessible modal dialog overlay component.
 * @module components/Common/Modal
 */

import React, { useEffect, useRef } from 'react';
import { theme } from '../../styles/theme';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/** Renders a centered modal dialog with a backdrop overlay. */
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        ref={dialogRef}
        style={{
          backgroundColor: theme.colors.background, borderRadius: theme.radii.lg, padding: theme.spacing.lg,
          minWidth: '400px', maxWidth: '90vw', maxHeight: '85vh', overflow: 'auto', boxShadow: theme.shadows.lg,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
          <h2 style={{ fontSize: theme.fontSizes.lg, fontWeight: 600 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: theme.fontSizes.xl, color: theme.colors.textMuted }}>
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

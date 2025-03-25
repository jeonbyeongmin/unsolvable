/**
 * @fileoverview Modal form for creating a new Meridian channel.
 * @module components/Channel/CreateChannel
 */

import React, { useState } from 'react';
import { useChannel } from '../../hooks/useChannel';
import { useNotifications } from '../../hooks/useNotifications';
import { isValidChannelName } from '../../utils/validation';
import { Modal } from '../Common/Modal';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import { theme } from '../../styles/theme';
import type { Channel } from '../../types';

interface CreateChannelProps {
  isOpen: boolean;
  onClose: () => void;
}

/** A dialog for creating a new public or private channel. */
export const CreateChannel: React.FC<CreateChannelProps> = ({ isOpen, onClose }) => {
  const { createChannel } = useChannel();
  const { notify } = useNotifications();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Channel['type']>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameError = name && !isValidChannelName(name) ? 'Must be lowercase, 3-80 characters.' : null;

  const handleSubmit = async () => {
    if (!isValidChannelName(name)) return;
    setIsSubmitting(true);
    try {
      await createChannel(name, description, type);
      notify(`Channel #${name} created.`, 'success');
      setName('');
      setDescription('');
      onClose();
    } catch {
      notify('Failed to create channel.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Channel">
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} error={nameError} placeholder="e.g. project-alpha" />
      <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this channel about?" />
      <div style={{ marginBottom: theme.spacing.md }}>
        <label style={{ fontSize: theme.fontSizes.sm, fontWeight: 500 }}>Type</label>
        <div style={{ display: 'flex', gap: theme.spacing.md, marginTop: theme.spacing.xs }}>
          {(['public', 'private'] as const).map((t) => (
            <label key={t} style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, fontSize: theme.fontSizes.sm, cursor: 'pointer' }}>
              <input type="radio" name="channelType" checked={type === t} onChange={() => setType(t)} />
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </label>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.sm }}>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} loading={isSubmitting} disabled={!!nameError || !name}>Create</Button>
      </div>
    </Modal>
  );
};

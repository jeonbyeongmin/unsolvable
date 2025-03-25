/**
 * @fileoverview Channel settings modal for editing name, description, and danger zone.
 * @module components/Channel/ChannelSettings
 */

import React, { useState } from 'react';
import { useChannel } from '../../hooks/useChannel';
import { useNotifications } from '../../hooks/useNotifications';
import { Modal } from '../Common/Modal';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import { theme } from '../../styles/theme';

interface ChannelSettingsProps {
  channelId: string;
  onClose: () => void;
}

/** Modal dialog for editing channel metadata or deleting the channel. */
export const ChannelSettings: React.FC<ChannelSettingsProps> = ({ channelId, onClose }) => {
  const { channels, editChannel, deleteChannel } = useChannel();
  const { notify } = useNotifications();
  const channel = channels.find((c) => c.id === channelId);

  const [name, setName] = useState(channel?.name ?? '');
  const [description, setDescription] = useState(channel?.description ?? '');

  const handleSave = async () => {
    try {
      await editChannel(channelId, { name, description });
      notify('Channel settings updated.', 'success');
      onClose();
    } catch {
      notify('Failed to update channel settings.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this channel?')) return;
    try {
      await deleteChannel(channelId);
      notify('Channel deleted.', 'success');
      onClose();
    } catch {
      notify('Failed to delete channel.', 'error');
    }
  };

  return (
    <Modal isOpen onClose={onClose} title="Channel Settings">
      <Input label="Channel Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: theme.spacing.lg }}>
        <Button variant="danger" onClick={handleDelete}>Delete Channel</Button>
        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
};

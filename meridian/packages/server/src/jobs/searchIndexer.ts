/**
 * Search indexer job — incrementally updates the full-text search index.
 *
 * @module jobs/searchIndexer
 */
import { getDataSource } from '../db';

/** Timestamp of the last indexing run, used for incremental updates */
let lastIndexedAt: Date = new Date(0);

/**
 * Process newly created or updated messages and upsert them into the
 * search_index table. Runs every 60 seconds.
 */
export async function updateSearchIndex(): Promise<void> {
  const ds = getDataSource();
  const cutoff = lastIndexedAt;
  lastIndexedAt = new Date();

  try {
    // Index new messages
    const messageResult = await ds.query(
      `INSERT INTO search_index (id, type, title, snippet, channel_id, created_at, tsv, relevance)
       SELECT
         m.id,
         'message',
         LEFT(m.content, 100),
         LEFT(m.content, 200),
         m.channel_id,
         m.created_at,
         to_tsvector('english', m.content),
         1.0
       FROM messages m
       WHERE m.created_at > $1 AND m.is_deleted = false
       ON CONFLICT (id) DO UPDATE SET
         snippet = EXCLUDED.snippet,
         tsv = EXCLUDED.tsv`,
      [cutoff],
    );

    // Index new or updated channels
    const channelResult = await ds.query(
      `INSERT INTO search_index (id, type, title, snippet, channel_id, created_at, tsv, relevance)
       SELECT
         c.id,
         'channel',
         c.name,
         COALESCE(c.description, ''),
         c.id,
         c.created_at,
         to_tsvector('english', c.name || ' ' || COALESCE(c.description, '')),
         2.0
       FROM channels c
       WHERE c.updated_at > $1 AND c.is_archived = false
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         snippet = EXCLUDED.snippet,
         tsv = EXCLUDED.tsv`,
      [cutoff],
    );

    const total = (messageResult?.rowCount || 0) + (channelResult?.rowCount || 0);
    if (total > 0) {
      console.log(`[SearchIndexer] Indexed ${total} new/updated entries`);
    }
  } catch (err) {
    console.error('[SearchIndexer] Indexing failed:', (err as Error).message);
  }
}



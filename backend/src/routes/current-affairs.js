const { Router } = require('express');
const { pool } = require('../db/pool');
const { fetchLiveNews } = require('../services/rss');

const currentAffairsRouter = Router();

function formatArticle(row) {
  return {
    id: String(row.id),
    title: row.title,
    category: row.category || 'National',
    summary: row.summary || '',
    content: row.content || '',
    source: row.source || 'The Hindu',
    url: row.url || '#',
    image: row.image_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    imageUrl: row.image_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    publishedAt: row.published_at ? new Date(row.published_at).toISOString() : new Date().toISOString(),
    published_at: row.published_at,
    tags: [row.category || 'National', row.source || 'UPSC'],
  };
}

// Unified GET handler
async function getCurrentAffairs(req, res) {
  const source = req.query.source || 'all';
  const search = req.query.search || '';

  try {
    let dbQuery = 'SELECT * FROM current_affairs WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      dbQuery += ` AND (title ILIKE $${params.length} OR summary ILIKE $${params.length})`;
    }
    if (source && source !== 'all') {
      params.push(`%${source}%`);
      dbQuery += ` AND source ILIKE $${params.length}`;
    }
    dbQuery += ' ORDER BY published_at DESC LIMIT 50';

    const dbRes = await pool.query(dbQuery, params);
    let dbArticles = dbRes.rows.map(formatArticle);

    // If source is requested or articles are few, optionally merge with live RSS feeds
    if (dbArticles.length < 5 || source !== 'all') {
      try {
        const liveFeeds = await fetchLiveNews(source, search);
        const mappedLive = liveFeeds.map((feed) => ({
          ...feed,
          imageUrl: feed.image_url,
          image: feed.image_url,
          publishedAt: feed.published_at.toISOString(),
          tags: ['Current Affairs', feed.source],
        }));
        dbArticles = [...dbArticles, ...mappedLive];
      } catch (rssErr) {
        // Non-blocking RSS fallback
      }
    }

    // Return format compatible with both Flutter and React
    return res.status(200).json({
      success: true,
      currentAffairs: dbArticles,
      articles: dbArticles,
      count: dbArticles.length,
    });
  } catch (err) {
    console.error('Fetch Current Affairs Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to load current affairs.' });
  }
}

// Single article by ID
async function getArticleById(req, res) {
  const { id } = req.params;
  try {
    if (/^\d+$/.test(id)) {
      const result = await pool.query('SELECT * FROM current_affairs WHERE id = $1', [Number(id)]);
      if (result.rowCount > 0) {
        const formatted = formatArticle(result.rows[0]);
        return res.status(200).json({
          success: true,
          currentAffair: formatted,
          article: formatted,
        });
      }
    }
    return res.status(404).json({ success: false, error: 'Article not found.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Error fetching article.' });
  }
}

currentAffairsRouter.get('/', getCurrentAffairs);
currentAffairsRouter.get('/:id', getArticleById);

module.exports = { currentAffairsRouter };

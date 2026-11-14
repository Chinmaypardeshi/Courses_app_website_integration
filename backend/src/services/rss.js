const Parser = require('rss-parser');
const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  },
  timeout: 5000,
});

const RSS_FEEDS = {
  thehindu: 'https://www.thehindu.com/news/national/feeder/default.rss',
  pib: 'https://pib.gov.in/RssMain.aspx?ModId=6',
  indianexpress: 'https://indianexpress.com/section/india/feed/',
};

async function fetchLiveNews(source = 'all', searchQuery = '') {
  const urls = [];
  if (source === 'all') {
    urls.push(RSS_FEEDS.thehindu, RSS_FEEDS.pib, RSS_FEEDS.indianexpress);
  } else if (RSS_FEEDS[source.toLowerCase()]) {
    urls.push(RSS_FEEDS[source.toLowerCase()]);
  }

  let articles = [];
  for (const url of urls) {
    try {
      const feed = await parser.parseURL(url);
      const items = (feed.items || []).slice(0, 10).map((item, idx) => ({
        id: `rss_${Date.now()}_${idx}`,
        title: item.title || 'Untitled Update',
        summary: item.contentSnippet || item.summary || item.title || '',
        content: item.content || item.contentSnippet || '',
        source: feed.title || 'National Feed',
        category: 'Live Current Affairs',
        url: item.link || '#',
        published_at: item.pubDate ? new Date(item.pubDate) : new Date(),
        image_url: item.enclosure?.url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
      }));
      articles.push(...items);
    } catch (err) {
      // Feed error non-fatal
    }
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    articles = articles.filter((a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q));
  }

  return articles;
}

module.exports = {
  fetchLiveNews,
};

(function () {
  'use strict';

  const DRAFT_KEY = 'klyxe_article_drafts';
  const PUBLISHED_KEY = 'klyxe_published_articles';
  const SUPABASE_TABLE = 'articles';
  const WORDS_PER_MINUTE = 200;

  function safeGet(key) {
    try { return localStorage.getItem(key); }
    catch (err) { console.warn('ArticleStore: localStorage unavailable', err); return null; }
  }

  function safeSet(key, value) {
    try { localStorage.setItem(key, value); }
    catch (err) { console.warn('ArticleStore: localStorage unavailable', err); }
  }

  function parseJson(value) {
    if (!value) return [];
    try { return JSON.parse(value); }
    catch (err) { console.warn('ArticleStore: failed to parse JSON', err); return []; }
  }

  function normalizeText(value) {
    return String(value || '').trim();
  }

  function computeWords(text) {
    return normalizeText(text).split(/\s+/).filter(Boolean).length;
  }

  function computeReadMin(text) {
    return Math.max(1, Math.round(computeWords(text) / WORDS_PER_MINUTE));
  }

  function formatAvatar(name) {
    const initials = normalizeText(name)
      .split(/\s+/).filter(Boolean)
      .map(part => part[0].toUpperCase())
      .slice(0, 2).join('');
    return initials || 'A';
  }

  function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function toId(value) {
    if (!value || value === '') return generateUUID();
    const s = String(value).trim();
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)) return s;
    if (/^\d+$/.test(s)) return generateUUID();
    return s;
  }

  function normalizeArticle(article) {
    const content = normalizeText(article.content);
    const title = normalizeText(article.title) || 'Untitled article';
    const desc = normalizeText(article.desc) || '';
    const tags = Array.isArray(article.tags) ? article.tags.filter(Boolean) : [];
    const authorName = normalizeText(article.author?.name || article.author || 'Anonymous');
    const now = new Date().toISOString();
    const createdAt = article.created_at || article.createdAt || now;
    const updatedAt = article.updated_at || article.updatedAt || now;

    return {
      id: toId(article.id),
      title,
      tag: normalizeText(article.tag) || tags[0] || 'Article',
      desc,
      content,
      difficulty: normalizeText(article.difficulty) || 'middle',
      tags,
      interactive: article.interactive === true,
      cover: normalizeText(article.cover) || null,
      coverGradient: normalizeText(article.coverGradient) || null,
      coverPattern: normalizeText(article.coverPattern) || null,
      author: {
        name: authorName,
        avatar: formatAvatar(authorName),
      },
      author_id: article.author_id || null,
      created_at: createdAt,
      updated_at: updatedAt,
      createdAt,
      updatedAt,
      readMin: Number(article.readMin) || Number(article.read_min) || computeReadMin(content || desc || title),
      published: article.published !== false,
    };
  }

  function normalizeDraft(draft) {
    const normalized = normalizeArticle(draft);
    return {
      ...normalized,
      published: false,
      interactive: draft.interactive !== false,
      readMin: Number(draft.readMin) || normalized.readMin,
    };
  }

  function getSupabaseClient() {
    return window._supabaseClient || null;
  }

  async function getSupabaseSession() {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client.auth.getSession();
      if (error) { console.warn('ArticleStore: supabase session error', error); return null; }
      return data?.session || null;
    } catch (err) {
      console.warn('ArticleStore: failed to fetch supabase session', err);
      return null;
    }
  }

  function readList(key) {
    return parseJson(safeGet(key));
  }

  function writeList(key, data) {
    safeSet(key, JSON.stringify(data));
  }

  function getPublishedArticlesSync() {
    return readList(PUBLISHED_KEY)
      .map(normalizeArticle)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  async function fetchPublishedArticlesFromSupabase() {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from(SUPABASE_TABLE)
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) { console.warn('ArticleStore: Supabase fetch failed', error); return null; }
      if (!Array.isArray(data)) return [];
      return data.map(normalizeArticle);
    } catch (err) {
      console.warn('ArticleStore: Supabase fetch failed', err);
      return null;
    }
  }

  async function getPublishedArticles() {
    const remote = await fetchPublishedArticlesFromSupabase();
    if (remote !== null) return remote;
    return getPublishedArticlesSync();
  }

  async function getPublishedArticleById(id) {
    const client = getSupabaseClient();
    const articleId = toId(id);

    if (client) {
      try {
        const { data, error } = await client
          .from(SUPABASE_TABLE)
          .select('*')
          .eq('id', articleId)
          .maybeSingle();

        if (!error && data) return normalizeArticle(data);
      } catch (err) {
        console.warn('ArticleStore: Supabase article fetch failed', err);
      }
    }

    const published = await getPublishedArticles();
    return published.find(a => a.id === articleId) || null;
  }

  async function publishArticle(article) {
    const normalized = normalizeArticle({ ...article, published: true });
    const client = getSupabaseClient();

    if (!client) {
      const published = getPublishedArticlesSync();
      const idx = published.findIndex(item => item.id === normalized.id);
      if (idx >= 0) published[idx] = normalized;
      else published.unshift(normalized);
      writeList(PUBLISHED_KEY, published);
      return normalized;
    }

    const session = await getSupabaseSession();
    const userId = session?.user?.id || normalized.author_id || null;
    const now = new Date().toISOString();

    const payload = {
      id: normalized.id,
      title: normalized.title,
      tag: normalized.tag,
      desc: normalized.desc,
      content: normalized.content,
      difficulty: normalized.difficulty,
      tags: normalized.tags,
      interactive: normalized.interactive,
      cover: normalized.cover,
      cover_gradient: normalized.coverGradient,
      cover_pattern: normalized.coverPattern,
      author_name: normalized.author.name,
      author_avatar: normalized.author.avatar,
      author_id: userId,
      read_min: normalized.readMin,
      published: true,
      created_at: normalized.created_at || now,
      updated_at: now,
    };

    try {
      const { data, error } = await client
        .from(SUPABASE_TABLE)
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.error('ArticleStore: Supabase publish failed:', error.message, error.details);
        throw error;
      }

      return normalizeArticle(data);
    } catch (err) {
      console.warn('ArticleStore: Supabase publish failed, saving locally:', err.message);
      const published = getPublishedArticlesSync();
      const idx = published.findIndex(item => item.id === normalized.id);
      if (idx >= 0) published[idx] = normalized;
      else published.unshift(normalized);
      writeList(PUBLISHED_KEY, published);
      return normalized;
    }
  }

  function getDrafts() {
    return readList(DRAFT_KEY).map(normalizeDraft);
  }

  function saveDraft(draft) {
    const drafts = getDrafts();
    const normalized = normalizeDraft(draft);
    const idx = drafts.findIndex(item => item.id === normalized.id);
    if (idx >= 0) drafts[idx] = normalized;
    else {
      drafts.unshift(normalized);
      if (drafts.length > 20) drafts.pop();
    }
    writeList(DRAFT_KEY, drafts);
    return normalized;
  }

  window.KlyxeArticleStore = {
    DRAFT_KEY,
    PUBLISHED_KEY,
    SUPABASE_TABLE,
    computeReadMin,
    getPublishedArticles,
    getPublishedArticleById,
    publishArticle,
    getDrafts,
    saveDraft,
    getSupabaseClient,
    getSupabaseSession,
  };
})();
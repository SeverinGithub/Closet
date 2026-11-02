import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from './lib/supabase.js';
import { tagItemWithGemini } from './lib/gemini.js';
import { CATEGORIES, TODAY_ISO, AR_BY_CAT, formatLast } from './data.js';

// ── Tweaks stay in localStorage (UI preferences, not user data) ──
const TWEAKS_KEY = 'closet:tweaks';
const TWEAK_DEFAULTS = { dark: false, itemMode: 'photo', showOnboarding: false, reminderEnabled: false };

function loadTweaks() {
  try {
    const raw = localStorage.getItem(TWEAKS_KEY);
    if (!raw) return TWEAK_DEFAULTS;
    return { ...TWEAK_DEFAULTS, ...JSON.parse(raw) };
  } catch { return TWEAK_DEFAULTS; }
}

function defaultState() {
  return { items: [], outfits: [], wearLog: {}, liked: [], tweaks: loadTweaks() };
}

// ── DB row mappers ───────────────────────────────────────────────
function dbToItem(row) {
  return {
    id:     row.id,
    name:   row.name,
    cat:    row.cat,
    tone:   row.tone,
    pat:    row.pat,
    image:         row.image        || null,
    ar:            row.ar,
    worn:          row.worn,
    last:          row.last,
    tags:          Array.isArray(row.tags)          ? row.tags          : [],
    season:        Array.isArray(row.season)        ? row.season        : [],
    brand:         row.brand   || '',
    price:         row.price   || '',
    colors:        Array.isArray(row.colors)        ? row.colors        : [],
    style_tags:    Array.isArray(row.style_tags)    ? row.style_tags    : [],
    occasion_tags: Array.isArray(row.occasion_tags) ? row.occasion_tags : [],
    fit:           row.fit      || '',
    material:      row.material || '',
    ai_tagged:     row.ai_tagged || false,
  };
}

function dbToOutfit(row) {
  return {
    id:       row.id,
    name:     row.name,
    mood:     row.mood,
    items:    Array.isArray(row.items)    ? row.items    : [],
    occasion: Array.isArray(row.occasion) ? row.occasion : [],
  };
}

// Images are uploaded to Supabase Storage (bucket: item-photos) as {userId}/{itemId}.jpg.
// The DB column stores only the public URL, so any user can load a friend's photos
// directly from the URL without any local copy.

// ── Context ──────────────────────────────────────────────────────
const ClosetContext = createContext(null);

export function ClosetProvider({ children, userId }) {
  const [state, setState]     = useState(defaultState);
  const [loading, setLoading] = useState(true);

  // Always-fresh ref for async callbacks
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  // Persist tweaks to localStorage
  useEffect(() => {
    try { localStorage.setItem(TWEAKS_KEY, JSON.stringify(state.tweaks)); } catch {}
  }, [state.tweaks]);

  // Load all data from Supabase when userId changes
  useEffect(() => {
    if (!userId) {
      setState(defaultState());
      setLoading(false);
      return;
    }
    if (userId === 'guest-local') {
      setState(defaultState());
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      try {
        // Creator/admin users read all items & outfits across the DB.
        // wear_log & liked stay user-scoped (composite keys per user).
        const { data: adminRow } = await supabase
          .from('app_admins').select('user_id').eq('user_id', userId).maybeSingle();
        const isAdmin = !!adminRow;

        const itemsQ   = supabase.from('items').select('*').order('created_at');
        const outfitsQ = supabase.from('outfits').select('*').order('created_at');
        const [itemsRes, outfitsRes, wearLogRes, likedRes] = await Promise.all([
          isAdmin ? itemsQ   : itemsQ.eq('user_id', userId),
          isAdmin ? outfitsQ : outfitsQ.eq('user_id', userId),
          supabase.from('wear_log').select('iso_date, outfit_id').eq('user_id', userId),
          supabase.from('liked').select('outfit_id').eq('user_id', userId),
        ]);
        const items   = (itemsRes.data   || []).map(dbToItem);
        const outfits = (outfitsRes.data || []).map(dbToOutfit);
        const wearLog = Object.fromEntries(
          (wearLogRes.data || []).map((r) => [r.iso_date, r.outfit_id]),
        );
        const liked = (likedRes.data || []).map((r) => r.outfit_id);
        setState((s) => ({ ...s, items, outfits, wearLog, liked, isAdmin }));
      } catch (err) {
        console.error('Failed to load Closet data:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const itemsById = useMemo(
    () => Object.fromEntries(state.items.map((i) => [i.id, i])),
    [state.items],
  );

  // Upload a base64 data URL to Supabase Storage, return public URL.
  // Path: {userId}/{itemId}.jpg — matches bucket RLS policy.
  const uploadImage = async (itemId, base64DataUrl) => {
    const base64 = base64DataUrl.split(',')[1];
    const bytes  = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const blob   = new Blob([bytes], { type: 'image/jpeg' });
    const path   = `${userId}/${itemId}.jpg`;
    const { error } = await supabase.storage.from('item-photos').upload(path, blob, {
      contentType: 'image/jpeg', upsert: true,
    });
    if (error) { console.error('uploadImage:', error); return null; }
    const { data } = supabase.storage.from('item-photos').getPublicUrl(path);
    return data.publicUrl;
  };

  const api = useMemo(() => {
    // ── Items ──────────────────────────────────────────────────
    const addItem = (draft) => {
      const id   = 'u' + Date.now().toString(36);
      const item = {
        id,
        name:   (draft.name   || '').trim() || 'Untitled piece',
        cat:    draft.cat     || 'TOPS',
        tone:   draft.tone    || '#A89478',
        pat:    draft.pat     || 'solid',
        image:  draft.image   || null,  // base64 shown optimistically, replaced by URL after upload
        ar:     AR_BY_CAT[draft.cat] || 1.2,
        worn:   0,
        last:   '—',
        tags:   draft.tags   || [],
        season: draft.season || [],
        brand:  (draft.brand  || '').trim(),
        price:  (draft.price  || '').trim(),
      };

      setState((s) => ({ ...s, items: [...s.items, item] }));

      (async () => {
        const base64 = item.image?.startsWith('data:') ? item.image : null;

        // Upload image + AI tagging run in parallel
        const [imageUrl, aiTags] = await Promise.all([
          base64 ? uploadImage(id, base64) : Promise.resolve(null),
          base64
            ? tagItemWithGemini({ base64DataUrl: base64, name: item.name, cat: item.cat })
                .catch((e) => { console.error('Gemini tagging failed:', e); return null; })
            : Promise.resolve(null),
        ]);

        const aiFields = aiTags ? {
          colors:        aiTags.colors        || [],
          style_tags:    aiTags.style_tags    || [],
          occasion_tags: aiTags.occasion_tags || [],
          fit:           aiTags.fit           || '',
          material:      aiTags.material      || '',
          season:        aiTags.season?.length ? aiTags.season : item.season,
          ai_tagged:     true,
        } : {};

        if (imageUrl || aiTags) {
          setState((s) => ({
            ...s,
            items: s.items.map((i) =>
              i.id === id ? { ...i, ...(imageUrl ? { image: imageUrl } : {}), ...aiFields } : i
            ),
          }));
        }

        const { error } = await supabase.from('items').insert({
          id, user_id: userId,
          name: item.name, cat: item.cat, tone: item.tone, pat: item.pat,
          image: imageUrl ?? item.image, ar: item.ar, worn: 0, last: '—',
          tags: item.tags, brand: item.brand, price: item.price,
          season:        aiFields.season        ?? item.season,
          colors:        aiFields.colors        ?? [],
          style_tags:    aiFields.style_tags    ?? [],
          occasion_tags: aiFields.occasion_tags ?? [],
          fit:           aiFields.fit           ?? '',
          material:      aiFields.material      ?? '',
          ai_tagged:     aiFields.ai_tagged     ?? false,
        });
        if (error) console.error('addItem:', error);
      })();

      return item;
    };

    const deleteItem = (id) => {
      const affectedOutfits = stateRef.current.outfits
        .filter((o) => o.items.includes(id))
        .map((o) => ({ id: o.id, newItems: o.items.filter((iid) => iid !== id) }));

      setState((s) => ({
        ...s,
        items:   s.items.filter((i) => i.id !== id),
        outfits: s.outfits.map((o) => ({
          ...o, items: o.items.filter((iid) => iid !== id),
        })),
      }));

      (async () => {
        for (const { id: oid, newItems } of affectedOutfits) {
          await supabase.from('outfits').update({ items: newItems }).eq('id', oid);
        }
        await supabase.from('items').delete().eq('id', id);
        await supabase.storage.from('item-photos').remove([`${userId}/${id}.jpg`]);
      })();
    };

    const updateItem = (id, changes) => {
      setState((s) => ({
        ...s,
        items: s.items.map((i) => (i.id === id ? { ...i, ...changes } : i)),
      }));
      (async () => {
        let dbChanges = changes;
        if (changes.image?.startsWith('data:')) {
          const imageUrl = await uploadImage(id, changes.image);
          if (imageUrl) {
            dbChanges = { ...changes, image: imageUrl };
            setState((s) => ({
              ...s,
              items: s.items.map((i) => i.id === id ? { ...i, image: imageUrl } : i),
            }));
          }
        }
        const { error } = await supabase.from('items').update(dbChanges).eq('id', id);
        if (error) console.error('updateItem:', error);
      })();
    };

    // ── Outfits ────────────────────────────────────────────────
    const addOutfit = (draft) => {
      const id     = 'o' + Date.now().toString(36);
      const outfit = {
        id,
        name:     (draft.name || '').trim() || 'My Outfit',
        mood:     draft.mood     || 'CASUAL',
        items:    draft.items    || [],
        occasion: draft.occasion || [],
      };
      setState((s) => ({ ...s, outfits: [...s.outfits, outfit] }));
      (async () => {
        const { error } = await supabase.from('outfits').insert({ ...outfit, user_id: userId });
        if (error) console.error('addOutfit DB error:', error);
      })();
      return outfit;
    };

    const deleteOutfit = (id) => {
      setState((s) => ({
        ...s,
        outfits: s.outfits.filter((o) => o.id !== id),
        liked:   s.liked.filter((lid) => lid !== id),
      }));
      (async () => {
        // DB FK cascades liked; wear_log uses set null
        await supabase.from('outfits').delete().eq('id', id);
      })();
    };

    // ── Wear log ───────────────────────────────────────────────
    const wearOutfit = (outfitId, iso = TODAY_ISO) => {
      const prevId      = stateRef.current.wearLog[iso];
      if (prevId === outfitId) return;

      const prevOutfit  = stateRef.current.outfits.find((o) => o.id === prevId);
      const nextOutfit  = stateRef.current.outfits.find((o) => o.id === outfitId);
      if (!nextOutfit) return;

      // Compute which items change (for optimistic + DB sync)
      const itemChanges = {};
      stateRef.current.items.forEach((it) => {
        let worn = it.worn;
        let last = it.last;
        if (prevOutfit && prevOutfit.items.includes(it.id)) worn -= 1;
        if (nextOutfit.items.includes(it.id)) { worn += 1; last = formatLast(iso); }
        if (worn !== it.worn || last !== it.last) {
          itemChanges[it.id] = { worn: Math.max(0, worn), last };
        }
      });

      setState((s) => {
        if (s.wearLog[iso] === outfitId) return s;
        const items = s.items.map((it) =>
          itemChanges[it.id] ? { ...it, ...itemChanges[it.id] } : it,
        );
        return { ...s, items, wearLog: { ...s.wearLog, [iso]: outfitId } };
      });

      (async () => {
        await supabase.from('wear_log').upsert(
          { user_id: userId, iso_date: iso, outfit_id: outfitId },
          { onConflict: 'user_id,iso_date' },
        );
        for (const [itemId, changes] of Object.entries(itemChanges)) {
          await supabase.from('items').update(changes).eq('id', itemId);
        }
      })();
    };

    // ── Likes ──────────────────────────────────────────────────
    const toggleLike = (outfitId) => {
      const wasLiked = stateRef.current.liked.includes(outfitId);
      setState((s) => ({
        ...s,
        liked: s.liked.includes(outfitId)
          ? s.liked.filter((id) => id !== outfitId)
          : [...s.liked, outfitId],
      }));
      if (wasLiked) {
        supabase.from('liked').delete().match({ user_id: userId, outfit_id: outfitId });
      } else {
        supabase.from('liked').insert({ user_id: userId, outfit_id: outfitId });
      }
    };

    const likeOutfit = (outfitId) => {
      if (stateRef.current.liked.includes(outfitId)) return;
      setState((s) => ({ ...s, liked: [...s.liked, outfitId] }));
      supabase.from('liked').insert({ user_id: userId, outfit_id: outfitId });
    };

    // ── Tweaks ─────────────────────────────────────────────────
    const setTweak = (key, value) => {
      setState((s) => ({ ...s, tweaks: { ...s.tweaks, [key]: value } }));
    };

    return {
      addItem, deleteItem, updateItem,
      addOutfit, deleteOutfit,
      wearOutfit, toggleLike, likeOutfit,
      setTweak,
    };
  }, [userId]);

  const value = {
    items:      state.items,
    itemsById,
    outfits:    state.outfits,
    categories: CATEGORIES,
    wearLog:    state.wearLog,
    liked:      state.liked,
    tweaks:     state.tweaks,
    todayIso:   TODAY_ISO,
    loading,
    ...api,
  };

  return <ClosetContext.Provider value={value}>{children}</ClosetContext.Provider>;
}

export function useCloset() {
  const ctx = useContext(ClosetContext);
  if (!ctx) throw new Error('useCloset must be used within a ClosetProvider');
  return ctx;
}

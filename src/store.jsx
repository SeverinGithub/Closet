import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  ITEMS, OUTFITS, CATEGORIES, WEAR_LOG, TODAY_ISO, AR_BY_CAT, formatLast,
} from './data.js';

const STORAGE_KEY = 'closet:v1';

const TWEAK_DEFAULTS = {
  dark: false,
  itemMode: 'photo',
  showOnboarding: false,
};

function defaultState() {
  return {
    items: ITEMS,
    wearLog: WEAR_LOG,
    liked: [],
    tweaks: TWEAK_DEFAULTS,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return {
      items: Array.isArray(parsed.items) ? parsed.items : ITEMS,
      wearLog: parsed.wearLog && typeof parsed.wearLog === 'object' ? parsed.wearLog : WEAR_LOG,
      liked: Array.isArray(parsed.liked) ? parsed.liked : [],
      tweaks: { ...TWEAK_DEFAULTS, ...(parsed.tweaks || {}) },
    };
  } catch {
    return defaultState();
  }
}

const ClosetContext = createContext(null);

export function ClosetProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable — app still works for the session */
    }
  }, [state]);

  const itemsById = useMemo(
    () => Object.fromEntries(state.items.map((i) => [i.id, i])),
    [state.items],
  );

  const api = useMemo(() => {
    const addItem = (draft) => {
      const item = {
        id: 'u' + Date.now().toString(36),
        name: (draft.name || '').trim() || 'Untitled piece',
        cat: draft.cat || 'TOPS',
        tone: draft.tone || '#A89478',
        pat: draft.pat || 'solid',
        ar: AR_BY_CAT[draft.cat] || 1.2,
        worn: 0,
        last: '—',
        tags: draft.tags || [],
        season: draft.season || [],
        brand: (draft.brand || '').trim(),
        price: (draft.price || '').trim(),
      };
      setState((s) => ({ ...s, items: [...s.items, item] }));
      return item;
    };

    // Record an outfit as worn on a date. Idempotent per day: re-assigning a
    // day moves the wear count off the previously logged outfit's pieces.
    const wearOutfit = (outfitId, iso = TODAY_ISO) => {
      setState((s) => {
        const prevId = s.wearLog[iso];
        if (prevId === outfitId) return s;
        const prevOutfit = OUTFITS.find((o) => o.id === prevId);
        const nextOutfit = OUTFITS.find((o) => o.id === outfitId);
        if (!nextOutfit) return s;
        const items = s.items.map((it) => {
          let worn = it.worn;
          if (prevOutfit && prevOutfit.items.includes(it.id)) worn -= 1;
          let last = it.last;
          if (nextOutfit.items.includes(it.id)) {
            worn += 1;
            last = formatLast(iso);
          }
          return worn === it.worn && last === it.last ? it : { ...it, worn: Math.max(0, worn), last };
        });
        return { ...s, items, wearLog: { ...s.wearLog, [iso]: outfitId } };
      });
    };

    const toggleLike = (outfitId) => {
      setState((s) => ({
        ...s,
        liked: s.liked.includes(outfitId)
          ? s.liked.filter((id) => id !== outfitId)
          : [...s.liked, outfitId],
      }));
    };

    const likeOutfit = (outfitId) => {
      setState((s) => (
        s.liked.includes(outfitId)
          ? s
          : { ...s, liked: [...s.liked, outfitId] }
      ));
    };

    const setTweak = (key, value) => {
      setState((s) => ({ ...s, tweaks: { ...s.tweaks, [key]: value } }));
    };

    return { addItem, wearOutfit, toggleLike, likeOutfit, setTweak };
  }, []);

  const value = {
    items: state.items,
    itemsById,
    outfits: OUTFITS,
    categories: CATEGORIES,
    wearLog: state.wearLog,
    liked: state.liked,
    tweaks: state.tweaks,
    todayIso: TODAY_ISO,
    ...api,
  };

  return <ClosetContext.Provider value={value}>{children}</ClosetContext.Provider>;
}

export function useCloset() {
  const ctx = useContext(ClosetContext);
  if (!ctx) throw new Error('useCloset must be used within a ClosetProvider');
  return ctx;
}

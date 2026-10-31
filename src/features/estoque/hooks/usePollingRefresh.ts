'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const REFRESH_INTERVAL_MS = 4_000;

export function usePollingRefresh<T>(
  loadItems: () => Promise<T[]>,
  loadErrorMessage: string,
  loadVersion: () => Promise<string>,
) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestInFlight = useRef(false);
  const mounted = useRef(false);
  const currentVersion = useRef<string | null>(null);

  const refresh = useCallback(async () => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;

    try {
      const nextVersion = await loadVersion();
      if (currentVersion.current === nextVersion) return;
      const latestItems = await loadItems();
      if (mounted.current) {
        setItems(latestItems);
        setError(null);
        currentVersion.current = nextVersion;
      }
    } catch {
      if (mounted.current) setError(loadErrorMessage);
    } finally {
      requestInFlight.current = false;
      if (mounted.current) setIsLoading(false);
    }
  }, [loadItems, loadErrorMessage, loadVersion]);

  useEffect(() => {
    mounted.current = true;
    void refresh();

    const poll = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh();
    }, REFRESH_INTERVAL_MS);

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };

    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);

    return () => {
      mounted.current = false;
      window.clearInterval(poll);
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [refresh]);

  return { items, setItems, isLoading, error, refresh };
}

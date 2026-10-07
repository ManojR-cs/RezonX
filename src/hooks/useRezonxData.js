import { useEffect, useState } from 'react';
import { getSupabaseClient } from '../lib/supabase';

const initialCollection = { data: null, error: null, loading: true };

const initialData = {
  projects: initialCollection,
  events: initialCollection,
  activities: initialCollection,
  highlights: initialCollection,
  achievements: initialCollection,
  gallery: initialCollection,
  projectCount: initialCollection,
  activityCount: initialCollection,
  members: initialCollection,
  prizes: initialCollection,
  siteSettings: initialCollection,
};

function collectionResult(data, error) {
  return { data: error ? null : data, error: error?.message ?? null, loading: false };
}

export default function useRezonxData() {
  const [state, setState] = useState(initialData);

  useEffect(() => {
    let isActive = true;

    async function load() {
      let supabase;
      try {
        supabase = getSupabaseClient();
      } catch (error) {
        const configurationError = error instanceof Error ? error.message : 'Supabase configuration is missing.';
        if (isActive) {
          setState(Object.fromEntries(
            Object.keys(initialData).map((key) => [key, collectionResult(null, configurationError)]),
          ));
        }
        return;
      }

      const requests = {
        projects: () => supabase.from('projects').select('*').order('id', { ascending: true }),
        events: () => supabase
          .from('events')
          .select('id, title, description, poster_url, event_date, event_time, venue, registration_url, theme')
          .eq('is_active', true)
          .order('event_date', { ascending: true, nullsFirst: false }),
        activities: () => supabase.from('activities').select('*').eq('type', 'activity').order('id', { ascending: true }),
        highlights: () => supabase.from('activities').select('*').eq('type', 'recent_highlight').order('id', { ascending: true }),
        achievements: () => supabase.from('achievements').select('*').order('created_at', { ascending: false }),
        gallery: () => supabase.from('gallery').select('*').order('created_at', { ascending: true }),
        projectCount: () => supabase.from('projects').select('*', { count: 'exact', head: true }),
        activityCount: () => supabase.from('activities').select('*', { count: 'exact', head: true }).eq('type', 'activity'),
        members: () => supabase.from('site_settings').select('member_count').eq('id', 1).single(),
        prizes: () => supabase.from('statistics').select('value').eq('label', 'Prizes Won').single(),
        siteSettings: () => supabase.from('site_settings').select('hero_image_url').eq('id', 1).single(),
      };

      const entries = await Promise.all(
        Object.entries(requests).map(async ([key, request]) => {
          try {
            const result = await request();
            return [key, collectionResult(
              key.endsWith('Count') ? result.count : result.data,
              result.error,
            )];
          } catch (error) {
            return [key, collectionResult(null, error instanceof Error ? error.message : 'Request failed.')];
          }
        }),
      );

      if (isActive) setState(Object.fromEntries(entries));
    }

    load();
    return () => {
      isActive = false;
    };
  }, []);

  return state;
}

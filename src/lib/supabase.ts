/**
 * Supabase client.
 *
 * Credentials come from public env vars (safe for the anon key). For native
 * builds, install `@react-native-async-storage/async-storage` and pass it as
 * the auth storage so sessions persist across launches.
 *
 *   EXPO_PUBLIC_SUPABASE_URL=...
 *   EXPO_PUBLIC_SUPABASE_ANON_KEY=...
 *
 * The client is created lazily so the app still boots (in demo / guest mode)
 * when no credentials are configured yet.
 */

// import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

// let client: SupabaseClient | null = null;

/**
 * Returns the shared Supabase client, or null when running in guest/demo mode.
 *
 * Uncomment the implementation once `@supabase/supabase-js` is installed:
 *
 *   export function getSupabase(): SupabaseClient | null {
 *     if (!isSupabaseConfigured) return null;
 *     if (!client) {
 *       client = createClient(url!, anonKey!, {
 *         auth: { persistSession: true, autoRefreshToken: true },
 *       });
 *     }
 *     return client;
 *   }
 */
export function getSupabase(): null {
  return null;
}

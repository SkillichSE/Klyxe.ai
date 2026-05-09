export async function GET() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return Response.json({ error: 'Supabase env vars not set' }, { status: 500 });
  }

  return Response.json({ SUPABASE_URL, SUPABASE_ANON_KEY });
}
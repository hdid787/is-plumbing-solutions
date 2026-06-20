// app/api/leads/route.ts
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data } = await supabase
    .from('leads_by_postcode')
    .select('*')
    .limit(10);
  return Response.json(data);
}
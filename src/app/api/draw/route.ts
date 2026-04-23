import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  try {
    // 1. Generate Winning Numbers (1-45 Stableford range)
    const winningNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 45) + 1);

    // 2. Fetch all scores for simulation 
    const { data: allScores } = await supabase.from('scores').select('user_id, score');

    // 3. Count Winners (Logic for 3, 4, and 5 matches)
    const userMatches = allScores?.reduce((acc: any, curr) => {
      if (winningNumbers.includes(curr.score)) {
        acc[curr.user_id] = (acc[curr.user_id] || 0) + 1;
      }
      return acc;
    }, {});

    const winnersFound = Object.values(userMatches || {})
      .filter((count: any) => count >= 3).length;

    return NextResponse.json({ success: true, winningNumbers, winnersFound });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
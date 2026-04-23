import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Simulate network latency for a "real" feel
  await new Promise((resolve) => setTimeout(resolve, 2000)); 
  
  const successUrl = `${req.headers.get('origin')}/dashboard?success=true`;
  return NextResponse.json({ url: successUrl });
}
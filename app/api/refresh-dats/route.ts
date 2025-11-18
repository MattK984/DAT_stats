import { NextResponse } from 'next/server';
import { canRefresh, refreshAllDats } from '../../../lib/datService';

export async function POST() {
  const eligibility = canRefresh();
  if (!eligibility.allowed) {
    return NextResponse.json(
      { message: `Please wait ${eligibility.retryAfter}s before refreshing again.` },
      { status: 429 }
    );
  }

  const statuses = await refreshAllDats();
  return NextResponse.json({ message: 'Refresh complete', statuses });
}

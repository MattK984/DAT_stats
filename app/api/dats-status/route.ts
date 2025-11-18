import { NextResponse } from 'next/server';
import { getCachedStatuses } from '../../../lib/datService';

export async function GET() {
  const snapshot = getCachedStatuses();
  return NextResponse.json(snapshot);
}

import {NextResponse} from 'next/server';
import {getMarkets} from '@/lib/market';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function GET(){try{return NextResponse.json({source:'TGJU',fetchedAt:new Date().toISOString(),markets:await getMarkets()},{headers:{'Cache-Control':'no-store'}})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'خطا در دریافت بازار'},{status:502})}}
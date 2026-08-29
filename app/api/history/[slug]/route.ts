import {NextResponse} from 'next/server';
import {getHistory} from '@/lib/market';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function GET(_req:Request,{params}:{params:Promise<{slug:string}>}){try{const {slug}=await params;const history=await getHistory(slug);return NextResponse.json({slug,source:'TGJU',history},{headers:{'Cache-Control':'no-store'}})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'خطا در تاریخچه'},{status:502})}}
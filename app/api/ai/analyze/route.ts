import {NextResponse} from 'next/server';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function POST(req:Request){
  const payload=await req.json(); const url=process.env.AGENT_MANAGER_URL; const token=process.env.AGENT_MANAGER_TOKEN;
  if(url){try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify({task:'gold_market_analysis',market:payload})});const text=await r.text();return new NextResponse(text,{status:r.status,headers:{'Content-Type':r.headers.get('content-type')||'application/json'}})}catch(e){return NextResponse.json({error:`Agent Manager connection failed: ${e instanceof Error?e.message:'unknown'}`},{status:502})}}
  const markets=payload?.markets||[]; const rising=markets.filter((m:any)=>(m.changePct??0)>0).length; const falling=markets.filter((m:any)=>(m.changePct??0)<0).length;
  return NextResponse.json({mode:'fallback',analysis:`تحلیل پایه: ${rising} بازار صعودی و ${falling} بازار نزولی هستند. برای تحلیل هوشمند کامل، AGENT_MANAGER_URL و AGENT_MANAGER_TOKEN را در Vercel تنظیم کنید.`});
}
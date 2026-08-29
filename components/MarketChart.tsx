'use client';
import {useMemo} from 'react';
export default function MarketChart({data}:{data:{date:string;close:number}[]}){
 const points=useMemo(()=>{if(!data.length)return '';const vals=data.map(x=>x.close);const min=Math.min(...vals),max=Math.max(...vals);const w=900,h=250,p=16;return data.map((x,i)=>`${p+(i/(Math.max(1,data.length-1)))*(w-p*2)},${h-p-((x.close-min)/Math.max(1,max-min))*(h-p*2)}`).join(' ');},[data]);
 return <div className="chart">{data.length?<svg viewBox="0 0 900 250" preserveAspectRatio="none"><polyline points={points} fill="none" stroke="#e7b85d" strokeWidth="3" vectorEffect="non-scaling-stroke"/><line x1="0" y1="230" x2="900" y2="230" stroke="#24344d"/></svg>:<div className="muted">تاریخچه‌ای دریافت نشد.</div>}</div>;
}
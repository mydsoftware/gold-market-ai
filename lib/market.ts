import * as cheerio from 'cheerio';

export type MarketItem = { slug:string; name:string; price:number|null; change:number|null; changePct:number|null; time:string|null; unit:string; category:string; sourceUrl:string };

export const MARKETS = [
  {slug:'geram18',name:'طلای ۱۸ عیار',category:'طلا',unit:'ریال / گرم'},
  {slug:'geram24',name:'طلای ۲۴ عیار',category:'طلا',unit:'ریال / گرم'},
  {slug:'sekeb',name:'سکه بهار آزادی',category:'سکه',unit:'ریال / قطعه'},
  {slug:'sekee',name:'سکه امامی',category:'سکه',unit:'ریال / قطعه'},
  {slug:'nim',name:'نیم سکه',category:'سکه',unit:'ریال / قطعه'},
  {slug:'rob',name:'ربع سکه',category:'سکه',unit:'ریال / قطعه'},
  {slug:'gerami',name:'سکه گرمی',category:'سکه',unit:'ریال / قطعه'},
  {slug:'price_dollar_rl',name:'دلار آزاد',category:'ارز',unit:'ریال'},
  {slug:'ons',name:'اونس طلا',category:'جهانی',unit:'دلار'},
] as const;

const norm=(s:string)=>s.replace(/[۰-۹]/g,d=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g,d=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/\u200c/g,' ').replace(/,/g,'').replace(/\s+/g,' ').trim();
const num=(s:string)=>{const m=norm(s).replace(/[^0-9.-]/g,'');return m?Number(m):null};

async function getHtml(url:string){
  const r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (compatible; GoldMarketAI/1.0)'},cache:'no-store'});
  if(!r.ok) throw new Error(`TGJU ${r.status}`);
  return r.text();
}

function rowFor($:cheerio.CheerioAPI, label:string){
  let cells:string[]=[];
  $('tr').each((_,tr)=>{const c=$(tr).find('td,th').map((__,x)=>norm($(x).text())).get();if(c.some(x=>x===label||x.includes(label))) cells=c;});
  return cells;
}

export async function getMarkets():Promise<MarketItem[]>{
  const html=await getHtml('https://www.tgju.org/local-markets'); const $=cheerio.load(html);
  const aliases:Record<string,string[]>= {
    geram18:['طلای 18 عیار / 750','طلای 18 عیار/750'], geram24:['طلای 24 عیار'], sekeb:['سکه بهار آزادی'], sekee:['سکه امامی'], nim:['نیم سکه'], rob:['ربع سکه'], gerami:['سکه گرمی'], price_dollar_rl:['دلار'], ons:['انس طلا','اونس طلا']
  };
  return MARKETS.map(m=>{
    let cells:string[]=[]; for(const a of aliases[m.slug]??[m.name]){cells=rowFor($,a);if(cells.length)break;}
    const nums=cells.map(num).filter((x):x is number=>x!==null); const price=nums[0]??null;
    const pctMatch=cells.find(x=>/%/.test(x)); const changePct=pctMatch?num(pctMatch):null;
    const time=cells.find(x=>/^\d{1,2}:\d{2}:\d{2}$/.test(x))??null;
    return {...m,price,change:nums[1]??null,changePct,time,sourceUrl:`https://www.tgju.org/profile/${m.slug}`};
  });
}

export async function getHistory(slug:string,limit=60){
  if(!MARKETS.some(m=>m.slug===slug)) throw new Error('نماد نامعتبر است');
  const html=await getHtml(`https://www.tgju.org/profile/${slug}/history`); const $=cheerio.load(html); const rows:{date:string;open:number;low:number;high:number;close:number;changePct:number}[]=[];
  $('tr').each((_,tr)=>{const c=$(tr).find('td').map((__,x)=>norm($(x).text())).get(); if(c.length>=8){const open=num(c[0]),low=num(c[1]),high=num(c[2]),close=num(c[3]),changePct=num(c[5]); if(open&&low&&high&&close&&c[6]) rows.push({date:c[7]||c[6],open,low,high,close,changePct:changePct??0});}});
  return rows.slice(0,limit).reverse();
}

export async function getBubbleData(){
  const slugs=[['sekee','حباب سکه امامی'],['sekeb','حباب سکه بهار آزادی'],['nim','حباب نیم سکه'],['rob','حباب ربع سکه'],['gerami','حباب سکه گرمی']];
  const result=[] as {slug:string;name:string;value:number|null;changePct:number|null}[];
  for(const [slug,name] of slugs){try{const html=await getHtml(`https://www.tgju.org/profile/${slug}`);const $=cheerio.load(html);let value:number|null=null,changePct:number|null=null; $('tr').each((_,tr)=>{const c=$(tr).find('td,th').map((__,x)=>norm($(x).text())).get();if(c.some(x=>x.includes('حباب'))){const ns=c.map(num).filter((x):x is number=>x!==null);value=ns[0]??value;changePct=ns[1]??changePct;}}); result.push({slug,name,value,changePct});}catch{result.push({slug,name,value:null,changePct:null});}}
  return result;
}

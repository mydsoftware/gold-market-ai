# Gold Market AI

سایت فارسی قیمت لحظه‌ای طلا، سکه، دلار و اونس با تاریخچه، نمودار، حباب سکه و اتصال اختیاری به AI-Agent-Manager.

## معماری

- Next.js App Router
- TGJU provider در `lib/market.ts`
- `/api/markets` قیمت‌های زنده
- `/api/history/[slug]` آرشیو روزانه
- `/api/bubbles` حباب سکه
- `/api/indicators` شاخص‌های تکنیکال
- `/api/ai/analyze` آداپتر Agent Manager
- صفحات اختصاصی `/market/[slug]`

## Market Intelligence

موتور تحلیل، تغییر قیمت، درصد تغییر، سقف/کف، SMA7، SMA30، روند، حمایت و مقاومت را از تاریخچه محاسبه می‌کند. AI فقط باید بر اساس داده واقعی تحلیل کند و نباید قیمت را حدس بزند.

## اتصال Agent Manager

در Vercel تنظیم کنید:

```text
AGENT_MANAGER_URL=https://...
AGENT_MANAGER_TOKEN=...
```

`POST /api/ai/analyze` داده بازار، شاخص‌ها و prompt ساختاریافته را به Agent Manager ارسال می‌کند. اگر URL تنظیم نشده باشد، API در حالت fallback تحلیل پایه ارائه می‌دهد.

## اجرا

```bash
npm install
npm run dev
```

## Vercel

Repository را به Project متصل و Root Directory را ریشه repository قرار دهید. Framework روی Next.js تشخیص داده می‌شود.

## منبع داده

نسخه فعلی برای دریافت داده از صفحات عمومی TGJU استفاده می‌کند. برای نسخه تجاری بهتر است provider به API رسمی TGJU دارای توکن منتقل شود.

## تاریخچه پایدار

برای تاریخچه لحظه‌ای بلندمدت، مرحله بعدی اضافه‌کردن دیتابیس/کش دائمی و job جمع‌آوری داده است.

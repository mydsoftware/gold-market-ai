# Gold Market AI

سایت فارسی قیمت لحظه‌ای طلا، سکه، دلار و اونس با تاریخچه، نمودار، حباب سکه و اتصال اختیاری به AI-Agent-Manager.

## معماری

- Next.js App Router
- TGJU provider در `lib/market.ts`
- `/api/markets` قیمت‌های زنده
- `/api/history/[slug]` آرشیو روزانه
- `/api/bubbles` حباب سکه
- `/api/ai/analyze` آداپتر Agent Manager
- صفحات اختصاصی `/market/[slug]`

## اجرای محلی

```bash
npm install
npm run dev
```

## Vercel

Repository را به یک Project در Vercel متصل کنید و Root Directory را ریشه همین repository قرار دهید. Framework روی Next.js تشخیص داده می‌شود.

برای اتصال Agent Manager در Environment Variables این دو مقدار را تنظیم کنید:

```text
AGENT_MANAGER_URL=https://...
AGENT_MANAGER_TOKEN=...
```

## منبع داده

نسخه فعلی برای دریافت داده از صفحات عمومی TGJU استفاده می‌کند. TGJU در مستندات خود وب‌سرویس رسمی JSON/XML را نیز معرفی کرده است؛ برای نسخه تجاری بهتر است provider به API رسمی دارای توکن منتقل شود.

## نکته تاریخچه

تاریخچه از صفحات آرشیو هر پروفایل TGJU خوانده می‌شود و در سمت سرور پردازش می‌شود. برای تاریخچه لحظه‌ای بلندمدت و پایدار، در فاز بعدی باید یک دیتابیس/کش دائمی و job جمع‌آوری داده اضافه شود.

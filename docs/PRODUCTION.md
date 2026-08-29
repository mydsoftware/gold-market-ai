# Production

نسخه فعلی برای توسعه و محیط دارای فایل‌سیستم پایدار از SQLite استفاده می‌کند.

نکته مهم: فایل SQLite در محیط Serverless/Vercel نباید به‌عنوان storage دائمی فرض شود. برای تاریخچه دائمی در Production باید بعداً لایه repository به یک دیتابیس پایدار منتقل شود، بدون تغییر APIهای سایت.

## قرارداد داده

Collector باید snapshotهای بازار را با `symbol`, `price`, `changePct`, `timestamp` ذخیره کند.

## AI

`POST /api/ai/analyze` داده بازار و شاخص‌ها را به Agent Manager ارسال می‌کند. کلیدهای اتصال از Environment Variables خوانده می‌شوند و نباید در کد hard-code شوند.

## هشدار

`POST /api/alerts/check` برای بررسی قوانین above/below آماده است و در مرحله UI می‌تواند به Notification/Email/Push متصل شود.

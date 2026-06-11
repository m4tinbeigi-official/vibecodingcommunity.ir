# تنظیمات SMS.ir

توکن API با موفقیت در `.env` file قرار گرفت:

```env
SMSIR_API_KEY=eQHDpjrkvOMrk0qeedMINx6B3Wwad85tE2GXgWD3GYxlY8B8
```

## مرحله بعد: دریافت Message ID

برای ارسال SMS از SMS.ir، باید یک Template با پارامتر `OTP` بسازید:

1. به پنل SMS.ir بروید: https://panel.sms.ir/
2. از منو، **Templates** یا **الگوهای پیامکی** را انتخاب کنید
3. **New Template** یا **الگوی جدید** بسازید
4. متن پیام را این‌طور بنویسید:
   ```
   کد تایید شما: {{OTP}}
   ```
5. بعد از ذخیره، **Message ID** را کپی کنید
6. Message ID را در `.env` file قرار دهید:
   ```env
   SMSIR_MESSAGE_ID=12345
   ```

## تست SMS

بعد از تنظیم Message ID:

```bash
# پروژه را اجرا کنید
npm run dev

# تست ارسال OTP از طریق:
# http://localhost:3000/verify-phone
```

## نکات مهم

- **در Development**: کد OTP در console چاپ می‌شود (هزینه صفر)
- **در Production**: SMS واقعی ارسال می‌شود
- **Rate Limiting**: 3 SMS در 15 دقیقه برای هر شماره
- **OTP Expiration**: 5 دقیقه اعتبار

## Troublehooting

اگر SMS ارسال نشد:

1. API Key را بررسی کنید: ✅ (تنظیم شده)
2. Message ID را بررسی کنید: ❓ (باید تنظیم شود)
3. موجودی حساب SMS.ir را چک کنید
4. Template باید با پارامتر `OTP` ساخته شده باشد

---

**وضعیت فعلی:**
- ✅ API Key: تنظیم شده
- ⏳ Message ID: در انتظار تنظیم
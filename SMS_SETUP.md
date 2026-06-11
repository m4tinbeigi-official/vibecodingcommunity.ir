# تنظیمات SMS.ir

## ✅ تمام تنظیمات کامل شد!

**توکن API:**
```env
SMSIR_API_KEY=eQHDpjrkvOMrk0qeedMINx6B3Wwad85tE2GXgWD3GYxlY8B8
```

**شناسه قالب (Message ID):**
```env
SMSIR_MESSAGE_ID=622349
```

**متن پیامک:**
```
کد: #OTP#
جامعه وایب کدینگ ایران
```

## تست SMS

```bash
# پروژه را اجرا کنید
npm run dev

# تست ارسال OTP:
http://localhost:3000/verify-phone
```

## نحوه کارکرد

1. کاربر شماره موبایل وارد می‌کند
2. سرور کد 4 رقمی تولید می‌کند
3. SMS.ir پیامک ارسال می‌کند:
   ```
   کد: 1234
   جامعه وایب کدینگ ایران
   ```
4. کد با bcrypt هش می‌شود
5. در دیتابیس با 5 دقیقه انقضا ذخیره می‌شود

## نکات امنیتی

- ✅ Rate Limiting: 3 SMS در 15 دقیقه
- ✅ OTP Hashing: bcrypt با 10 rounds
- ✅ OTP Expiration: 5 دقیقه
- ✅ Server-side فقط: API key هرگز leak نمی‌شود

---

**وضعیت:**
- ✅ API Key: تنظیم شده
- ✅ Message ID: تنظیم شده (622349)
- ✅ Template: "کد: #OTP#" - جامعه وایب کدینگ ایران
- ✅ آماده استفاده
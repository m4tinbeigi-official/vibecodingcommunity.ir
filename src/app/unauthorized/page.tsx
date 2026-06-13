export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="text-red-500 text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          دسترسی غیرمجاز
        </h1>
        <p className="text-gray-600 mb-6">
          شما اجازه دسترسی به این بخش را ندارید. این صفحه فقط برای مدیران جامعه در دسترس است.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          <p className="font-semibold">اگر فکر می‌کنید این یک اشتباه است:</p>
          <p className="mt-1">با مدیریت جامعه تماس بگیرید تا وضعیت حساب شما را بررسی کنند.</p>
        </div>
      </div>
    </div>
  );
}

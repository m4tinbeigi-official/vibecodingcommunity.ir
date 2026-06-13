export default function SuspendedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          حساب شما مسدود شده است
        </h1>
        <p className="text-gray-600 mb-6">
          حساب شما به دلیل نقض قوانین جامعه مسدود شده است. برای اطلاعات بیشتر با مدیریت تماس بگیرید.
        </p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
          <p className="font-semibold">راهنما:</p>
          <p className="mt-1">اگر فکر می‌کنید این یک اشتباه است، با پشتیبانی تماس بگیرید.</p>
        </div>
      </div>
    </div>
  );
}

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-600">Access Forbidden</h1>
      <p className="mt-2 text-gray-600">
        Kamu tidak memiliki akses ke halaman ini.
      </p>
    </div>
  );
}

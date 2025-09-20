import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#111827] mb-4">HINCH</h1>
        <p className="text-[#6B7280] mb-8">Premium Laminates & Materials</p>
        <Link
          href="/catalogs"
          className="bg-[#FF7A1A] hover:bg-[#FF8F40] text-white rounded-xl px-6 py-3 text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2"
        >
          View Catalogs
        </Link>
      </div>
    </div>
  );
}

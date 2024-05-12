import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen w-full p-24">
      <h1 className="text-4xl font-bold text-center">Thank you for your some fun quizes</h1>
      <ul>
        <li>
          <Link href="/auto-delete/">
            1: Auto Delete
          </Link>
        </li>
        <li>
          <Link href="/department/">
            2: Create data from API
          </Link>
        </li>
      </ul>
    </main>
  );
}

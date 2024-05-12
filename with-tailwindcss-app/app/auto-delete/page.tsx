import Link from "next/link";

const Home = () => {
    return (
        <main className="min-h-screen w-full px-24 py-8">
            <h1 className="text-4xl font-bold text-center">Question: Auto Delete Todo List</h1>
            <h2>Approaches(s)</h2>
            <ul>
                <li>
                    <Link href="/auto-delete/queue">
                        1: Queue (Advanced)
                    </Link>
                </li>
                <li>
                    <Link href="/auto-delete/grpah">
                        2: Graph + Queue (Advanced)
                    </Link>
                </li>
            </ul>
        </main>
    );
}

export default Home;
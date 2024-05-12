import groupDepartment from "@/lib/group-department";
import { User } from "@/types/data";
import { toBig, toSmall } from "@/utils";
import Link from "next/link";

const fetchDepartments = async (): Promise<User[]> => {
    const response = await fetch('https://dummyjson.com/users');
    if (!response.ok) {
        throw new Error('Failed to fetch departments');
    }
    const { users } = await response.json();
    return users;
};

export default async function Home({ params }: { params: { slug: string } }) {

    const users = await fetchDepartments();
    const deparmentName = toSmall(decodeURIComponent(params.slug));
    const deparments = Object.fromEntries(groupDepartment(users));


    return (
        <main className="min-h-screen w-full p-24">
            <h1 className="text-4xl font-bold text-center">Welcome to <strong>{toBig(params.slug)}</strong> deparment</h1>

            <div className="py-4 my-4 bg-gray-100 shadow-xl rounded-xl">
                <p>
                    <Link href={`/api/department/${toSmall(params.slug)}`}>Click here to see the api</Link>
                </p>
            </div>

            <p className="my-4 py-4 bg-gray-100 shadow-xl rounded-xl">Here is the groupBy:</p>

            <pre className="bg-gray-100 rounded-xl shadow-xl">
                {JSON.stringify(deparments[deparmentName], null, 2)}
            </pre>
        </main>
    );
}

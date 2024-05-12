import groupDepartment from "@/lib/group-department";
import { User } from "@/types/data";
import Link from "next/link";

const fetchDepartments = async (): Promise<User[]> => {
    const response = await fetch('https://dummyjson.com/users');
    if (!response.ok) {
        throw new Error('Failed to fetch departments');
    }
    const { users } = await response.json();
    return users;
};


const Home = async () => {
    const users = await fetchDepartments();

    const departments = Array.from(new Set(users.map((user) => user.company.department)));

    const deparments = Object.fromEntries(groupDepartment(users));

    return (
        <main className="min-h-screen w-full px-24 py-8">
            <p>Thank you for assignment #2</p>
            <p>Due to the sample data and assignment requirement can be solve with simple Table or Object</p>
            <p>I have created a function that work with API and client side.</p>
            <p>Surprisingly, my function can be use to catch the department eg: /department/[department] too.</p>
            <p>Here is the list of departments:</p>

            <div className="shadow-xl rounded-xl py-4 bg-gray-100 my-4">
                <p className="font-bold">Click below to show the client side of each deparment</p>
                <ul>

                    <li>
                        <Link href={`/department/`}>
                            0: All departments
                        </Link>
                    </li>

                    {departments.map((department, index) => (
                        <li key={department}>
                            <Link href={`/department/${department.replace(/\s/g, '-').toLowerCase()}`}>
                                {index + 1}: {department}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <pre className="bg-gray-100 rounded-xl shadow-xl">
                {JSON.stringify(deparments, null, 2)}
            </pre>
        </main>
    );
}

export default Home;
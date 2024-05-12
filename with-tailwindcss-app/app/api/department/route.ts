import groupDepartment from "@/lib/group-department";
import { User } from "@/types/data";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { data } = await axios.get<{ users: User[] }>("https://dummyjson.com/users");

        const users = data.users;

        const reformDepartments = groupDepartment(users);

        return NextResponse.json(Object.fromEntries(reformDepartments), { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed" }, { status: 500 });
    }

} 
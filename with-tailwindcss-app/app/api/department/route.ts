import groupDepartment from "@/lib/group-department";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const response = await fetch('https://dummyjson.com/users');
    if (!response.ok) {
        throw new Error('Failed to fetch departments');
    }
    const { users } = await response.json();

    const reformDepartments = groupDepartment(users);

    return NextResponse.json({ departments: Object.fromEntries(reformDepartments) }, { status: 200 });
} 
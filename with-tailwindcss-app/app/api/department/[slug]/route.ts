import groupDepartment from "@/lib/group-department";
import { RefromData } from "@/types/data";
import { toSmall } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
    const response = await fetch('https://dummyjson.com/users');
    if (!response.ok) {
        throw new Error('Failed to fetch departments');
    }
    const { users } = await response.json();

    const reformDepartments = groupDepartment(users);

    const department: { [x: string]: RefromData } = {};

    department[toSmall(params.slug)] = Object.fromEntries(reformDepartments)[toSmall(params.slug)];

    if (!department[toSmall(params.slug)]) {
        return NextResponse.json({ error: 'Department not found' }, { status: 404 })
    }

    return NextResponse.json({ ...department }, { status: 200 });
} 
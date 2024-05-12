import groupDepartment from "@/lib/group-department";
import { RefromData, User } from "@/types/data";
import { toSmall } from "@/utils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
    try {
        const { data } = await axios.get<{ users: User[] }>("https://dummyjson.com/users");

        const users = data.users;

        const reformDepartments = groupDepartment(users);

        const department: { [x: string]: RefromData } = {};

        department[toSmall(params.slug)] = Object.fromEntries(reformDepartments)[toSmall(params.slug)];

        if (!department[toSmall(params.slug)]) {
            return NextResponse.json({ error: 'Department not found' }, { status: 404 })
        }


        return NextResponse.json({ ...department }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed" }, { status: 500 });
    };
    
};
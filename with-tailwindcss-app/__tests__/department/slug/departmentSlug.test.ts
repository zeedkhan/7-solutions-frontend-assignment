/**
 * @jest-environment node
 */

import { GET } from "@/app/api/department/[slug]/route";
import { NextRequest } from "next/server";
import axios from "axios";

jest.mock("axios", () => jest.fn());

describe("GET API Route /api/department/", () => {
    const mockUsers = [
        {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            age: 25,
            gender: "male",
            hair: { color: "white" },
            address: { postalCode: "12345" },
            company: { department: "IT" },
        },
        {
            id: 2,
            firstName: "Jane",
            lastName: "Doe",
            age: 24,
            gender: "female",
            hair: { color: "brown" },
            address: { postalCode: "9874" },
            company: { department: "HR" },
        },
        {
            id: 3,
            firstName: "Bob",
            lastName: "Lazar",
            age: 40,
            gender: "male",
            hair: { color: "blond" },
            address: { postalCode: "12352" },
            company: { department: "IT" },
        },
    ];

    beforeEach(() => {
        axios.get = jest.fn().mockResolvedValue({
            data: { users: mockUsers },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should group users by spcific department correctly", async () => {
        const response = await GET(new NextRequest("localhost:3000/api/department/"), { params: { slug: "it" } });
        const data = await response.json();

        expect(data).toEqual({
            it: {
                male: 2,
                female: 0,
                ageRange: "25 - 40",
                hair: {
                    white: 1,
                    blond: 1,
                },
                addressUser: {
                    "JohnDoe": "12345",
                    "BobLazar": "12352",
                },
            }
        });
    });

    test("should group users by spcific department correctly", async () => {
        const response = await GET(new NextRequest("localhost:3000/api/department/"), { params: { slug: "hr" } });
        const data = await response.json();

        expect(data).toEqual({
            hr: {
                male: 0,
                female: 1,
                ageRange: "24 - 24",
                hair: {
                    brown: 1,
                },
                addressUser: {
                    "JaneDoe": "9874",
                },
            },
        });
    });


});
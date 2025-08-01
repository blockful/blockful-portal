import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ role: null }, { status: 401 });
    }

    // Get role from query parameter (sent by client)
    const { searchParams } = new URL(request.url);
    const clientRole = searchParams.get("role");

    // Use client role if available, otherwise default to employee
    const role = clientRole || "employee";

    return NextResponse.json({ role });
  } catch (error) {
    console.error("Error getting role:", error);
    return NextResponse.json({ role: "employee" }, { status: 500 });
  }
}

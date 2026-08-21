import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/server/services/user.service";
import { searchDataloggerRequestSchema } from "@/server/validators/user.validator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const payload = searchDataloggerRequestSchema.parse(body);

    const service = new UserService();

    const result = await service.searchDataloggerByMacAddress(
      payload.macAddress,
    );

    return NextResponse.json(result, {
      status: result.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        message: error instanceof Error ? error.message : "Invalid request",
      },
      { status: 400 },
    );
  }
}

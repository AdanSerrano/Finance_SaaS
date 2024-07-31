import { NextRequest, NextResponse } from "next/server";

export const GET = (req: NextRequest) => {
    return NextResponse.json({
        hello: 'Hellow Word',
    });
}
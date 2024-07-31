import { NextRequest, NextResponse } from "next/server";

export const GET = (req: NextRequest, { params }: { params: { testId: string } }) => {
    return NextResponse.json({
        hello: 'Hellow Word',
        test: params.testId
    });
}
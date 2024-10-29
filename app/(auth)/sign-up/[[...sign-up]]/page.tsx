import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";

import { Loader2 } from "lucide-react";
import React from "react";

export default function SignUpPage() {
    return (
        <>
            <ClerkLoaded>
                <SignUp />
            </ClerkLoaded>
            <ClerkLoading>
                <Loader2 className="animate-spin text-muted-foreground" />
            </ClerkLoading>
        </>
    );
}
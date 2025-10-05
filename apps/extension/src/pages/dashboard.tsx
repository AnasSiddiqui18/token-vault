import { authClient } from "@/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import { Coins } from "lucide-react";
import { storage } from "@wxt-dev/storage";
import { useNavigate } from "react-router";

export function Dashboard() {
    const { signOut } = authClient;
    const navigate = useNavigate();

    return (
        <div className="bg-background h-full text-muted-foreground rounded-lg p-4 overflow-hidden">
            <div className="border-b border-muted pb-4 mb-4 flex justify-between items-center">
                <div className="text-foreground flex gap-2 font-bold items-center text-base">
                    <Coins className="size-6 text-orange-300" />
                </div>

                <div className="flex gap-3">
                    <AddServiceDialog />
                    <Button
                        size="sm"
                        onClick={async () => {
                            const res = await signOut();

                            console.log("signOut response", res);

                            if (res.data?.success) {
                                await storage.removeItem("session:token");
                                return navigate("/sign-in");
                            }
                            console.log("Logout failed", res.error);
                        }}
                    >
                        Logout
                    </Button>
                </div>
            </div>

            <ServiceListing />
        </div>
    );
}

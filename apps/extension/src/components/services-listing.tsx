import { orpcQueryClient } from "@/orpc/orpc";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";

export function ServiceListing() {
    const { data, isPending, error } = useQuery(
        orpcQueryClient.service.list.queryOptions(),
    );

    const services = [
        {
            id: "srv_001",
            label: "GitHub",
            createdAt: "2025-07-30T12:45:00Z",
            provider: "GitHub",
        },
        {
            id: "srv_002",
            label: "AWS",
            createdAt: "2025-07-29T09:20:00Z",
            provider: "Amazon",
        },
        {
            id: "srv_003",
            label: "Notion",
            createdAt: "2025-07-28T16:10:00Z",
            provider: "Notion",
        },
        {
            id: "srv_004",
            label: "Vercel",
            createdAt: "2025-07-25T14:00:00Z",
            provider: "Vercel",
        },
        {
            id: "srv_005",
            label: "DigitalOcean",
            createdAt: "2025-07-22T08:30:00Z",
            provider: "DigitalOcean",
        },
        {
            id: "srv_004",
            label: "Vercel",
            createdAt: "2025-07-25T14:00:00Z",
            provider: "Vercel",
        },
        {
            id: "srv_005",
            label: "DigitalOcean",
            createdAt: "2025-07-22T08:30:00Z",
            provider: "DigitalOcean",
        },
    ];

    if (isPending) {
        return (
            <div className="text-sm text-center text-muted-foreground py-6">
                <LoaderCircle className="animate-spin mx-auto mb-2" />
                Loading services...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-sm text-center text-destructive py-6">
                Failed to load services.
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-4 w-full max-w-md h-[450px] overflow-y-auto pretty-scrollbar py-2">
            {services.map((service) => (
                <div
                    key={service.id}
                    className="flex flex-col space-y-1 bg-muted/20 p-3 rounded-md"
                >
                    <Label className="text-sm font-medium text-muted-foreground">
                        {service.label}
                    </Label>
                    <Input readOnly value={`••••••••••`} />
                </div>
            ))}
        </div>
    );
}

import { orpcQueryClient } from "@/orpc/orpc";
import { useQuery } from "@tanstack/react-query";
import { File } from "lucide-react";
import { ServiceCard } from "./service-card";
import CircularTimer from "./circular-timer";
import { Spinner } from "@heroui/react";

export function ServiceListing() {
    const {
        data: services,
        isPending,
        error,
        refetch,
    } = useQuery(
        orpcQueryClient.service.list.queryOptions({
            queryKey: ["list_services"],
            refetchOnWindowFocus: false,
        }),
    );

    return (
        <div className="flex flex-col space-y-4 w-full max-w-md h-[450px] overflow-y-auto pretty-scrollbar py-2">
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-xl">Services</h2>
                <CircularTimer
                    refetch={refetch}
                    size={40}
                    enable={!!services?.length}
                />
            </div>

            {isPending ? (
                <div className="flex flex-col items-center space-y-4 py-10">
                    <Spinner size="md" />
                    <span className="text-muted-foreground">
                        Loading services...
                    </span>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center space-y-4 py-10">
                    <File className="size-10 text-destructive" />
                    <span className="text-destructive">
                        {error.message || "Something went wrong"}
                    </span>
                </div>
            ) : services.length > 0 ? (
                services.map((service) => (
                    <div className="space-y-5" key={service.id}>
                        <ServiceCard data={service} />
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center space-y-4 py-10">
                    <File className="size-10 text-primary" />
                    <span className="text-muted-foreground text-center">
                        No services found.
                    </span>
                </div>
            )}
        </div>
    );
}

import { Navigate, Outlet, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { orpcQueryClient } from "@/orpc/orpc";
import { Spinner } from "@heroui/react";

export function ProtectedRoute() {
    const navigate = useNavigate();

    const { isPending, data, error } = useQuery(
        orpcQueryClient.session.getSession.queryOptions({
            queryKey: ["get_session"],
            refetchOnWindowFocus: false,
        }),
    );

    useEffect(() => {
        if (!error) return;
        navigate("/sign-in");
    }, [error]);

    if (isPending)
        return (
            <div className="h-full w-full flex flex-col justify-center rounded-lg shadow-md border text-muted-foreground bg-background p-6 items-center space-y-4">
                <Spinner size="md" />
                <span className="text-muted-foreground">
                    Fetching session...
                </span>
            </div>
        );

    return error || !data.token ? <Navigate to="/sign-in" /> : <Outlet />;
}

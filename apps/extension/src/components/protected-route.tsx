import { authClient } from "@/lib/auth-client";
import { Navigate, Outlet } from "react-router";

export function ProtectedRoute() {
    const { error, data } = authClient.useSession();
    return error || !data?.session ? <Navigate to="/sign-in" /> : <Outlet />;
}

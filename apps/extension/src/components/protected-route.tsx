import { Navigate, Outlet } from "react-router";

export function ProtectedRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null,
    );

    useEffect(() => {
        async function isUserAuthenticated() {
            const token = await storage.getItem("session:token");
            setIsAuthenticated(!!token);
        }

        isUserAuthenticated();
    }, []);

    if (isAuthenticated === null) return;

    return !isAuthenticated ? <Navigate to="/sign-in" /> : <Outlet />;
}

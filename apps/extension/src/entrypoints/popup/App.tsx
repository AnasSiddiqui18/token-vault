import { Route, Routes } from "react-router";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import { Dashboard } from "@/pages/dashboard";

import "@repo/ui/globals.css";
import { Toaster } from "sonner";
import { ProtectedRoute } from "@/components/protected-route";

export default function App() {
    return (
        <div
            className={`h-[600px] w-[380px] overflow-hidden bg-gray-50 p-4 dark`}
        >
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
            </Routes>
            <Toaster richColors />
        </div>
    );
}

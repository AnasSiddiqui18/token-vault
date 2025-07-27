import { Route, Routes } from "react-router";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import "@repo/ui/globals.css";

export default function App() {
  return (
    <div className="h-[600px] w-[380px] overflow-hidden bg-gray-50 p-4 dark">
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<SignUp />} />
      </Routes>
    </div>
  );
}

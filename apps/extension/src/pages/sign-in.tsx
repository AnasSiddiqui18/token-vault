import "@repo/ui/globals.css";
import { Button } from "@repo/ui/components/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { signin_schema } from "@/schema/schema";
import { authClient } from "@/lib/auth-client";

export default function SignIn() {
    const navigate = useNavigate();
    const { data } = authClient.useSession();

    const loginSchema = signin_schema;

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const {
        isPending: isUserLoggingIn,
        mutate,
        error,
    } = useMutation({
        mutationKey: ["login_user"],
        mutationFn: async (e: (typeof loginSchema)["_input"]) => {
            const response = await authClient.signIn.email({
                email: e.email,
                password: e.password,
            });

            if (response.error) throw new Error(response.error.message);

            return response.data;
        },

        onSuccess: async (res) => {
            if (!res) return;
            navigate("/dashboard");
        },
    });

    return (
        <div className="h-full w-full flex flex-col justify-center rounded-lg shadow-md border text-muted-foreground bg-background p-6">
            <Form {...form}>
                <form
                    className="w-full h-full flex flex-col justify-between gap-6"
                    onSubmit={form.handleSubmit((val) => mutate(val))}
                >
                    <div className="text-center">
                        <h2 className="font-semibold text-2xl">Sign In</h2>
                    </div>

                    <div className="flex flex-col gap-4">
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-sm font-medium">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="johndoe@gmail.com"
                                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 w-full"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-sm font-medium">
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 w-full"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-4 mt-4">
                        <Button
                            type="submit"
                            disabled={isUserLoggingIn}
                            loading={isUserLoggingIn}
                            className={`w-full bg-primary hover:bg-primary/90 transition-all duration-200 ${
                                false && "pointer-events-none opacity-40"
                            }`}
                        >
                            Sign In
                        </Button>

                        {error && (
                            <div className="bg-red-500/10 text-red-600 text-sm rounded-md px-4 py-2 mt-2 text-center">
                                {error.message}
                            </div>
                        )}

                        <div className="flex items-center gap-2 justify-center">
                            <div className="h-[1px] bg-gray-200 w-24" />
                            <span className="text-sm text-muted-foreground">
                                or
                            </span>
                            <div className="h-[1px] bg-gray-200 w-24" />
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <span
                                className="text-blue-500 hover:underline cursor-pointer"
                                onClick={() => navigate("/sign-up")}
                            >
                                Sign Up
                            </span>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}

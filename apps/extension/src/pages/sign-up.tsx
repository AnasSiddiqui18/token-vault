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
import { signup_schema } from "@/schema/schema";
import { authClient } from "@/lib/auth-client";

export default function SignUp() {
    const navigate = useNavigate();
    const { signUp } = authClient;

    const form = useForm({
        resolver: zodResolver(signup_schema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const {
        isPending: isCreatingUser,
        mutate,
        error,
    } = useMutation({
        mutationKey: ["create_user"],
        mutationFn: async (values: (typeof signup_schema)["_input"]) => {
            const response = await signUp.email({
                ...values,
            });

            if (response.error) throw new Error(response.error.message);
        },

        onSuccess: () => {
            navigate("/sign-in");
        },
    });

    return (
        <div className="h-full w-full flex flex-col justify-center rounded-lg shadow-md text-muted-foreground bg-background p-6">
            <Form {...form}>
                <form
                    className="w-full h-full flex flex-col justify-between gap-6"
                    onSubmit={form.handleSubmit((e) => mutate(e))}
                >
                    <div className="text-center">
                        <h2 className="font-semibold text-2xl">Sign Up</h2>
                    </div>

                    <div className="flex flex-col gap-4">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-sm font-medium">
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="John Doe"
                                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 w-full"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                            className="w-full bg-primary hover:bg-primary/90 transition-all duration-200"
                            disabled={isCreatingUser}
                            loading={isCreatingUser}
                        >
                            Sign Up
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
                            Already have an account?{" "}
                            <span
                                className="text-blue-500 hover:underline cursor-pointer"
                                onClick={() => navigate("/sign-in")}
                            >
                                Sign In
                            </span>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}

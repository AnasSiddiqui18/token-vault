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
import { signin_schema } from "@/schema/schema";
import { useNavigate } from "react-router";
import { Coins } from "lucide-react";

export default function SignIn() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(signin_schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function createUser() {}

  return (
    <div className="h-full w-full flex flex-col justify-center rounded-lg shadow-md border text-muted-foreground bg-background p-6">
      <Form {...form}>
        <form
          className="w-full h-full flex flex-col justify-between gap-6"
          onSubmit={form.handleSubmit(createUser)}
        >
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-bold text-foreground flex gap-2 justify-center items-center">
              <Coins className="size-8 text-orange-300" />
              TokenVault
            </h1>
            <p className="text-sm text-muted-foreground">
              Your trusted 2FA token manager.
            </p>
          </div>

          <div className="text-center">
            <h2 className="font-semibold text-2xl">Sign In</h2>
          </div>

          <div className="flex flex-col gap-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-medium">Email</FormLabel>
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
              className={`w-full bg-primary hover:bg-primary/90 transition-all duration-200 ${
                false && "pointer-events-none opacity-40"
              }`}
            >
              Sign In
            </Button>

            <div className="flex items-center gap-2 justify-center">
              <div className="h-[1px] bg-gray-200 w-24" />
              <span className="text-sm text-muted-foreground">or</span>
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

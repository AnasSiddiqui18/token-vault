import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type TanstackWrapperProps = {
    children: React.ReactNode;
};

export function TanstackWrapper({ children }: TanstackWrapperProps) {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

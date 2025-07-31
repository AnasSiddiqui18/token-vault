import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { contract } from "@repo/server/contracts";
import type { JsonifiedClient } from "@orpc/openapi-client";
import type { ContractRouterClient } from "@orpc/contract";
import { createORPCClient } from "@orpc/client";
import { createORPCReactQueryUtils } from "@orpc/react-query";

const link = new OpenAPILink(contract, {
    url: "http://localhost:3001/api",
    fetch: (request, init) => {
        return globalThis.fetch(request, {
            ...init,
            credentials: "include",
        });
    },
});

export const orpcClient: JsonifiedClient<
    ContractRouterClient<typeof contract>
> = createORPCClient(link);

export const orpcQueryClient = createORPCReactQueryUtils(orpcClient);

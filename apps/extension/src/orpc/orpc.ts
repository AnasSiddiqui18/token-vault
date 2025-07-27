import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { userContract as contract } from "@repo/server/contract/users.contract";
import type { JsonifiedClient } from "@orpc/openapi-client";
import type { ContractRouterClient } from "@orpc/contract";
import { createORPCClient } from "@orpc/client";

const link = new OpenAPILink(contract, {
  url: "http://localhost:3001/api",
});

export const orpcClient: JsonifiedClient<
  ContractRouterClient<typeof contract>
> = createORPCClient(link);

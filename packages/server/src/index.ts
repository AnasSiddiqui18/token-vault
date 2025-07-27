import { router } from "./router";
import { OpenAPIHandler } from "@orpc/openapi/node";
import { createServer } from "http";
import { CORSPlugin } from "@orpc/server/plugins";

const PORT = 3001;

const handler = new OpenAPIHandler(router, {
  plugins: [
    new CORSPlugin({
      origin: (origin, options) => origin,
      allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    }),
  ],
});

const server = createServer(async (req, res) => {
  const { matched } = await handler.handle(req, res, {
    prefix: "/api",
  });

  if (!matched) res.end("No procedure matched");
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

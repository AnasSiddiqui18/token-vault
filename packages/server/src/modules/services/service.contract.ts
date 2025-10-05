import z from "zod";
import { oc } from "@orpc/contract";

const serviceInputSchema = z.object({
    label: z.string(),
    secret: z.string(),
});

const serviceOutputSchema = z.array(
    z.object({
        label: z.string(),
        token: z.string(),
        id: z.string(),
    }),
);

export const createService = oc
    .input(serviceInputSchema)
    .route({
        path: "/service/create-service",
        method: "POST",
    })
    .output(z.object({ message: z.string() }));

export const listServices = oc
    .route({
        path: "/service/list-services",
        method: "GET",
    })
    .output(serviceOutputSchema);

export const serviceContract = oc.router({
    create: createService,
    list: listServices,
});

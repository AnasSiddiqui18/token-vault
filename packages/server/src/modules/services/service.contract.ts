import z from "zod";
import { oc } from "@orpc/contract";

const serviceInputSchema = z.object({
    label: z.string(),
    secret: z.string(),
});

export const createService = oc.input(serviceInputSchema).route({
    path: "/service/create-service",
    method: "POST",
});

export const listServices = oc.route({
    path: "/service/list-service",
    method: "POST",
});

export const serviceContract = oc.router({
    create: createService,
    list: listServices,
});

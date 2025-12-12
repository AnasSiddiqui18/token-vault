import { axios } from "@/axios/axios";
import { onMessage, sendMessage } from "@/messaging";
import z from "zod";

const serviceSchema = z.array(
    z.object({ label: z.string(), token: z.string(), id: z.string() }),
);

async function fetchServices() {
    try {
        const services = await axios.get("/service/list-services");
        const validatedData = serviceSchema.safeParse(services.data);
        if (!validatedData.data) throw new Error("Invalid data");
        return validatedData.data;
    } catch (error) {
        console.log("Service fetch failed", error);
        throw new Error("Failed to fetch current service");
    }
}

export default defineBackground(() => {
    onMessage("get_service_token", async ({ data, sender }) => {
        const services = await fetchServices();
        const url = new URL(data.domain).hostname;
        const serviceRes = services.find((service) =>
            url.includes(service.label.toLowerCase()),
        );

        if (!serviceRes) {
            console.error("Failed to fetch service", url);
            return;
        }

        console.log("service found successfully 🎉", serviceRes);

        sendMessage("service_token_response", serviceRes, {
            tabId: (sender.tab as any).id,
        });
    });
});

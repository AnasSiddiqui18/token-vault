import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
    get_service_token: { domain: string };
    service_token_response: { label: string; token: string; id: string };
}

export const { sendMessage, onMessage } =
    defineExtensionMessaging<ProtocolMap>();

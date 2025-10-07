import { onMessage, sendMessage } from "../messaging";

let targetEl: HTMLInputElement | null = null;

function isOTPField(input: HTMLInputElement) {
    const hint = (
        input.name +
        input.id +
        input.placeholder +
        input.getAttribute("aria-label")
    ).toLowerCase();
    
    return (
        hint.includes("otp") ||
        hint.includes("mfa") ||
        hint.includes("twofactor")
    );
}

export default defineContentScript({
    matches: ["<all_urls>"],
    main() {
        console.log("Content scripsdt runs");

        const observer = new MutationObserver(() => {
            // prettier-ignore

            const target = document.querySelectorAll('input')

            if (target.length) {
                target.forEach((input) => {
                    const isMfaInput = isOTPField(input);
                    if (isMfaInput) {
                        console.log("target found", input);
                        const url = window.location.href.split("?").at(0);
                        if (!url) return console.error("Url not found");
                        sendMessage("get_service_token", { domain: url });
                        targetEl = input;
                        observer.disconnect();
                        return;
                    }
                });
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        onMessage("service_token_response", ({ data }) => {
            const { token } = data;
            if (!targetEl) return console.error("Target element not found");
            targetEl.value = token;
            targetEl.dispatchEvent(new Event("input", { bubbles: true }));
            targetEl.dispatchEvent(new Event("change", { bubbles: true }));
        });
    },
});

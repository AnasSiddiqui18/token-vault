import { onMessage, sendMessage } from "../messaging";

let targetEl: HTMLInputElement | null = null;

export default defineContentScript({
    matches: ["https://*.signin.aws.amazon.com/*"],
    main() {
        console.log("Content script runs");

        const observer = new MutationObserver((mutationList) => {
            for (const mutation of mutationList) {
                if (mutation.type === "childList") {
                    const addedNodes = mutation.addedNodes;

                    const possibleSelectors = [
                        'input[name="mfaCode"]',
                        'input[name="totp"]',
                        'input[name="one-time-code"]',
                    ];

                    addedNodes.forEach((node) => {
                        if (node instanceof HTMLElement) {
                            if (
                                node instanceof HTMLInputElement &&
                                possibleSelectors.includes(
                                    `input[name=${node.name}]`,
                                )
                            ) {
                                console.log("input found", node);
                                observer.disconnect();
                            } else {
                                for (const selector of possibleSelectors) {
                                    const target = node.querySelector(
                                        selector,
                                    ) as HTMLInputElement;
                                    if (target) {
                                        const url = window.location.href
                                            .split("?")
                                            .at(0);
                                        if (!url)
                                            return console.error(
                                                "Url not found",
                                            );

                                        sendMessage("get_service_token", {
                                            domain: url,
                                        });

                                        targetEl = target;
                                        observer.disconnect();
                                        return;
                                    }

                                    return null;
                                }
                            }
                        }
                    });
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        onMessage("service_token_response", ({ data }) => {
            const { token } = data;
            if (!targetEl) return console.error("Target element not found");
            targetEl.value = token;
        });
    },
});

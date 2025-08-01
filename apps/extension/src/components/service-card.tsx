import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Check, ClipboardList } from "lucide-react";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

type ServiceCardProps = {
    data: { label: string; token: string };
    refetch: (options?: RefetchOptions) => Promise<
        QueryObserverResult<
            {
                label: string;
                token: string;
                id: string;
            }[],
            Error
        >
    >;
};

export function ServiceCard({ data, refetch }: ServiceCardProps) {
    const [copied, setCopied] = useState(false);
    const { label, token } = data;

    useEffect(() => {
        if (!copied) return;

        setTimeout(() => {
            setCopied(false);
        }, 3000);
    }, [copied]);

    return (
        <div className="relative flex flex-col space-y-1 bg-muted/20 p-3 rounded-md">
            <Label className="text-sm font-medium text-muted-foreground flex justify-between pr-8">
                {label}
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                        window.navigator.clipboard.writeText(token);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    }}
                >
                    {!copied ? (
                        <ClipboardList className="size-4" />
                    ) : (
                        <Check className="size-4 text-primary" />
                    )}
                </Button>
            </Label>

            <Input readOnly value={token} />
        </div>
    );
}

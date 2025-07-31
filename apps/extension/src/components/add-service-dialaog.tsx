import { Button } from "@repo/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Plus, QrCode } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@repo/ui/components/form";
import { orpcClient } from "@/orpc/orpc";
import { useDropzone } from "react-dropzone";
import { BrowserQRCodeReader } from "@zxing/browser";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";

function sliceFileName(file_name: string) {
    return file_name.replace(/^(.{8})[^.]*\.(.*)$/, "$1.$2");
}

async function extractSecretFromImage(qr_photo: File) {
    const img = new Image();
    img.src = URL.createObjectURL(qr_photo);
    const codeReader = new BrowserQRCodeReader();
    const resultImage = await codeReader.decodeFromImageElement(img);
    const text = resultImage.getText();
    const match = text.match(/secret=([^&]+)/);
    const secret = match ? match[1] : null;
    return secret;
}

export function AddServiceDialog() {
    const [qrFileName, setQrFileName] = useState("");
    const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);

    const schema = z.object({
        label: z.string().min(3, {
            message: "Atleast enter 3 characters.",
        }),
        qr_photo: z.instanceof(File, {
            message: "Qr photo is required",
        }),
    });

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            label: "",
            qr_photo: null as unknown as File,
        },
    });

    const { getRootProps, getInputProps, open } = useDropzone({
        noClick: true,
        async onDrop(acceptedFiles) {
            const qr_image = acceptedFiles[0];
            setQrFileName(sliceFileName(qr_image.name));
            form.setValue("qr_photo", qr_image, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
            });
        },
    });

    const { getSession } = authClient;

    const {
        error,
        isPending: isCreatingService,
        mutate,
    } = useMutation({
        mutationKey: ["add_service"],
        mutationFn: async (values: (typeof schema)["_input"]) => {
            const { data, error } = await getSession();

            console.log("function calls");

            if (error || !data) {
                toast.error("Session not found");
                return;
            }

            if (!("user" in data)) {
                toast.error("User info not found");
                return;
            }

            const secret = await extractSecretFromImage(values.qr_photo);

            if (!secret) {
                toast.error("Failed to fetch secret");
                return;
            }

            const response = await orpcClient.service.create({
                label: values.label,
                secret: secret,
            });

            return response;
        },

        onSuccess: () => {
            setIsServiceDialogOpen(false);
            form.reset();
        },
    });

    useEffect(() => {
        if (
            !isServiceDialogOpen &&
            (form.getFieldState("label").isDirty ||
                form.getFieldState("qr_photo").isDirty)
        ) {
            setQrFileName("");
            form.reset();
        }
    }, [isServiceDialogOpen]);

    return (
        <div className="flex items-center justify-center">
            <Dialog
                {...getRootProps}
                open={isServiceDialogOpen}
                onOpenChange={(e) => setIsServiceDialogOpen(e)}
            >
                <DialogTrigger asChild>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsServiceDialogOpen(true)}
                    >
                        Add Service
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                        <DialogDescription>
                            Add a new authentication service by providing a
                            label and uploading a QR code.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit((e) => mutate(e))}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <FormField
                                    name="label"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-sm font-medium">
                                                Service Label
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="ie: github, aws"
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 w-full"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Enter a descriptive name for this service
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <FormField
                                        name="qr_photo"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="w-full flex flex-col">
                                                <FormLabel className="text-sm font-medium">
                                                    QR Image
                                                </FormLabel>
                                                <FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={open}
                                                        className="gap-2"
                                                    >
                                                        <QrCode className="size-4" />
                                                        {!!qrFileName.length
                                                            ? qrFileName
                                                            : "Upload QR"}
                                                    </Button>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Upload the QR code image for this service
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="gap-2"
                                disabled={isCreatingService}
                                loading={isCreatingService}
                            >
                                <Plus className="size-4" />
                                Add Service
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
                <Input {...getInputProps()} />
            </Dialog>
        </div>
    );
}

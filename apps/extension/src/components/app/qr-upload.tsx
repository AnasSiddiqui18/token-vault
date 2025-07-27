import { useDropzone } from 'react-dropzone';
import { Button } from '@repo/ui/components/button';
// import { Input } from '@/components/ui/input';
import { BrowserQRCodeReader } from '@zxing/browser';

export function QrUpload() {
    const { getInputProps, getRootProps, open } = useDropzone({
        noClick: true,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg'],
            'image/jpg': ['.jpg'],
            'image/svg': ['.svg'],
        },

        onDrop: async (acceptedFiles) => {
            const qr_code_file = acceptedFiles[0];
            const img = new Image();
            img.src = URL.createObjectURL(qr_code_file);
            const codeReader = new BrowserQRCodeReader();
            const resultImage = await codeReader.decodeFromImageElement(img);
            const text = resultImage.getText();
            const match = text.match(/secret=([^&]+)/);
            const secret = match ? match[1] : null;
            console.log('secret', secret);

            //  IFXWKK32JCVMDLDG

            //  ('otpauth://totp/GitHub:AnasSiddiqui18?secret=IFXWKK32JCVMDLDG&issuer=GitHub');

            console.log('resultImage', resultImage);
        },
    });

    return (
        <div {...getRootProps()}>
            <Button variant="secondary" onClick={open} className="w-full">
                Upload QR
            </Button>
            {/* <Input {...getInputProps()} /> */}
        </div>
    );
}

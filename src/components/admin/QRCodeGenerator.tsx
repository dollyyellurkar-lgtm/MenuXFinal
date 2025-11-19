import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";

const QRCodeGenerator = () => {
  const menuUrl = window.location.origin + "/menu";

  const downloadQR = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = "menu-qr-code.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Menu QR Code</CardTitle>
          <CardDescription>
            Customers can scan this QR code to view your menu on their phones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-8 rounded-lg">
              <QRCodeSVG
                id="qr-code"
                value={menuUrl}
                size={300}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {menuUrl}
            </p>
            <Button onClick={downloadQR} className="gap-2">
              <Download className="w-4 h-4" />
              Download QR Code
            </Button>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">How to use:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Download the QR code image</li>
              <li>Print it and place it on tables or walls in your bar</li>
              <li>Customers can scan it with their phone camera to view the menu</li>
              <li>The menu updates automatically when you make changes in the admin panel</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;

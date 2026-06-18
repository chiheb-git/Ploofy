import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetQrCode, getGetQrCodeQueryKey, useGenerateQrCode } from "@workspace/api-client-react";
import { toast } from "sonner";
import { Download, Printer, RefreshCw, QrCode as QrIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export default function QrPage() {
  const queryClient = useQueryClient();
  const { data: qrCode, isLoading } = useGetQrCode();
  const generateQrCode = useGenerateQrCode();
  const [tableCount, setTableCount] = useState(1);

  const handleGenerate = () => {
    generateQrCode.mutate({}, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetQrCodeQueryKey() });
        toast.success("QR Code régénéré avec succès");
      },
      onError: () => toast.error("Erreur lors de la génération")
    });
  };

  const handleDownload = () => {
    if (!qrCode?.pngBase64) return;
    const link = document.createElement("a");
    link.href = qrCode.pngBase64.startsWith("data:") ? qrCode.pngBase64 : `data:image/png;base64,${qrCode.pngBase64}`;
    link.download = `menu-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const count = Math.max(1, Math.min(50, tableCount));
    const base64 = qrCode?.pngBase64?.startsWith("data:") ? qrCode.pngBase64 : `data:image/png;base64,${qrCode?.pngBase64}`;
    const win = window.open("", "_blank");
    if (!win) return;
    const items = Array.from({ length: count }, (_, i) => `
      <div class="qr-item">
        <img src="${base64}" alt="QR Table ${i + 1}" />
        <div class="table-label">Table #${i + 1}</div>
        <div class="restaurant-name">SOLARIOS</div>
        <div class="scan-text">Scannez pour accéder au menu</div>
      </div>
    `).join("");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>QR Codes - SOLARIOS</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Georgia', serif; background: #fff; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 32px; }
          .qr-item {
            display: flex; flex-direction: column; align-items: center;
            border: 2px solid #C9A84C; border-radius: 16px;
            padding: 20px 16px; background: #fff;
            page-break-inside: avoid;
          }
          .qr-item img { width: 160px; height: 160px; margin-bottom: 12px; }
          .table-label { font-size: 22px; font-weight: bold; color: #1A1A1A; margin-bottom: 4px; }
          .restaurant-name { font-size: 13px; color: #C9A84C; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
          .scan-text { font-size: 11px; color: #888; text-align: center; }
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .grid { gap: 16px; padding: 16px; }
          }
        </style>
      </head>
      <body>
        <div class="grid">${items}</div>
        <script>window.onload = () => { window.print(); }</script>
      </body>
      </html>
    `);
    win.document.close();
  };

  const base64Src = qrCode?.pngBase64?.startsWith("data:") ? qrCode.pngBase64 : `data:image/png;base64,${qrCode?.pngBase64}`;

  return (
    <div className="py-8 space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">QR Code</h1>
        <p className="text-muted-foreground mt-1">Gérez et imprimez les QR codes pour vos tables.</p>
      </div>

      <Card className="border-2">
        <CardHeader className="text-center pb-2 bg-muted/30 border-b">
          <CardTitle className="text-2xl">Menu Digital</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Ce QR code est identique pour toutes les tables.</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8 gap-4">
          {isLoading ? (
            <Skeleton className="w-[300px] h-[300px] rounded-xl" />
          ) : qrCode?.pngBase64 ? (
            <>
              <div className="p-4 bg-white rounded-2xl shadow border">
                <img src={base64Src} alt="QR Code" className="w-[280px] h-[280px]" />
              </div>
              <p className="text-sm text-muted-foreground">{qrCode.targetUrl}</p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
              <QrIcon className="w-16 h-16 opacity-30" />
              <p>Aucun QR généré — cliquez sur Régénérer</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-primary" />
            Impression multiple par tables
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Nombre de tables à imprimer</label>
              <Input
                type="number"
                min={1}
                max={50}
                value={tableCount}
                onChange={(e) => setTableCount(parseInt(e.target.value) || 1)}
                className="text-lg text-center font-bold h-12"
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Chaque QR code sera numéroté : Table #1, Table #2... jusqu'à Table #{tableCount}
          </p>
          <Button
            onClick={handlePrint}
            disabled={!qrCode?.pngBase64}
            className="w-full h-12 text-base"
          >
            <Printer className="w-5 h-5 mr-2" />
            Imprimer {tableCount} QR code{tableCount > 1 ? "s" : ""} (3 par ligne)
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={handleGenerate} className="flex-1">
          <RefreshCw className="w-4 h-4 mr-2" />
          Régénérer le QR
        </Button>
        <Button variant="outline" onClick={handleDownload} disabled={!qrCode?.pngBase64} className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Télécharger PNG
        </Button>
      </div>
    </div>
  );
}
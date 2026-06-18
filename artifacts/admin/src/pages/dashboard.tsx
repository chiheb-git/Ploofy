import { useGetStats, useGetQrCode } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed, List, Box, QrCode, Plus } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading: isLoadingStats } = useGetStats();
  const { data: qrCode, isLoading: isLoadingQr } = useGetQrCode();

  return (
    <div className="py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Aperçu de votre plateforme de menu QR.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dishes">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un plat
            </Button>
          </Link>
          <Link href="/qr">
            <Button variant="outline">
              <QrCode className="mr-2 h-4 w-4" /> Manager QR
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des plats</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{stats?.totalDishes || 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catégories</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{stats?.totalCategories || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modèles 3D</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{stats?.modelsCount || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Menu QR Actif</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            {isLoadingQr ? (
              <Skeleton className="h-48 w-48 rounded-lg" />
            ) : qrCode?.pngBase64 ? (
              <div className="space-y-4 text-center">
                <img 
                  src={qrCode.pngBase64?.startsWith("data:") ? qrCode.pngBase64 : `data:image/png;base64,${qrCode.pngBase64}`} 
                  alt="QR Code" 
                  className="w-48 h-48 border rounded-lg p-2 bg-white mx-auto"
                />
                <p className="text-sm text-muted-foreground truncate max-w-xs">{qrCode.targetUrl}</p>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="h-48 w-48 border-2 border-dashed rounded-lg flex items-center justify-center mx-auto text-muted-foreground">
                  <QrCode className="h-12 w-12 opacity-50" />
                </div>
                <p className="text-sm text-muted-foreground">Aucun QR code généré.</p>
              </div>
            )}
            <div className="mt-6">
              <Link href="/qr">
                <Button variant="outline">Gérer le QR Code</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


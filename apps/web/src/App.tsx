import { useEffect, useState } from "react";
import { statusLabel, type Vehicle } from "@pitlane/core";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const statusVariant = {
  active: "default",
  in_shop: "secondary",
  out_of_service: "destructive",
} as const;

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("http://localhost:3001/vehicles", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(setVehicles)
      .catch((err) => {
        if (err.name !== "AbortError") setError("Revisa que la API esté corriendo e inténtalo de nuevo.");
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="mx-auto grid max-w-5xl gap-6 p-6">
      <h1 className="text-3xl font-semibold tracking-tight">Vehículos</h1>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>No pudimos cargar los vehículos</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!vehicles && !error &&
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)}

        {vehicles?.map((v) => (
          <Card key={v.id}>
            <CardHeader>
              <CardTitle className="font-mono">{v.plate}</CardTitle>
              <CardDescription>
                {v.brand} {v.model} · {v.year}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {v.mileageKm.toLocaleString("es-CO")} km
              </span>
              <Badge variant={statusVariant[v.status]}>{statusLabel[v.status]}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
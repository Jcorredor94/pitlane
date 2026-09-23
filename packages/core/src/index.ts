import { z } from "zod";

export const vehicleStatus = ["active", "in_shop", "out_of_service"] as const;

export const VehicleSchema = z.object({
  id: z.string(),
  plate: z.string().regex(/^[A-Z]{3}\d{3}$/, "Placa inválida (ej. ABC123)"),
  brand: z.string().min(2),
  model: z.string().min(1),
  year: z.number().int().min(1990),
  mileageKm: z.number().nonnegative(),
  status: z.enum(vehicleStatus),
});

export type Vehicle = z.infer<typeof VehicleSchema>;

export const statusLabel: Record<Vehicle["status"], string> = {
  active: "Activo",
  in_shop: "En taller",
  out_of_service: "Fuera de servicio",
};

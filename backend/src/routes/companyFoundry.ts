import { Router } from "express";
import { products, masterPlans, phases, snapshot, validateSnapshot } from "../companyFoundry/companyFoundryRegistry.js";

export const companyFoundryRouter = Router();

companyFoundryRouter.get("/foundry/snapshot", (_req, res) => {
  const errors = validateSnapshot(snapshot);
  if (errors.length > 0) return res.status(500).json({ error: "foundry_registry_invalid", errors });
  return res.json(snapshot);
});

companyFoundryRouter.get("/foundry/products", (_req, res) => {
  return res.json({ products });
});

companyFoundryRouter.get("/foundry/products/:productId", (req, res) => {
  const product = products.find((item) => item.id === req.params.productId);
  if (!product) return res.status(404).json({ error: "product_not_found" });
  return res.json({
    product,
    masterPlans: masterPlans.filter((plan) => plan.productId === product.id),
    phases: phases.filter((phase) => phase.productId === product.id),
  });
});

companyFoundryRouter.get("/foundry/master-plans", (_req, res) => {
  return res.json({ masterPlans });
});

companyFoundryRouter.get("/foundry/phases", (_req, res) => {
  return res.json({ phases });
});

companyFoundryRouter.get("/foundry/validation", (_req, res) => {
  const errors = validateSnapshot(snapshot);
  return res.status(errors.length === 0 ? 200 : 500).json({
    valid: errors.length === 0,
    errors,
    schemaVersion: snapshot.meta.schemaVersion,
    slice: snapshot.meta.slice,
  });
});

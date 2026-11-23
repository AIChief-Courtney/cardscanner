export const DEMO_PLANS = [
  { id: "free", name: "Free", priceMonthly: 0, credits: 25, features: ["Demo queue", "25 tasks/mo", "Community support"] },
  { id: "pro", name: "Pro", priceMonthly: 12, credits: 500, features: ["Priority demo jobs", "API preview", "Email support"] },
  { id: "team", name: "Team", priceMonthly: 39, credits: 2500, features: ["Shared workspace", "Webhooks preview", "SLA draft"] },
];

export const DEMO_INVOICES = [
  { id: "inv_1001", date: "2026-10-01", amount: 12, status: "paid" as const },
  { id: "inv_1002", date: "2026-09-01", amount: 12, status: "paid" as const },
];

export const DEMO_API_KEYS = [{ label: "Dev preview", masked: "fd_live_••••7a3b", canCreate: false }];

export const DEMO_WEBHOOKS = [{ url: "https://example.com/hooks/filedock", status: "demo" as const }];
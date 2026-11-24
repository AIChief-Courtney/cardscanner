# App routes (minimal shell)

| Path | Purpose |
| --- | --- |
| `/` | Landing — sign in / sign up |
| `/signin`, `/signup` | Authentication |
| `/dashboard` | FreeConvert account hub proxy (`account/tasks`) when signed in |
| `/dashboard/*` | FC account subpages (billing, jobs, API keys, …) |
| `/admin`, `/admin/overview`, `/admin/users`, `/admin/activity` | Admin console |
| `/api/auth/*`, `/api/register`, `/api/profile/*` | Auth & profile APIs |
| `/api/admin/*` | Admin APIs |

Legacy `/account/*` and `/profile` redirect to `/dashboard` in middleware.

Removed: FreeConvert proxy, tool registry, and converter/compress/tools marketing pages.
# App routes (minimal shell)

| Path | Purpose |
| --- | --- |
| `/` | Landing — sign in / sign up |
| `/signin`, `/signup` | Authentication |
| `/dashboard` | Signed-in user home (login required) |
| `/admin`, `/admin/overview`, `/admin/users`, `/admin/activity` | Admin console |
| `/api/auth/*`, `/api/register`, `/api/profile/*` | Auth & profile APIs |
| `/api/admin/*` | Admin APIs |

Legacy `/account/*` and `/profile` redirect to `/dashboard` in middleware.

Removed: FreeConvert proxy, tool registry, and converter/compress/tools marketing pages.
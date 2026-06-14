# Diagrams

A collection of Mermaid diagrams that describe the system. Each diagram is also reproduced inline in the relevant docs.

## Index

* [01 — Top-level architecture](#01)
* [02 — Public user page flow](#02)
* [03 — User dashboard flow](#03)
* [04 — Admin dashboard flow](#04)
* [05 — Payment / order flow](#05)
* [06 — Database ER](#06)
* [07 — Edge Function dependencies](#07)

## <a id="01"></a>01 — Top-level architecture

```mermaid
graph LR
    Browser[Browser]
    Vercel[Vercel CDN]
    Supabase[(Supabase)]
    EF[Edge Functions]
    RZ[Razorpay]
    Resend[Resend]
    N8N[n8n webhook]

    Browser -->|SPA bundle| Vercel
    Browser -->|REST + storage + auth| Supabase
    Browser -->|Functions| EF
    EF -->|auth.admin| Supabase
    EF -->|orders| RZ
    RZ -->|webhook| EF
    EF -->|emails| Resend
    Browser -->|chat| N8N
```

## <a id="02"></a>02 — Public user page flow

```mermaid
sequenceDiagram
    actor V as Visitor
    participant PP as PublicUserPage
    participant US as userService
    participant SB as Supabase (public_profiles)
    participant EF as increment-view-count

    V->>PP: GET /<slug>
    PP->>US: getUserProfileByRouteId(slug)
    US->>SB: SELECT *, routes!inner(...)
    SB-->>US: profile
    US-->>PP: profile
    PP->>EF: POST { route_id }
    PP-->>V: render UserView
```

## <a id="03"></a>03 — User dashboard flow

```mermaid
sequenceDiagram
    actor U as User
    participant UD as UserDashboard
    participant US as userService
    participant GUP as get-user-profile (EF)
    participant SB as Supabase (profiles + storage)

    U->>UD: navigate /dashboard
    UD->>GUP: POST (Authorization header)
    GUP-->>UD: { profile, view_count }
    U->>UD: edits a field
    UD->>US: updateUserProfile(slug, data)
    US->>SB: UPDATE profiles SET ... WHERE route_id = slug
    U->>UD: uploads image
    UD->>US: uploadProfileImage(slug, file)
    US->>SB: storage.upload(...)
    US->>SB: UPDATE profiles SET pr_img = ...
    U->>UD: clicks "Open Preview"
    UD->>UD: show modal with UserView(slug, data)
```

## <a id="04"></a>04 — Admin dashboard flow

```mermaid
sequenceDiagram
    actor A as Admin
    participant AD as AdminDashboard
    participant AS as adminService
    participant LU as list-users (EF)
    participant LP as list-payments (EF)
    participant AR as assign-route (EF)
    participant SB as Supabase

    A->>AD: navigate /admin-dashboard
    AD->>LU: GET
    LU-->>AD: { users }
    AD->>LP: GET
    LP-->>AD: { payments }
    A->>AD: clicks "Assign Route" on a user
    AD->>AR: POST { user_id, route_id }
    AR->>SB: INSERT routes
    AR->>SB: INSERT profiles (stub)
    AR-->>AD: { success }
```

## <a id="05"></a>05 — Payment / order flow

See [api/payment-flow.md](../api/payment-flow.md).

## <a id="06"></a>06 — Database ER

See [database/schema.md](../database/schema.md).

## <a id="07"></a>07 — Edge Function dependencies

```mermaid
graph LR
    create-order --> PRICING[(shared pricingConfig)]
    verify-payment --> PRICING
    verify-payment --> EMAILS[emailTemplate]
    verify-payment --> RESEND[Resend]
    list-users --> SBAuth[(auth.users)]
    list-payments --> SBPayments[(payments)]
    delete-user --> SBAuth
    delete-payments --> SBPayments
    assign-route --> SBRoutes[(routes)]
    assign-route --> SBProfiles[(profiles)]
    remove-route --> SBRoutes
    remove-route --> SBProfiles
    renew-expiry --> SBRoutes
    toggle-route-status --> SBRoutes
    razorpay-webhook --> SBPayments
    create-user --> SBAuth
    user-login --> SBAuth
    admin-login --> SBAuth
    get-user-profile --> SBProfiles
    get-user-profile --> SBAnalytics[(analytics)]
    increment-view-count --> SBAnalytics
```

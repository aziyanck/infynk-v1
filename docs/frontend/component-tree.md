# Frontend — Component Tree

The app is a Vite SPA. The router is React Router v7 (Switch + Suspense + lazy in `App.jsx`).

```mermaid
graph TD
    Root[main.jsx] --> BrowserRouter
    BrowserRouter --> App[App.jsx]
    App --> ScrollToTop
    App -->|/| LandingPage
    App -->|/user| UserLogin
    App -->|/admin| AdminLogin
    App -->|/dashboard| UserDashboard
    App -->|/dashboard/*| UserDashboard
    App -->|/getinfo| GetInfo
    App -->|/forgot| ForgotPassword
    App -->|/reset| UpdatePassword
    App -->|/success| SuccessPage
    App -->|/test-payment| TestPaymentPage
    App -->|/admin-dashboard| AdminDashboard
    App -->|/privacy-policy| PrivacyPolicy
    App -->|/terms-of-service| TermsOfService
    App -->|/cookie-policy| CookiePolicy
    App -->|:slug| PublicUserPage
    App -->|*| NotFound

    LandingPage --> Navbar
    LandingPage --> Hero
    LandingPage --> NfcAnimation
    LandingPage --> Services
    LandingPage --> Features
    LandingPage --> About
    LandingPage --> Pricing
    LandingPage --> Footer
    LandingPage --> Chatbot

    UserDashboard --> Header
    UserDashboard --> EditableField x N
    UserDashboard --> ThemeColorPicker
    UserDashboard --> UserView
    UserDashboard --> Notactive
    UserDashboard --> Spinner

    AdminDashboard --> Sidebar
    AdminDashboard -->|activeTab| Dashboard
    AdminDashboard -->|activeTab| Users
    AdminDashboard -->|activeTab| Payments
    AdminDashboard -->|activeTab| Cards
    AdminDashboard --> Spinner

    Users --> UserList
    Users --> UserInfo
    Users --> AssignRoute
    Users --> QrDisplay
```

## Layers

| Layer | Files |
|-------|-------|
| Bootstrap | `main.jsx`, `App.jsx`, `index.css` |
| Pages | `src/pages/*` |
| Sections (landing) | `src/pages/Land/*` |
| Components | `src/components/*` |
| Service layer | `src/services/*` |
| Supabase client | `src/supabaseClient.js` |

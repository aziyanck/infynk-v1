# `src/main.jsx`

**Location**: `src/main.jsx` (11 lines)

## File Purpose

The JavaScript entry point. Bootstraps the React application and mounts it inside the `#root` element of `index.html`, wrapped in a `BrowserRouter` so that `useNavigate`, `useParams` and `<Routes>` work everywhere.

## Imports

| Import | Source | Why |
|--------|--------|-----|
| `React` | `react` | Required because this is JSX (Vite still injects the classic transform). |
| `ReactDOM` | `react-dom/client` | Provides `createRoot` for the React 18+ root API. |
| `App` | `./App.jsx` | The top-level component that defines the route table. |
| `BrowserRouter` | `react-router-dom` | HTML5 history API router. |
| `./index.css` | `src/index.css` | Loads Tailwind (and the brand CSS variables) globally. |

## Exports

None. Side-effect only.

## Internal Logic

```jsx
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

1. Find `#root` in the DOM.
2. Create a React 18 root on it.
3. Render `<App />` inside `<BrowserRouter>` so child components can call `useNavigate`, `useParams`, etc.

## Dependencies

* `src/App.jsx` (immediate child).
* `src/index.css` (loaded as a side-effect of import).
* `react`, `react-dom`, `react-router-dom` (runtime).

## Used By

* `index.html` (via `<script type="module">`).

## Risks

* None significant. The `BrowserRouter` choice is correct for Vercel-style hosting (with `vercel.json` rewriting to `/`).
* If the project were ever embedded inside a subpath (`/pixiic/`) a `HashRouter` or a basename on `BrowserRouter` would be required.

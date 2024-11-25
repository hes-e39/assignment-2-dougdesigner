// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App";
import TimersView from "./views/TimersView";
import DocumentationView from "./views/DocumentationView";
import WorkoutView from "./views/WorkoutView";
import AddTimerView from "./views/AddTimerView";
import { WorkoutProvider } from "./context/WorkoutContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <WorkoutProvider>
        <App />
      </WorkoutProvider>
    ),
    children: [
      {
        index: true,
        element: <WorkoutView />,
      },
      {
        path: "timers",
        element: <TimersView />,
      },
      {
        path: "add",
        element: <AddTimerView />,
      },
      {
        path: "docs",
        element: <DocumentationView />,
      },
    ],
  },
]);

// biome-ignore lint/style/noNonNullAssertion: root html element is there
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
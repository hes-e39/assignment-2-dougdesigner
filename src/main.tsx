import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  NavLink,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import "./index.css";
import TimersView from "./views/TimersView";
import DocumentationView from "./views/DocumentationView";
import WorkoutView from "./views/WorkoutView";
import AddTimerView from "./views/AddTimerView";

import { WorkoutProvider } from "./context/WorkoutContext";

const PageIndex = () => {
  return (
    <div>
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                <span className="h-8 w-auto text-2xl">💪</span>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive
                        ? "rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                        : "rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                  >
                    Workout
                  </NavLink>
                  <NavLink
                    to="/timers"
                    className={({ isActive }) =>
                      isActive
                        ? "rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                        : "rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                  >
                    Timers
                  </NavLink>
                  <NavLink
                    to="/docs"
                    className={({ isActive }) =>
                      isActive
                        ? "rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                        : "rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                  >
                    Documentation
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <WorkoutProvider>
        <PageIndex />
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
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  NavLink,
  Outlet,
  RouterProvider,
  createHashRouter,
} from "react-router-dom";

import "./index.css";
import TimersView from "./views/TimersView";
import DocumentationView from "./views/DocumentationView";

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
            <div className="-mr-2 flex sm:hidden">
              <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>
                <svg className="block size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <svg className="hidden size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                    : "block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                }
              >
                Timers
              </NavLink>
              <NavLink
                to="/docs"
                className={({ isActive }) =>
                  isActive
                    ? "block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                    : "block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                }
              >
                Documentation
              </NavLink>
          </div>
        </div>
      </nav>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
};

const router = createHashRouter([
  {
    path: "/",
    element: <PageIndex />,
    children: [
      {
        index: true,
        element: <TimersView />,
      },
      {
        path: "/docs",
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

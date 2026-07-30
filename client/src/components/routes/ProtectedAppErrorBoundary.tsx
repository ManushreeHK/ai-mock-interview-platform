import { Component, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class RouteErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
          <div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-slate-900">
              This page could not be displayed
            </h1>
            <p className="mt-3 text-slate-600">
              Return to the dashboard and try opening the page again.
            </p>
            <Link
              to="/dashboard"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ProtectedAppErrorBoundary({
  children,
}: ErrorBoundaryProps) {
  const location = useLocation();

  return (
    <RouteErrorBoundary key={location.pathname}>
      {children}
    </RouteErrorBoundary>
  );
}

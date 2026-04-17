import { BrowserRouter, Link, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";
import { BottomNav } from "./components/BottomNav";
import { RepHomePage } from "./pages/RepHomePage";
import { RepModulePage } from "./pages/RepModulePage";
import { AdminPage } from "./pages/AdminPage";

function RepLayout() {
  const { state, isLoading } = useAppContext();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Vacation Sales Club Academy</p>
          <h1>Rep Mobile Command Center</h1>
          <p className="header-copy">
            Strategy, path, coaching, and resources organized for live selling.
          </p>
        </div>

        <div className="header-actions">
          <div className="profile-card">
            <span className="profile-label">Rep</span>
            <strong>{state.dashboard.repName}</strong>
            <span>{state.dashboard.team}</span>
          </div>
          <Link className="ghost-button" to="/admin">
            Admin console
          </Link>
        </div>
      </header>

      <main className="page-main">
        {isLoading ? <div className="loading-card">Loading FastAPI data...</div> : <Outlet />}
      </main>

      <BottomNav />
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="app-shell">
      <header className="app-header admin-header-shell">
        <div>
          <p className="eyebrow">Vacation Sales Club Academy</p>
          <h1>Admin Module Operations</h1>
          <p className="header-copy">
            CRUD for production modules used by reps and administrators.
          </p>
        </div>
      </header>

      <main className="page-main">
        <AdminPage />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/rep" replace />} />

          <Route path="/rep" element={<RepLayout />}>
            <Route index element={<RepHomePage />} />
            <Route
              path="strategy"
              element={<RepModulePage moduleKey="strategy" />}
            />
            <Route
              path="path"
              element={<RepModulePage moduleKey="topProducerPath" />}
            />
            <Route
              path="coaching"
              element={<RepModulePage moduleKey="coaching" />}
            />
            <Route
              path="resources"
              element={<RepModulePage moduleKey="resources" />}
            />
          </Route>

          <Route path="/admin" element={<AdminLayout />} />
          <Route path="*" element={<Navigate to="/rep" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

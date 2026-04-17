import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { AdminModuleManager } from "../components/AdminModuleManager";

export function AdminPage() {
  const {
    state,
    moduleDefinitions,
    actions,
    adminUser,
    isAdminLoading,
    adminError,
    error,
    apiBaseUrl,
  } = useAppContext();
  const [activeModule, setActiveModule] = useState("strategy");
  const [credentials, setCredentials] = useState({
    email: "admin@vcsa.com",
    password: "admin123",
  });

  const overview = useMemo(() => {
    const allItems = Object.values(state.modules).flat();

    return {
      totalItems: allItems.length,
      published: allItems.filter((item) => item.published).length,
      drafts: allItems.filter((item) => item.status === "draft").length,
      downloads: allItems.filter((item) => item.downloadUrl).length,
    };
  }, [state.modules]);

  function handleCredentialChange(event) {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  }

  async function handleLogin(event) {
    event.preventDefault();
    try {
      await actions.loginAdmin(credentials);
    } catch (loginError) {
      // Error is surfaced through adminError in context.
    }
  }

  if (!adminUser) {
    return (
      <div className="page-stack admin-page">
        <section className="hero-block admin-hero">
          <div>
            <p className="eyebrow">Administration</p>
            <h2>Sign in with a FastAPI admin account</h2>
            <p className="section-copy">
              The CRUD console now talks to FastAPI. Use an admin session to create,
              update, and delete modules for Vacation Sales Club Academy.
            </p>
          </div>

          <div className="hero-aside">
            <span className="subtle-badge">API {apiBaseUrl}</span>
          </div>
        </section>

        {error ? <div className="error-banner">{error}</div> : null}
        {adminError ? <div className="error-banner">{adminError}</div> : null}

        <section className="section-card">
          <div className="section-header">
            <div>
              <p className="eyebrow">Admin Login</p>
              <h2>Protected CRUD access</h2>
            </div>
          </div>

          <form className="crud-form" onSubmit={handleLogin}>
            <label>
              <span>Email</span>
              <input
                name="email"
                value={credentials.email}
                onChange={handleCredentialChange}
                placeholder="admin@vcsa.com"
              />
            </label>

            <label>
              <span>Password</span>
              <input
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleCredentialChange}
                placeholder="admin123"
              />
            </label>

            <div className="form-actions full-width">
              <button className="primary-button" type="submit" disabled={isAdminLoading}>
                {isAdminLoading ? "Signing in..." : "Login to admin"}
              </button>
              <Link className="ghost-button" to="/rep">
                Open rep app
              </Link>
            </div>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack admin-page">
      <section className="hero-block admin-hero">
        <div>
          <p className="eyebrow">Administration</p>
          <h2>CRUD console for VCSA production modules</h2>
          <p className="section-copy">
            Publish, update, hide, and remove module items across Strategy, Top
            Producer Path, Coaching, and Resources.
          </p>
        </div>

        <div className="admin-hero-actions">
          <span className="subtle-badge">Signed in as {adminUser.email}</span>
          <button
            className="secondary-button"
            type="button"
            onClick={actions.resetData}
            disabled={isAdminLoading}
          >
            Reset FastAPI seed
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={actions.logoutAdmin}
            disabled={isAdminLoading}
          >
            Logout
          </button>
          <Link className="ghost-button" to="/rep">
            Go to rep app
          </Link>
        </div>
      </section>

      {adminError ? <div className="error-banner">{adminError}</div> : null}

      <section className="metric-grid">
        <article className="metric-card">
          <span className="metric-label">Total items</span>
          <strong>{overview.totalItems}</strong>
          <p>Inventory across all production modules.</p>
        </article>
        <article className="metric-card">
          <span className="metric-label">Published</span>
          <strong>{overview.published}</strong>
          <p>Visible to reps or leadership right now.</p>
        </article>
        <article className="metric-card">
          <span className="metric-label">Drafts</span>
          <strong>{overview.drafts}</strong>
          <p>Items still being prepared for launch.</p>
        </article>
        <article className="metric-card">
          <span className="metric-label">Downloads</span>
          <strong>{overview.downloads}</strong>
          <p>Assets currently attached to the experience.</p>
        </article>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">Module Selection</p>
            <h2>Choose the collection to manage</h2>
          </div>
        </div>

        <div className="module-tab-row">
          {Object.values(moduleDefinitions).map((module) => (
            <button
              key={module.key}
              type="button"
              className={`module-tab ${
                activeModule === module.key ? "is-active" : ""
              }`}
              onClick={() => setActiveModule(module.key)}
            >
              {module.title}
            </button>
          ))}
        </div>
      </section>

      <AdminModuleManager key={activeModule} moduleKey={activeModule} />
    </div>
  );
}

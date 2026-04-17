import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export function RepHomePage() {
  const { state, moduleDefinitions, error, apiBaseUrl } = useAppContext();
  const modules = Object.values(moduleDefinitions);
  const liveCoaching = state.modules.coaching.filter(
    (item) => item.published && (item.audience === "rep" || item.audience === "all")
  );
  const downloadableResources = state.modules.resources.filter(
    (item) =>
      item.published &&
      (item.audience === "rep" || item.audience === "all") &&
      item.downloadUrl
  );

  return (
    <div className="page-stack">
      {error ? (
        <div className="error-banner">
          FastAPI is not responding at {apiBaseUrl}. Start the backend to load live data.
        </div>
      ) : null}

      <section className="hero-block">
        <div>
          <p className="eyebrow">Rep Mobile Experience</p>
          <h2>Built for the floor, the next tour, and the next close.</h2>
          <p className="section-copy">
            Strategy, training, coaching, and resources are organized as one
            command center for Vacation Sales Club Academy reps.
          </p>
        </div>

        <div className="hero-aside">
          <span className="subtle-badge">Team {state.dashboard.team}</span>
          <span className="subtle-badge">{state.dashboard.property}</span>
        </div>
      </section>

      <section className="metric-grid">
        {state.dashboard.metrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <span className="metric-label">{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.note}</p>
          </article>
        ))}
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">Priority Focus</p>
            <h2>Today&apos;s operating rhythm</h2>
          </div>
        </div>
        <div className="workflow-list">
          {state.dashboard.priorities.map((priority) => (
            <div key={priority} className="workflow-step">
              <span className="workflow-index">•</span>
              <p>{priority}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">Modules</p>
            <h2>Rep navigation</h2>
          </div>
        </div>

        <div className="module-summary-grid">
          {modules.map((module) => {
            const visibleCount = state.modules[module.key].filter(
              (item) =>
                item.published &&
                (item.audience === "rep" || item.audience === "all")
            ).length;

            return (
              <article key={module.key} className="module-summary-card">
                <p className="item-type">{module.title}</p>
                <h3>{visibleCount} live items</h3>
                <p>{module.description}</p>
                <Link className="primary-button" to={module.route}>
                  Open {module.shortTitle}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <div className="content-two-column">
        <section className="section-card">
          <div className="section-header">
            <div>
              <p className="eyebrow">Live Coaching</p>
              <h2>Next support sessions</h2>
            </div>
          </div>

          <div className="stack-list">
            {liveCoaching.slice(0, 3).map((item) => (
              <article key={item.id} className="compact-card">
                <p className="item-type">{item.type}</p>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <div className="item-meta">
                  <span>{item.cadence}</span>
                  <span>{item.owner}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-card">
          <div className="section-header">
            <div>
              <p className="eyebrow">Resources</p>
              <h2>Fast downloads</h2>
            </div>
          </div>

          <div className="stack-list">
            {downloadableResources.slice(0, 3).map((item) => (
              <article key={item.id} className="compact-card">
                <p className="item-type">{item.type}</p>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <a className="primary-button" href={item.downloadUrl} download>
                  Download
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

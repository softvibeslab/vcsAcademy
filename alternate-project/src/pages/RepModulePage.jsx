import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { ItemCard } from "../components/ItemCard";

export function RepModulePage({ moduleKey }) {
  const { state, moduleDefinitions, error, apiBaseUrl } = useAppContext();
  const definition = moduleDefinitions[moduleKey];

  const visibleItems = useMemo(
    () =>
      state.modules[moduleKey].filter(
        (item) =>
          item.published && (item.audience === "rep" || item.audience === "all")
      ),
    [moduleKey, state.modules]
  );

  return (
    <div className="page-stack">
      {error ? (
        <div className="error-banner">
          FastAPI is not responding at {apiBaseUrl}. Start the backend to load live module data.
        </div>
      ) : null}

      <section className="hero-block">
        <div>
          <p className="eyebrow">{definition.title}</p>
          <h2>{definition.description}</h2>
          <p className="section-copy">
            Every item shown here is published and ready for the rep experience.
          </p>
        </div>

        <div className="hero-stats">
          {definition.statHighlights.map((item) => (
            <article key={item.label} className="metric-card compact">
              <span className="metric-label">{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">Module Pillars</p>
            <h2>What reps use inside this module</h2>
          </div>
        </div>
        <div className="tag-row">
          {definition.pillars.map((pillar) => (
            <span key={pillar} className="tag">
              {pillar}
            </span>
          ))}
        </div>
      </section>

      <div className="content-two-column">
        <section className="section-card">
          <div className="section-header">
            <div>
              <p className="eyebrow">Published stack</p>
              <h2>{visibleItems.length} live items</h2>
            </div>
          </div>
          <div className="item-grid">
            {visibleItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="section-card">
          <div className="section-header">
            <div>
              <p className="eyebrow">Rep workflow</p>
              <h2>How this module is used on the floor</h2>
            </div>
          </div>
          <div className="workflow-list">
            {definition.repWorkflow.map((step, index) => (
              <div key={step} className="workflow-step">
                <span className="workflow-index">{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";

function buildEmptyDraft(definition) {
  return {
    title: "",
    type: definition.pillars[0] || "",
    summary: "",
    owner: "Program Operations",
    audience: "rep",
    status: "draft",
    cadence: "Weekly",
    format: "Module",
    tags: "",
    downloadUrl: "",
    published: false,
  };
}

function toDraft(item) {
  return {
    ...item,
    tags: item.tags.join(", "),
  };
}

function serializeDraft(draft) {
  return {
    ...draft,
    tags: String(draft.tags || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    published: Boolean(draft.published),
  };
}

export function AdminModuleManager({ moduleKey }) {
  const { state, moduleDefinitions, actions, isAdminLoading, adminError } = useAppContext();
  const definition = moduleDefinitions[moduleKey];
  const items = state.modules[moduleKey];
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(buildEmptyDraft(definition));

  const counts = useMemo(() => {
    const publishedCount = items.filter((item) => item.published).length;
    const draftCount = items.filter((item) => item.status === "draft").length;

    return {
      total: items.length,
      published: publishedCount,
      drafts: draftCount,
    };
  }, [items]);

  function resetForm() {
    setEditingId(null);
    setDraft(buildEmptyDraft(definition));
  }

  function startEdit(item) {
    setEditingId(item.id);
    setDraft(toDraft(item));
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setDraft((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!draft.title.trim() || !draft.summary.trim()) {
      return;
    }

    try {
      if (editingId) {
        await actions.updateItem(moduleKey, editingId, serializeDraft(draft));
      } else {
        await actions.createItem(moduleKey, serializeDraft(draft));
      }

      resetForm();
    } catch (submitError) {
      // Error state is handled by context and rendered above the form.
    }
  }

  return (
    <section className="admin-module-manager">
      <div className="section-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">Module Inventory</p>
            <h2>{definition.title}</h2>
            <p className="section-copy">{definition.adminDescription}</p>
          </div>
          <button className="secondary-button" type="button" onClick={resetForm}>
            New item
          </button>
        </div>

        <div className="admin-counts">
          <div className="metric-card compact">
            <span className="metric-label">Total items</span>
            <strong>{counts.total}</strong>
          </div>
          <div className="metric-card compact">
            <span className="metric-label">Published</span>
            <strong>{counts.published}</strong>
          </div>
          <div className="metric-card compact">
            <span className="metric-label">Drafts</span>
            <strong>{counts.drafts}</strong>
          </div>
        </div>

        <div className="admin-list">
          {items.map((item) => (
            <article key={item.id} className="admin-list-item">
              <div>
                <div className="admin-item-top">
                  <span className={`badge badge-${item.status}`}>{item.status}</span>
                  <span className="subtle-badge">
                    {item.published ? "Published" : "Hidden"}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <div className="item-meta">
                  <span>{item.type}</span>
                  <span>{item.audience}</span>
                  <span>{item.owner}</span>
                </div>
              </div>

              <div className="admin-item-actions">
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => startEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="danger-button"
                  type="button"
                  onClick={() => actions.deleteItem(moduleKey, item.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">CRUD</p>
            <h2>{editingId ? "Edit module item" : "Create module item"}</h2>
          </div>
        </div>

        {adminError ? <div className="error-banner">{adminError}</div> : null}

        <form className="crud-form" onSubmit={handleSubmit}>
          <label>
            <span>Title</span>
            <input
              name="title"
              value={draft.title}
              onChange={handleChange}
              placeholder="Session 5 · Closing Discipline"
            />
          </label>

          <label>
            <span>Type</span>
            <input
              name="type"
              value={draft.type}
              onChange={handleChange}
              placeholder="Session, dashboard, resource, coaching room"
            />
          </label>

          <label className="full-width">
            <span>Summary</span>
            <textarea
              name="summary"
              rows="4"
              value={draft.summary}
              onChange={handleChange}
              placeholder="Write the production-ready description reps or admins need to understand the module."
            />
          </label>

          <label>
            <span>Audience</span>
            <select name="audience" value={draft.audience} onChange={handleChange}>
              <option value="rep">Rep</option>
              <option value="admin">Admin</option>
              <option value="all">Rep + Admin</option>
            </select>
          </label>

          <label>
            <span>Status</span>
            <select name="status" value={draft.status} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="live">Live</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label>
            <span>Owner</span>
            <input
              name="owner"
              value={draft.owner}
              onChange={handleChange}
              placeholder="Head Coach"
            />
          </label>

          <label>
            <span>Cadence</span>
            <input
              name="cadence"
              value={draft.cadence}
              onChange={handleChange}
              placeholder="Wednesday 5 PM"
            />
          </label>

          <label>
            <span>Format</span>
            <input
              name="format"
              value={draft.format}
              onChange={handleChange}
              placeholder="Video + worksheet"
            />
          </label>

          <label>
            <span>Tags</span>
            <input
              name="tags"
              value={draft.tags}
              onChange={handleChange}
              placeholder="session 1, mindset, control"
            />
          </label>

          <label className="full-width">
            <span>Asset / course URL</span>
            <input
              name="downloadUrl"
              value={draft.downloadUrl}
              onChange={handleChange}
              placeholder="/downloads/pre-tour-checklist.txt or https://youtube.com/..."
            />
          </label>

          <label className="checkbox-row full-width">
            <input
              type="checkbox"
              name="published"
              checked={draft.published}
              onChange={handleChange}
            />
            <span>Published and visible in rep/admin experiences</span>
          </label>

          <div className="form-actions full-width">
            <button className="primary-button" type="submit" disabled={isAdminLoading}>
              {editingId ? "Save changes" : "Create item"}
            </button>
            {editingId ? (
              <button
                className="secondary-button"
                type="button"
                onClick={resetForm}
                disabled={isAdminLoading}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}

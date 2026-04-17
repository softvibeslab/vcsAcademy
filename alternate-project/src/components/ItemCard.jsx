const audienceCopy = {
  rep: "Rep",
  admin: "Admin",
  all: "Rep + Admin",
};

function isExternalUrl(url) {
  return /^https?:\/\//i.test(url || "");
}

function getActionLabel(item) {
  if (!item.downloadUrl) {
    return "";
  }

  if (isExternalUrl(item.downloadUrl)) {
    return item.tags.includes("skool") || item.format.toLowerCase().includes("video")
      ? "Open lesson"
      : "Open resource";
  }

  return "Download asset";
}

export function ItemCard({ item }) {
  const externalLink = isExternalUrl(item.downloadUrl);
  const actionLabel = getActionLabel(item);

  return (
    <article className="item-card">
      <div className="item-card-top">
        <span className={`badge badge-${item.status}`}>{item.status}</span>
        <span className="subtle-badge">{audienceCopy[item.audience] || "All"}</span>
      </div>

      <div>
        <p className="item-type">{item.type}</p>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
      </div>

      <div className="item-meta">
        <span>{item.owner}</span>
        <span>{item.cadence}</span>
        <span>{item.format}</span>
      </div>

      <div className="tag-row">
        {item.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="item-actions">
        {item.downloadUrl ? (
          <a
            className="primary-button"
            href={item.downloadUrl}
            {...(externalLink
              ? { target: "_blank", rel: "noreferrer" }
              : { download: true })}
          >
            {actionLabel}
          </a>
        ) : (
          <span className="ghost-pill">Production ready</span>
        )}
      </div>
    </article>
  );
}

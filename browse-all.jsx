/* Browse all templates view (alternate tab) — table layout */
const { useState: useStateB, useMemo: useMemoB } = React;

function BrowseAll({ selectedTemplates, onToggleTemplate }) {
  const { TEMPLATES, FIELDS } = window.IMPROVADO_DATA;
  const [query, setQuery] = useStateB('');

  const filtered = useMemoB(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES.filter(t => {
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.fields.some(fid => {
          const f = FIELDS.find(x => x.id === fid);
          return f && f.label.toLowerCase().includes(q);
        })
      );
    });
  }, [query]);

  return (
    <>
      <div className="browse-toolbar">
        <div className="search" style={{ flex: 1 }}>
          <Icon.Search className="ico" />
          <input
            type="text"
            placeholder="Search templates by name or field…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="tmpl-table-wrap">
        <table className="tmpl-table">
          <thead>
            <tr>
              <th className="c-cb"></th>
              <th className="c-name">Template</th>
              <th className="c-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => {
              const on = selectedTemplates.includes(t.id);
              return (
                <tr key={t.id} className={`tbl-row ${on ? 'sel' : ''}`} onClick={() => onToggleTemplate(t.id)}>
                  <td className="c-cb"><div className="tmpl-cb"><Icon.Check /></div></td>
                  <td className="c-name">
                    <div className="t-row1">
                      <span className="t-title">{t.name}</span>
                      <button className="t-info" onClick={e => e.stopPropagation()} title={t.description}>
                        <Icon.Info />
                      </button>
                      <span className={`label-pill ${t.label.toLowerCase()}`}>{t.label}</span>
                    </div>
                    <div className="t-row2">
                      <a className="t-sublink" onClick={e => e.stopPropagation()}><Icon.Eye /> Data Preview</a>
                      <span className="t-dot">·</span>
                      <a className="t-sublink" onClick={e => e.stopPropagation()}><Icon.Filter /> Pre-filter</a>
                    </div>
                  </td>
                  <td className="c-actions"><a className="t-action" onClick={e => e.stopPropagation()}>Details</a></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!filtered.length && (
          <div className="empty">
            <div className="icon"><Icon.Search /></div>
            <h3>No templates match</h3>
            <p>Try clearing the filter or adjusting the search.</p>
          </div>
        )}
      </div>
    </>
  );
}

window.BrowseAll = BrowseAll;

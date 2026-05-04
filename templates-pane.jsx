/* Right pane — matched templates as a table */
const { useMemo: useMemoT } = React;

function TemplatesPane({ selectedFields, selectedTemplates, onToggleTemplate, mode, showSelectedOnly }) {
  const { TEMPLATES, FIELDS } = window.IMPROVADO_DATA;

  const ranked = useMemoT(() => {
    if (!selectedFields.length) return TEMPLATES.map(t => ({ ...t, coverage: 0, missing: 0, matched: [] }));
    return TEMPLATES.map(t => {
      const matched = selectedFields.filter(fid => t.fields.includes(fid));
      const missing = selectedFields.length - matched.length;
      const coverage = matched.length / selectedFields.length;
      return { ...t, coverage, missing, matched };
    }).sort((a, b) => b.coverage - a.coverage || a.fields.length - b.fields.length);
  }, [selectedFields]);

  const exact = ranked.filter(t => t.coverage === 1 && selectedFields.length > 0);
  const partial = ranked.filter(t => t.coverage > 0 && t.coverage < 1);
  const visible = showSelectedOnly
    ? ranked.filter(t => selectedTemplates.includes(t.id))
    : ranked;

  if (mode === 'browse') return null;

  const matchTone = (t) => {
    if (!selectedFields.length) return null;
    if (t.coverage === 1) return 'exact';
    if (t.coverage > 0) return 'partial';
    return 'none';
  };

  const renderRow = (t) => {
    const on = selectedTemplates.includes(t.id);
    const tone = matchTone(t);
    return (
      <tr
        key={t.id}
        className={`tbl-row ${on ? 'sel' : ''} ${tone === 'none' ? 'dim' : ''}`}
        onClick={() => onToggleTemplate(t.id)}
      >
        <td className="c-cb">
          <div className="tmpl-cb"><Icon.Check /></div>
        </td>
        <td className="c-name">
          <div className="t-row1">
            <span className="t-title">{t.name}</span>
            <button className="t-info" onClick={e => e.stopPropagation()} title={t.description}>
              <Icon.Info />
            </button>
            <span className={`label-pill ${t.label.toLowerCase()}`}>{t.label}</span>
            {tone === 'exact' && <span className="match-pill exact">100% match</span>}
            {tone === 'partial' && (
              <span className="match-pill partial">
                {Math.round(t.coverage * 100)}% match
              </span>
            )}
          </div>
          <div className="t-row2">
            <a className="t-sublink" onClick={e => e.stopPropagation()}>
              <Icon.Eye /> Data Preview
            </a>
            <span className="t-dot">·</span>
            <a className="t-sublink" onClick={e => e.stopPropagation()}>
              <Icon.Filter /> Pre-filter
            </a>
          </div>
        </td>
        <td className="c-actions">
          <a className="t-action" onClick={e => e.stopPropagation()}>Details</a>
        </td>
      </tr>
    );
  };

  return (
    <>
      {selectedFields.length === 0 ? (
        <div className="empty">
          <div className="icon"><Icon.Sparkle /></div>
          <h3>Pick the data you need first</h3>
          <p>
            Select fields on the left — metrics, dimensions or attributes — and we'll
            rank Google Ads templates by how well they cover what you've chosen.
          </p>
          <p style={{ marginTop: 10, fontSize: 12, color: 'var(--text-3)' }}>
            Tip: start with a Popular field like <b>Spend</b> or <b>Conversions</b>.
          </p>
        </div>
      ) : (
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
              {visible.map(renderRow)}
            </tbody>
          </table>
          {!visible.length && (
            <div className="empty">
              <div className="icon"><Icon.Search /></div>
              <h3>{showSelectedOnly ? 'No templates selected' : 'No matching templates'}</h3>
              <p>{showSelectedOnly ? 'Toggle off "Show selected only" to see all templates.' : 'Try removing some fields.'}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

window.TemplatesPane = TemplatesPane;

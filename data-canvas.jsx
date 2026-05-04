/* Visual data-explorer (alternate Step 2) — drag fields onto a board */
const { useState: useStateC, useMemo: useMemoC } = React;

function DataCanvas({ selectedFields, onToggle, onClear, selectedTemplates, onToggleTemplate }) {
  const { FIELDS, GROUPS, TEMPLATES } = window.IMPROVADO_DATA;
  const [query, setQuery] = useStateC('');

  const filtered = useMemoC(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FIELDS;
    return FIELDS.filter(f => f.label.toLowerCase().includes(q) || f.id.toLowerCase().includes(q));
  }, [query]);

  const ranked = useMemoC(() => {
    if (!selectedFields.length) return [];
    return TEMPLATES.map(t => {
      const matched = selectedFields.filter(fid => t.fields.includes(fid));
      return { ...t, matched: matched.length, coverage: matched.length / selectedFields.length };
    }).filter(t => t.coverage > 0)
      .sort((a, b) => b.coverage - a.coverage)
      .slice(0, 6);
  }, [selectedFields]);

  const onDragStart = (e, fid) => {
    e.dataTransfer.setData('text/plain', fid);
  };
  const onDrop = (e) => {
    e.preventDefault();
    const fid = e.dataTransfer.getData('text/plain');
    if (fid && !selectedFields.includes(fid)) onToggle([fid], true);
  };

  return (
    <div className="canvas-wrap">
      <div className="canvas-aside">
        <div className="search" style={{ marginBottom: 14 }}>
          <Icon.Search className="ico" />
          <input
            placeholder="Search fields…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ height: 34 }}
          />
        </div>
        {GROUPS.map(g => {
          const items = filtered.filter(f => f.group === g.id);
          if (!items.length) return null;
          return (
            <div key={g.id} style={{ marginBottom: 14 }}>
              <h4>{g.label}</h4>
              {items.map(f => {
                const placed = selectedFields.includes(f.id);
                return (
                  <div
                    key={f.id}
                    className={`field-draggable ${placed ? 'placed' : ''}`}
                    draggable={!placed}
                    onDragStart={e => onDragStart(e, f.id)}
                    onClick={() => !placed && onToggle([f.id], true)}
                  >
                    <Icon.Drag style={{ width: 12, height: 12, color: 'var(--text-3)' }} />
                    <span style={{ flex: 1 }}>{f.label}</span>
                    <span className={`field-tag ${f.type}`} style={{ fontSize: 10 }}>{f.type}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div
        className="canvas-board"
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
      >
        {!selectedFields.length ? (
          <div className="canvas-empty">
            <div className="glyph">⊕</div>
            <strong style={{ display: 'block', color: 'var(--text)', marginBottom: 4 }}>Drop fields here to find templates</strong>
            <span>Drag any field from the left, or click to add. We'll show templates that contain everything you've placed.</span>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Required fields ({selectedFields.length})
            </div>
            <div className="canvas-pile">
              {selectedFields.map(id => {
                const f = FIELDS.find(x => x.id === id);
                return (
                  <span key={id} className="field-pill match">
                    <Icon.Check className="check" />
                    {f?.label || id}
                    <button onClick={() => onToggle([id], false)}>
                      <Icon.X style={{ width: 11, height: 11 }} />
                    </button>
                  </span>
                );
              })}
              <button className="btn ghost" style={{ padding: '3px 8px', fontSize: 12 }} onClick={onClear}>Clear</button>
            </div>
            <div className="canvas-results-head">
              <span>Templates that contain these fields</span>
              <span style={{ marginLeft: 'auto' }}>{ranked.length} match{ranked.length === 1 ? '' : 'es'}</span>
            </div>
            <div className="canvas-results">
              {ranked.map(t => {
                const on = selectedTemplates.includes(t.id);
                return (
                  <div
                    key={t.id}
                    className="canvas-tmpl"
                    style={{
                      borderColor: on ? 'var(--accent)' : (t.coverage === 1 ? 'var(--accent-soft-2)' : 'var(--border)'),
                      background: on ? 'var(--accent-soft)' : 'var(--surface)',
                      cursor: 'pointer',
                    }}
                    onClick={() => onToggleTemplate(t.id)}
                  >
                    <div>
                      <div className="name">
                        {t.name}
                        {t.coverage === 1 && (
                          <span className="match-pill exact" style={{ marginLeft: 8 }}>Best match</span>
                        )}
                      </div>
                      <div className="cov">
                        {t.matched}/{selectedFields.length} fields covered · {t.level} · {t.fields.length} total fields
                      </div>
                    </div>
                    <div className={`tmpl-cb ${on ? '' : ''}`} style={{
                      background: on ? 'var(--accent)' : 'transparent',
                      borderColor: on ? 'var(--accent)' : 'var(--border-strong)',
                    }}>
                      <Icon.Check style={{ opacity: on ? 1 : 0, width: 12, height: 12, color: 'white' }} />
                    </div>
                  </div>
                );
              })}
              {!ranked.length && (
                <div style={{ color: 'var(--text-3)', fontSize: 13 }}>No templates contain these fields together.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

window.DataCanvas = DataCanvas;

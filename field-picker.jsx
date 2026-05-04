/* FieldPicker — "Find by data" view */
const { useState: useStateF, useMemo: useMemoF } = React;

function FieldPicker({ selectedFields, onToggle, onClear }) {
  const { FIELDS, GROUPS, POPULAR } = window.IMPROVADO_DATA;
  const [query, setQuery] = useStateF('');
  const [collapsed, setCollapsed] = useStateF({});

  const filtered = useMemoF(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FIELDS;
    return FIELDS.filter(f =>
      f.label.toLowerCase().includes(q) ||
      f.id.toLowerCase().includes(q) ||
      f.type.toLowerCase().includes(q)
    );
  }, [query]);

  const byGroup = useMemoF(() => {
    const m = {};
    GROUPS.forEach(g => { m[g.id] = []; });
    filtered.forEach(f => { if (m[f.group]) m[f.group].push(f); });
    Object.keys(m).forEach(k => {
      m[k].sort((a, b) => a.label.localeCompare(b.label));
    });
    return m;
  }, [filtered]);

  const popularFields = POPULAR.map(id => FIELDS.find(f => f.id === id)).filter(Boolean);

  const toggleGroup = (id) => setCollapsed(c => ({ ...c, [id]: !c[id] }));

  const selectAllInGroup = (groupId, on) => {
    const ids = (byGroup[groupId] || []).map(f => f.id);
    onToggle(ids, on);
  };

  return (
    <>
      <div className="search-wrap">
        <div className="search">
          <Icon.Search className="ico" />
          <input
            type="text"
            placeholder="Search metrics, dimensions or fields…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="popular-row">
          <span className="label">Popular:</span>
          {popularFields.map(f => {
            const on = selectedFields.includes(f.id);
            return (
              <button
                key={f.id}
                className={`chip ${on ? 'selected' : ''}`}
                onClick={() => onToggle([f.id], !on)}
              >
                {f.label}
                {on && <Icon.X className="x" style={{ width: 11, height: 11 }} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="field-list">
        {GROUPS.map(g => {
          const items = byGroup[g.id] || [];
          if (!items.length && query) return null;
          const isCollapsed = !!collapsed[g.id];
          const selectedInGroup = items.filter(f => selectedFields.includes(f.id)).length;
          const allSelected = items.length > 0 && selectedInGroup === items.length;
          return (
            <div key={g.id} className={`group ${isCollapsed ? 'collapsed' : ''}`}>
              <div className="group-head">
                <button
                  onClick={() => toggleGroup(g.id)}
                  style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <Icon.Caret className="caret" />
                  <span className="name">{g.label}</span>
                </button>
                <span className="count">
                  {selectedInGroup > 0 && <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{selectedInGroup} / </span>}
                  {items.length} {items.length === 1 ? 'field' : 'fields'}
                </span>
                {items.length > 0 && (
                  <button className="select-all" onClick={() => selectAllInGroup(g.id, !allSelected)}>
                    {allSelected ? 'Clear group' : 'Select all'}
                  </button>
                )}
              </div>
              <div className="group-body">
                {items.map(f => {
                  const on = selectedFields.includes(f.id);
                  return (
                    <div
                      key={f.id}
                      className={`field-row ${on ? 'selected' : ''}`}
                      onClick={() => onToggle([f.id], !on)}
                    >
                      <div className="cb"><Icon.Check /></div>
                      <span className="field-name">{f.label}</span>
                      <span className="field-id mono">{f.id}</span>
                      <span className={`field-tag ${f.type}`}>{f.type}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {!filtered.length && (
          <div className="empty" style={{ minHeight: 200 }}>
            <p>No fields match "{query}"</p>
          </div>
        )}
      </div>

      <SelectedBar
        selectedFields={selectedFields}
        FIELDS={FIELDS}
        onToggle={onToggle}
        onClear={onClear}
      />
    </>
  );
}

function SelectedBar({ selectedFields, FIELDS, onToggle, onClear }) {
  const [expanded, setExpanded] = React.useState(false);
  const pillsRef = React.useRef(null);
  const [overflowing, setOverflowing] = React.useState(false);

  React.useLayoutEffect(() => {
    const el = pillsRef.current;
    if (!el) return;
    const check = () => {
      // detect horizontal overflow when collapsed
      setOverflowing(el.scrollWidth > el.clientWidth + 2);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [selectedFields, expanded]);

  return (
    <div className={`selected-bar ${expanded ? 'expanded' : ''}`}>
      <span className="label">
        Selected{selectedFields.length > 0 && <span className="count">{selectedFields.length}</span>}
      </span>
      <div className="pills" ref={pillsRef}>
        {selectedFields.length === 0 ? (
          <span className="empty-pills">No fields selected — pick what you need above.</span>
        ) : (
          selectedFields.map(id => {
            const f = FIELDS.find(x => x.id === id);
            if (!f) return null;
            return (
              <button key={id} className="chip selected" onClick={() => onToggle([id], false)}>
                {f.label} <Icon.X className="x" style={{ width: 11, height: 11 }} />
              </button>
            );
          })
        )}
      </div>
      {selectedFields.length > 0 && (overflowing || expanded) && (
        <button className="see-all" onClick={() => setExpanded(v => !v)}>
          {expanded ? 'Collapse' : 'See all'}
        </button>
      )}
      {selectedFields.length > 0 && (
        <button className="clear" onClick={onClear}>Clear</button>
      )}
    </div>
  );
}

window.FieldPicker = FieldPicker;

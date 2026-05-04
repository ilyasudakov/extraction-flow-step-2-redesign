/* App root — orchestrates Step 2 + Tweaks */
const { useState: useStateA, useEffect: useEffectA } = React;

function App() {
  const [tweaks, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  const [tab, setTab] = useStateA('find'); // 'find' | 'browse'
  const [selectedFields, setSelectedFields] = useStateA([]);
  const [selectedTemplates, setSelectedTemplates] = useStateA([]);
  const [showSelectedOnly, setShowSelectedOnly] = useStateA(false);

  // Sync tab with mode tweak — canvas mode replaces both tabs
  const usingCanvas = tweaks.mode === 'canvas';

  const toggleFields = (ids, on) => {
    setSelectedFields(prev => {
      if (on) {
        const set = new Set(prev);
        ids.forEach(id => set.add(id));
        return Array.from(set);
      } else {
        return prev.filter(id => !ids.includes(id));
      }
    });
  };
  const clearFields = () => setSelectedFields([]);
  const toggleTemplate = (id) => setSelectedTemplates(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // When in 'find' mode, auto-suggest selecting Best Match templates' coverage stats
  const { TEMPLATES } = window.IMPROVADO_DATA;
  const exactCount = selectedFields.length === 0 ? 0 : TEMPLATES.filter(t => selectedFields.every(f => t.fields.includes(f))).length;

  // Footer stats
  const accountsCount = tweaks.accountCount ?? 12;
  const ordersCount = selectedTemplates.length * accountsCount;

  return (
    <div className="app">
      <TopBar />
      <Stepper current={2} />

      <div className="step-frame" data-screen-label="Step 2 — Select templates">
        {/* LEFT: field/browse picker (or canvas covers both) */}
        {usingCanvas ? (
          <div className="panel" style={{ gridColumn: '1 / -1' }} data-screen-label="02 Visual data canvas">
            <div className="panel-head">
              <div>
                <div className="title">Visual data canvas</div>
                <div className="subtitle">Drag the fields you need onto the board — we'll surface templates that cover them.</div>
              </div>
            </div>
            <DataCanvas
              selectedFields={selectedFields}
              onToggle={toggleFields}
              onClear={clearFields}
              selectedTemplates={selectedTemplates}
              onToggleTemplate={toggleTemplate}
            />
          </div>
        ) : (
          <>
            <div className="panel" data-screen-label="02a Picker">
              <div className="mode-tabs">
                <button
                  className={`mode-tab ${tab === 'find' ? 'active' : ''}`}
                  onClick={() => setTab('find')}
                >
                  <Icon.Sparkle />
                  Find by data
                  <span className="badge">Recommended</span>
                </button>
                <button
                  className={`mode-tab ${tab === 'browse' ? 'active' : ''}`}
                  onClick={() => setTab('browse')}
                >
                  <Icon.Grid />
                  Browse all templates
                </button>
              </div>
              <div className="panel-head" style={{ borderBottom: 'none', paddingBottom: 8 }}>
                <div>
                  <div className="title">
                    {tab === 'find' ? 'Select the data you need' : 'All templates for Google Ads'}
                  </div>
                </div>
              </div>
              {tab === 'find' ? (
                <FieldPicker
                  selectedFields={selectedFields}
                  onToggle={toggleFields}
                  onClear={clearFields}
                />
              ) : (
                <BrowseAll
                  selectedTemplates={selectedTemplates}
                  onToggleTemplate={toggleTemplate}
                />
              )}
            </div>

            {/* RIGHT: templates pane */}
            <div className="panel" data-screen-label="02b Templates">
              <div className="panel-head">
                <div className="title-row">
                  <div className="title">
                    {tab === 'find' ? 'Matching templates' : 'Selected templates'}
                  </div>
                  {tab === 'find' && selectedTemplates.length > 0 && (
                    <span className="title-tag">{selectedTemplates.length} selected</span>
                  )}
                </div>
                {tab === 'find' && selectedTemplates.length > 0 && (
                  <label className="switch-row head-toggle">
                    <span>Show selected only</span>
                    <span className={`switch ${showSelectedOnly ? 'on' : ''}`}>
                      <input
                        type="checkbox"
                        checked={showSelectedOnly}
                        onChange={(e) => setShowSelectedOnly(e.target.checked)}
                      />
                      <span className="thumb" />
                    </span>
                  </label>
                )}
              </div>
              {tab === 'find' ? (
                <TemplatesPane
                  selectedFields={selectedFields}
                  selectedTemplates={selectedTemplates}
                  onToggleTemplate={toggleTemplate}
                  mode="find"
                  showSelectedOnly={showSelectedOnly}
                />
              ) : (
                <SelectedSummary
                  selectedTemplates={selectedTemplates}
                  onToggleTemplate={toggleTemplate}
                />
              )}
            </div>
          </>
        )}
      </div>

      <div className="footer">
        <div className="actions" style={{ marginLeft: 0 }}>
          <button className="btn ghost">Back</button>
        </div>
        <div className="actions">
          <button className="btn primary" disabled={selectedTemplates.length === 0}>
            Continue
            <Icon.ArrowRight />
          </button>
        </div>
      </div>

      <TweaksPanel>
        <TweakSection label="Step 2 mode">
          <TweakRadio
            label="Mode"
            value={tweaks.mode}
            options={[
              { value: 'tabs', label: 'Tabs' },
              { value: 'canvas', label: 'Canvas' },
            ]}
            onChange={(v) => setTweak('mode', v)}
          />
        </TweakSection>
        <TweakSection label="Mock data">
          <TweakNumber
            label="Accounts in connection"
            value={tweaks.accountCount}
            min={1}
            max={200}
            onChange={(v) => setTweak('accountCount', v)}
          />
        </TweakSection>
        <TweakSection label="Quick demo">
          <TweakButton label="Performance preset" onClick={() => { setSelectedFields(['impressions', 'clicks', 'spend', 'date', 'campaign_name']); setSelectedTemplates([]); }} />
          <TweakButton label="Conversion preset" onClick={() => { setSelectedFields(['conversions', 'conversions_value', 'roas', 'campaign_name', 'date']); setSelectedTemplates([]); }} />
          <TweakButton label="Audience preset" onClick={() => { setSelectedFields(['age_range', 'gender', 'device', 'spend', 'conversions']); setSelectedTemplates([]); }} />
          <TweakButton label="Reset selections" secondary onClick={() => { setSelectedFields([]); setSelectedTemplates([]); }} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

function SelectedSummary({ selectedTemplates, onToggleTemplate }) {
  const { TEMPLATES } = window.IMPROVADO_DATA;
  if (!selectedTemplates.length) {
    return (
      <div className="empty">
        <div className="icon"><Icon.Grid /></div>
        <h3>No templates selected yet</h3>
        <p>Pick templates from the list — they'll show up here so you can review your choices before continuing.</p>
      </div>
    );
  }
  const rows = selectedTemplates
    .map(id => TEMPLATES.find(x => x.id === id))
    .filter(Boolean);

  return (
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
          {rows.map(t => (
            <tr key={t.id} className="tbl-row sel" onClick={() => onToggleTemplate(t.id)}>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

window.App = App;

// ─────────────────────────────────────────────────────────────
// Closet — App shell
// ─────────────────────────────────────────────────────────────

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "itemMode": "photo",
  "showOnboarding": false
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [tab, setTab] = React.useState('home');
  const [route, setRoute] = React.useState({ name: 'tab' });
  const [showOnboarding, setShowOnboarding] = React.useState(tweaks.showOnboarding);

  React.useEffect(() => {
    setShowOnboarding(tweaks.showOnboarding);
  }, [tweaks.showOnboarding]);

  // apply dark mode on the iOS frame inner wrapper
  React.useEffect(() => {
    const el = document.getElementById('app-shell');
    if (el) el.classList.toggle('dark', !!tweaks.dark);
  }, [tweaks.dark]);

  const nav = (name, id) => {
    if (name === 'home') { setTab('home'); setRoute({ name: 'tab' }); return; }
    if (name === 'fits') { setTab('fits'); setRoute({ name: 'tab' }); return; }
    if (name === 'editor') { setTab('editor'); setRoute({ name: 'tab' }); return; }
    setRoute({ name, id });
  };

  const onBack = () => setRoute({ name: 'tab' });

  // pick screen
  let screen;
  if (showOnboarding) {
    screen = <OnboardingScreen onDone={() => setShowOnboarding(false)}/>;
  } else if (route.name !== 'tab') {
    const props = { mode: tweaks.itemMode, onBack, onNav: nav };
    if (route.name === 'outfit')    screen = <OutfitDetail   outfitId={route.id} {...props}/>;
    if (route.name === 'item')      screen = <ItemDetail     itemId={route.id} {...props}/>;
    if (route.name === 'calendar')  screen = <CalendarScreen {...props}/>;
    if (route.name === 'stats')     screen = <StatsScreen    {...props}/>;
    if (route.name === 'wardrobe')  screen = <WardrobeScreen {...props}/>;
    if (route.name === 'ai')        screen = <AIScreen       {...props}/>;
  } else {
    if (tab === 'home')   screen = <HomeScreen   mode={tweaks.itemMode} onNav={nav}/>;
    if (tab === 'fits')   screen = <FitsScreen   mode={tweaks.itemMode} onNav={nav}/>;
    if (tab === 'editor') screen = <EditorScreen mode={tweaks.itemMode} onNav={nav}/>;
  }

  // tab bar only on tab routes (not onboarding)
  const showTabs = !showOnboarding;

  return (
    <div style={{ position: 'relative' }}>
      <IOSDevice width={393} height={852} dark={!!tweaks.dark}>
        <div id="app-shell"
          className={tweaks.dark ? 'dark' : ''}
          style={{
            background: 'var(--bg)', color: 'var(--ink)',
            minHeight: '100%', fontFamily: 'var(--sans)',
            position: 'relative',
            paddingTop: 50, // status bar
          }}>
          <div key={route.name + (route.id || '') + tab + showOnboarding}>
            {screen}
          </div>
          {showTabs && <TabBar active={tab} onChange={(id) => { setTab(id); setRoute({ name: 'tab' }); }}/>}
        </div>
      </IOSDevice>

      {/* tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme">
          <TweakRadio
            label="Mode"
            value={tweaks.dark ? 'dark' : 'light'}
            onChange={(v) => setTweak('dark', v === 'dark')}
            options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]}
          />
          <TweakRadio
            label="Items"
            value={tweaks.itemMode}
            onChange={(v) => setTweak('itemMode', v)}
            options={[{ value: 'photo', label: 'Photo' }, { value: 'cutout', label: 'Cutout' }]}
          />
        </TweakSection>
        <TweakSection label="Flow">
          <TweakToggle
            label="Show onboarding"
            value={tweaks.showOnboarding}
            onChange={(v) => setTweak('showOnboarding', v)}
          />
          <TweakButton label="Open AI Stylist" onClick={() => nav('ai')}/>
          <TweakButton label="Open Calendar" onClick={() => nav('calendar')}/>
          <TweakButton label="Open Stats" onClick={() => nav('stats')}/>
          <TweakButton label="Open Wardrobe" onClick={() => nav('wardrobe')}/>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

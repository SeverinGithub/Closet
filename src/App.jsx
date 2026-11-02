import React, { useEffect, useState } from 'react';
import { useCloset } from './store.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import { requestNotificationPermission } from './hooks/useMorningReminder.js';
import TweaksPanel, { TweakSection, TweakRadio, TweakToggle, TweakButton } from './components/TweaksPanel.jsx';
import { TabBar } from './components/ui.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import FitsScreen from './screens/FitsScreen.jsx';
import EditorScreen from './screens/EditorScreen.jsx';
import OutfitDetail from './screens/OutfitDetail.jsx';
import ItemDetail from './screens/ItemDetail.jsx';
import CalendarScreen from './screens/CalendarScreen.jsx';
import StatsScreen from './screens/StatsScreen.jsx';
import WardrobeScreen from './screens/WardrobeScreen.jsx';
import AIScreen from './screens/AIScreen.jsx';
import OnboardingScreen from './screens/OnboardingScreen.jsx';
import OutfitEditorScreen from './screens/OutfitEditorScreen.jsx';
import ItemEditorScreen from './screens/ItemEditorScreen.jsx';
import SettingsScreen from './screens/SettingsScreen.jsx';

export default function App({ userEmail }) {
  const { tweaks, setTweak, loading: dataLoading } = useCloset();
  const { logout } = useAuth();

  const [tab, setTab] = useState('home');
  const [route, setRoute] = useState({ name: 'tab' });
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(tweaks.showOnboarding);

  useEffect(() => {
    setShowOnboarding(tweaks.showOnboarding);
  }, [tweaks.showOnboarding]);

  const nav = (name, id) => {
    if (name === 'home') { setTab('home'); setRoute({ name: 'tab' }); return; }
    if (name === 'fits') { setTab('fits'); setRoute({ name: 'tab' }); return; }
    if (name === 'editor') { setTab('editor'); setRoute({ name: 'tab' }); return; }
    setRoute({ name, id });
  };

  const onBack = () => setRoute({ name: 'tab' });

  useEffect(() => {
    const handler = (e) => {
      if (e.shiftKey && e.key === 'T') setTweaksOpen((o) => !o);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const finishOnboarding = () => {
    setShowOnboarding(false);
    setTweak('showOnboarding', false);
  };

  let screen;
  if (showOnboarding) {
    screen = <OnboardingScreen onDone={finishOnboarding} />;
  } else if (route.name !== 'tab') {
    const props = { mode: tweaks.itemMode, onBack, onNav: nav };
    if (route.name === 'outfit')   screen = <OutfitDetail outfitId={route.id} {...props} />;
    if (route.name === 'item')     screen = <ItemDetail itemId={route.id} {...props} />;
    if (route.name === 'calendar') screen = <CalendarScreen {...props} />;
    if (route.name === 'stats')    screen = <StatsScreen {...props} />;
    if (route.name === 'wardrobe')     screen = <WardrobeScreen {...props} />;
    if (route.name === 'ai')           screen = <AIScreen {...props} />;
    if (route.name === 'outfitEditor') screen = <OutfitEditorScreen {...props} />;
    if (route.name === 'itemEditor')   screen = <ItemEditorScreen itemId={route.id} onBack={onBack} />;
    if (route.name === 'settings')     screen = <SettingsScreen onBack={onBack} userEmail={userEmail} />;
  } else {
    if (tab === 'home')   screen = <HomeScreen mode={tweaks.itemMode} onNav={nav} onSettings={() => nav('settings')} />;
    if (tab === 'fits')   screen = <FitsScreen mode={tweaks.itemMode} onNav={nav} />;
    if (tab === 'editor') screen = <EditorScreen mode={tweaks.itemMode} onNav={nav} />;
  }

  const showTabs = !showOnboarding;

  if (dataLoading) {
    return (
      <div className={tweaks.dark ? 'app-root dark' : 'app-root'} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100dvh', background: 'var(--bg)',
      }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: 'var(--ink-mute)',
        }}>Loading wardrobe…</div>
      </div>
    );
  }

  return (
    <div className={tweaks.dark ? 'app-root dark' : 'app-root'}>
      <div
        style={{
          background: 'var(--bg)', color: 'var(--ink)',
          minHeight: '100dvh', fontFamily: 'var(--sans)',
          position: 'relative',
          paddingTop: 'max(16px, env(safe-area-inset-top))',
        }}
      >
        <div key={route.name + (route.id || '') + tab + showOnboarding}>
          {screen}
        </div>
        {showTabs && (
          <TabBar active={tab} onChange={(id) => { setTab(id); setRoute({ name: 'tab' }); }} />
        )}
      </div>

      <TweaksPanel open={tweaksOpen} onClose={() => setTweaksOpen(false)} title="Tweaks">
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
        <TweakSection label="Reminder">
          <TweakToggle
            label="Morning reminder"
            value={tweaks.reminderEnabled || false}
            onChange={async (v) => {
              if (v) {
                const perm = await requestNotificationPermission();
                if (perm === 'denied') {
                  alert('Notifications blocked. Please enable them in your browser settings.');
                  return;
                }
                if (perm === 'unsupported') {
                  alert('Your browser does not support notifications.');
                  return;
                }
              }
              setTweak('reminderEnabled', v);
            }}
          />
          <div style={{
            fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--serif)',
            fontStyle: 'italic', lineHeight: 1.4, paddingBottom: 4,
          }}>
            {tweaks.reminderEnabled
              ? 'You\'ll get a notification between 6–12am when no outfit is logged.'
              : 'Enable to get a browser notification on mornings without a logged outfit.'}
          </div>
        </TweakSection>
        <TweakSection label="Flow">
          <TweakToggle
            label="Show onboarding"
            value={tweaks.showOnboarding}
            onChange={(v) => setTweak('showOnboarding', v)}
          />
          <TweakButton label="Open AI Stylist" onClick={() => nav('ai')} />
          <TweakButton label="Open Calendar" onClick={() => nav('calendar')} />
          <TweakButton label="Open Stats" onClick={() => nav('stats')} />
          <TweakButton label="Open Wardrobe" onClick={() => nav('wardrobe')} />
        </TweakSection>
        <TweakSection label="Account">
          <div style={{
            padding: '8px 0 4px',
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em',
            color: 'var(--ink-soft)', wordBreak: 'break-all',
          }}>
            {userEmail}
          </div>
          <TweakButton label="Sign out" onClick={logout} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}


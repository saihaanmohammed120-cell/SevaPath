import React from 'react';
import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { LinkProvider } from '@astryxdesign/core/Link';
import Header from './components/Header';
import Footer from './components/Footer';
import CopilotDock from './components/CopilotDock';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Journey from './pages/Journey';
import MySevaPath from './pages/MySevaPath';
import Settings from './pages/Settings';
import About from './pages/About';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { LanguageProvider } from './context/LanguageContext';
import { JourneyProvider } from './context/JourneyContext';
import { Toaster } from './components/ui/sonner';
import { TIDS } from './lib/testids';
import { Theme } from '@astryxdesign/core/theme';
import { chocolateTheme } from '@astryxdesign/theme-chocolate/built';
import './App.css';

// Astryx LinkProvider adapter: Astryx Link passes `href`; react-router needs
// `to`. External destinations stay plain anchors so they open outside the app.
function RouterLinkAdapter({ href, to, children, ...rest }) {
  const dest = to || href || '';
  const isExternal =
    /^(https?:)?\/\//i.test(dest) || dest.startsWith('mailto:') || dest.startsWith('tel:');
  if (isExternal) {
    return (
      <a href={dest} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <RouterLink to={dest} {...rest}>
      {children}
    </RouterLink>
  );
}

function ThemedShell() {
  const { settings } = useSettings();
  return (
    <Theme theme={chocolateTheme} mode={settings.theme}>
      <LanguageProvider>
        <JourneyProvider>
          <BrowserRouter>
            <LinkProvider component={RouterLinkAdapter}>
            <div className="App">
              <a href="#main" className="sp-skip-link" data-testid={TIDS.skipLink}>
                Skip to content
              </a>
              <Header />
              <main id="main" className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/journey/:id" element={<Journey />} />
                  <Route path="/my" element={<MySevaPath />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>
              <Footer />
              <CopilotDock />
              <Toaster />
            </div>
            </LinkProvider>
          </BrowserRouter>
        </JourneyProvider>
      </LanguageProvider>
    </Theme>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <ThemedShell />
    </SettingsProvider>
  );
}

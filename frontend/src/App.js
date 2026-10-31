import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CopilotDock from './components/CopilotDock';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Journey from './pages/Journey';
import MySevaPath from './pages/MySevaPath';
import Settings from './pages/Settings';
import About from './pages/About';
import { SettingsProvider } from './context/SettingsContext';
import { LanguageProvider } from './context/LanguageContext';
import { JourneyProvider } from './context/JourneyContext';
import { Toaster } from './components/ui/sonner';
import { TIDS } from './lib/testids';
import './App.css';

export default function App() {
  return (
    <SettingsProvider>
      <LanguageProvider>
        <JourneyProvider>
          <BrowserRouter>
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
          </BrowserRouter>
        </JourneyProvider>
      </LanguageProvider>
    </SettingsProvider>
  );
}

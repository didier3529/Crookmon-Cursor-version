import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Game from './components/Game'
import Header from './components/ui/header'
import Footer from './components/ui/footer'
import { SettingsProvider } from './contexts/settingscontext'
import { WinStreakProvider } from './contexts/winstreakcontext'
import { DuelProvider } from './contexts/duelcontext'

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <WinStreakProvider>
          <DuelProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Game />} />
            </Routes>
            <Footer />
          </DuelProvider>
        </WinStreakProvider>
      </SettingsProvider>
    </BrowserRouter>
  )
}

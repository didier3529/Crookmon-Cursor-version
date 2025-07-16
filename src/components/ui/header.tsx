import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import useAnalytics from '../../hooks/useanalytics'
import { useWinStreak } from '../../contexts/winstreakcontext'

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const winStreak = useWinStreak()
  const { trackEvent } = useAnalytics()

  const handleNavClick = useCallback(
    (label: string) => {
      trackEvent('nav_click', { label })
      if (menuOpen) {
        setMenuOpen(false)
      }
    },
    [trackEvent, menuOpen]
  )

  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'Crookmon Quick Clash',
      text: `I'm on a ${winStreak} win streak in Crookmon Quick Clash! Join me!`,
      url: window.location.href,
    }
    trackEvent('share_attempt')
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        trackEvent('share_success')
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
        trackEvent('share_clipboard')
        window.alert('Link copied to clipboard')
      }
    } catch (error: any) {
      trackEvent('share_failure', { message: error.message })
    }
  }, [winStreak, trackEvent])

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev)
  }, [])

  return (
    <header className="header">
      <div className="header__container">
        <Link
          to="/"
          className="header__logo"
          onClick={() => trackEvent('logo_click')}
        >
          <img src="/assets/logo.png" alt="Crookmon Quick Clash" />
        </Link>
        <button
          className="header__toggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="header-navigation"
          onClick={toggleMenu}
        >
          <span className="header__toggle-bar" />
          <span className="header__toggle-bar" />
          <span className="header__toggle-bar" />
        </button>
        <nav
          id="header-navigation"
          className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}
          role="navigation"
          aria-hidden={!menuOpen}
        >
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <Link to="/play" onClick={() => handleNavClick('Play')}>
                Play
              </Link>
            </li>
            <li className="header__nav-item">
              <Link to="/leaderboard" onClick={() => handleNavClick('Leaderboard')}>
                Leaderboard
              </Link>
            </li>
            <li className="header__nav-item">
              <Link to="/shop" onClick={() => handleNavClick('Shop')}>
                Shop
              </Link>
            </li>
            <li className="header__nav-item">
              <Link to="/profile" onClick={() => handleNavClick('Profile')}>
                Profile
              </Link>
            </li>
          </ul>
        </nav>
        <div className="header__actions">
          <div className="header__streak" aria-label={`Win Streak: ${winStreak}`}>
            <span className="header__streak-label">Win Streak:</span>
            <span className="header__streak-value">{winStreak}</span>
          </div>
          <button
            className="header__share"
            onClick={handleShare}
            aria-label="Share"
          >
            <img src="/assets/icons/share.svg" alt="Share" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

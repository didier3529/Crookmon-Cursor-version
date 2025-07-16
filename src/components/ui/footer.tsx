import { FC, useCallback, useEffect, useState } from 'react'

interface Toast {
  message: string
  type: 'success' | 'error' | 'info'
  link?: string
}

const Footer: FC = () => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((toast: Toast) => {
    setToast(toast);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'Crookmon Quick Clash',
      text: 'Join me in Crookmon Quick Clash ? the ultimate animated card duel!',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        showToast({ message: 'Link copied to clipboard!', type: 'success' });
      } else {
        showToast({
          message: 'Unable to share automatically. Copy this link:',
          type: 'info',
          link: shareData.url,
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
      showToast({ message: 'Failed to share link.', type: 'error' });
    }
  }, [showToast]);

  const handleBackToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      {toast && (
        <div
          className={`footer__toast footer__toast--${toast.type}`}
          role={toast.type === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          <span>{toast.message}</span>
          {toast.link && (
            <a
              href={toast.link}
              target="_blank"
              rel="noopener noreferrer"
              className="footer__toast-link"
            >
              {toast.link}
            </a>
          )}
        </div>
      )}
      <footer className="footer">
        <div className="footer__container">
          <div className="footer__left">
            ? {new Date().getFullYear()} Crookmon Quick Clash
          </div>
          <nav className="footer__nav" aria-label="Footer links">
            <ul className="footer__list">
              <li className="footer__item">
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__link"
                >
                  Terms of Service
                </a>
              </li>
              <li className="footer__item">
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__link"
                >
                  Privacy Policy
                </a>
              </li>
              <li className="footer__item">
                <a href="/contact" className="footer__link">
                  Contact
                </a>
              </li>
              <li className="footer__item">
                <button
                  type="button"
                  onClick={handleShare}
                  className="footer__button"
                >
                  Share
                </button>
              </li>
              <li className="footer__item">
                <button
                  type="button"
                  onClick={handleBackToTop}
                  className="footer__button"
                >
                  Back to Top
                </button>
              </li>
            </ul>
          </nav>
          <div className="footer__right">
            {process.env.REACT_APP_VERSION && (
              <span className="footer__version">
                v{process.env.REACT_APP_VERSION}
              </span>
            )}
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;

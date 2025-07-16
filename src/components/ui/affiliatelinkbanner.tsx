import { FC, useEffect, useRef, useState } from 'react'
import useAnalytics from '../../hooks/useanalytics'

const srOnlyStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
}

interface AffiliateLinkBannerProps {
  affiliateId: string
}

const styles = {
  banner: 'affiliate-banner',
  text: 'affiliate-banner-text',
  controls: 'affiliate-banner-controls',
  input: 'affiliate-banner-input',
  button: 'affiliate-banner-button',
}

const AffiliateLinkBanner: FC<AffiliateLinkBannerProps> = ({ affiliateId }) => {
  const { trackEvent } = useAnalytics()
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<number>()
  const inputRef = useRef<HTMLInputElement>(null)

  const affiliateUrl = `https://crookmon-quickclash.com/?ref=${encodeURIComponent(
    affiliateId
  )}`

  const isClipboardSupported =
    typeof navigator.clipboard?.writeText === 'function' ||
    typeof document.queryCommandSupported === 'function' && document.queryCommandSupported('copy')

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(affiliateUrl)
      } else if (inputRef.current) {
        inputRef.current.select()
        document.execCommand('copy')
      } else {
        throw new Error('Copy not supported')
      }
      trackEvent('affiliate_link_copy', { affiliateId })
      setCopied(true)
      timeoutRef.current = window.setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      // ignore copy errors
    }
  }

  return (
    <div className={styles.banner} role="region" aria-label="Affiliate Link Banner">
      <p className={styles.text}>Share your link and earn rewards!</p>
      <div className={styles.controls}>
        <input
          ref={inputRef}
          type="text"
          readOnly
          value={affiliateUrl}
          onFocus={e => e.currentTarget.select()}
          className={styles.input}
          aria-label="Affiliate Link"
        />
        <button
          type="button"
          onClick={handleCopy}
          className={styles.button}
          disabled={!isClipboardSupported}
          title={!isClipboardSupported ? 'Copy not supported in this browser' : undefined}
        >
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
      <div role="status" aria-live="polite" style={srOnlyStyle}>
        {copied ? 'Link copied to clipboard' : ''}
      </div>
    </div>
  )
}

export default AffiliateLinkBanner

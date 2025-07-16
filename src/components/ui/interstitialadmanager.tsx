import { useEffect } from 'react'

const AD_UNIT_PATH = process.env.REACT_APP_GPT_INTERSTITIAL_AD_UNIT_ID || '/1234567/default_interstitial'

let interstitialSlot: googletag.Slot | null = null;
let isAdLoaded = false;
let loadScriptPromise: Promise<void> | null = null;

export const loadAd = async (): Promise<void> => {
  if (isAdLoaded) return;
  if (!loadScriptPromise) {
    loadScriptPromise = new Promise<void>((resolve, reject) => {
      window.googletag = window.googletag || { cmd: [] };
      if (window.googletag.apiReady) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://www.googletagservices.com/tag/js/gpt.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load GPT script'));
      document.head.appendChild(script);
    });
  }
  await loadScriptPromise;
  window.googletag.cmd.push(() => {
    interstitialSlot = window.googletag.defineOutOfPageSlot(
      AD_UNIT_PATH,
      window.googletag.enums.OutOfPageFormat.INTERSTITIAL
    );
    if (interstitialSlot) {
      interstitialSlot.addService(window.googletag.pubads());
      window.googletag.pubads().enableSingleRequest();
      window.googletag.enableServices();
      isAdLoaded = true;
    }
  });
};

export const showAd = (): void => {
  if (!isAdLoaded || !interstitialSlot) {
    console.warn('InterstitialAdManager: Ad not loaded');
    return;
  }
  window.googletag.cmd.push(() => {
    window.googletag.pubads().refresh([interstitialSlot!]);
  });
};

const InterstitialAdManager: React.FC = () => {
  useEffect(() => {
    loadAd().catch(err => {
      console.error('InterstitialAdManager loadAd error:', err);
    });
    return () => {
      isAdLoaded = false;
      interstitialSlot = null;
    };
  }, []);

  return null;
};

export default InterstitialAdManager;

// pages/_app.js - yangilangan versiya
import '../styles/globals.css'
import { I18nextProvider } from 'react-i18next'
import i18n from '../lib/i18n'
import { useEffect, useState } from 'react'

// ═══════════════════════════════════════════════════════════════════
// SERVER CRASH MODE: true = barcha sahifalar o‘rniga error rasm.
// Oddiy ilovaga qaytarish uchun quyidagini false qiling:
// ═══════════════════════════════════════════════════════════════════
const SERVER_CRASH_MODE = false

function ServerCrashScreen() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f0f0f',
        zIndex: 99999,
      }}
    >
      <img
        src="/server-crash-error.jpg"
        alt="Server error"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}

export default function App({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false)
  const [installPromptEvent, setInstallPromptEvent] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Register SW only in production; in dev it breaks HMR and causes full reload loops
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (process.env.NODE_ENV === 'production') {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js', { scope: '/' });
        });
      } else {
        // Ensure any previously installed SW is removed in dev
        navigator.serviceWorker.getRegistrations?.().then((regs) => {
          regs.forEach((reg) => reg.unregister());
        });
      }
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPromptEvent(e)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setInstallPromptEvent(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, []);

  // Server crash rejimida faqat error rasm
  if (SERVER_CRASH_MODE) {
    return <ServerCrashScreen />
  }

  // SSR paytida i18n tayyor bo'lishini kutish
  if (!isClient) {
    return (
      <I18nextProvider i18n={i18n}>
        <Component {...pageProps} />
      </I18nextProvider>
    )
  }

  return (
    <I18nextProvider i18n={i18n}>
      {!isInstalled && installPromptEvent && (
        <button
          onClick={async () => {
            installPromptEvent.prompt()
            const { outcome } = await installPromptEvent.userChoice
            if (outcome === 'accepted') {
              setInstallPromptEvent(null)
            }
          }}
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 9999,
            padding: '10px 14px',
            borderRadius: 8,
            background: '#111827',
            color: '#fff',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
          }}
        >
          Ilovani o'rnatish
        </button>
      )}
      <Component {...pageProps} />
    </I18nextProvider>
  );
}
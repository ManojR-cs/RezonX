import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Heart, MapPin, Menu, MessageCircle, Send, X } from 'lucide-react';
import InteractiveBackground from './components/InteractiveBackground';
import LiquidButton from './components/LiquidButton';
import SmoothScroll from './components/SmoothScroll';
import useRezonxData from './hooks/useRezonxData';
import { getSupabaseClient } from './lib/supabase';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'events', label: 'Events' },
  { id: 'activities', label: 'Activities' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'join', label: 'Join' },
];

const photo = (filename) => `/rezonx/${encodeURIComponent(filename)}`;
const titleKey = (title) => String(title ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const publicSiteBaseUrl = 'https://manojr-cs.github.io/Rezon-X/';
const localPhotoNames = new Set([
  'vvce1.jpg', 'ROBOSOCCER2.jpeg', 'LINE FOLLOWEER1.jpeg', 'iitmaero.jpg',
  'workshop.jpeg', 'CAD.jpeg', 'university.jpeg', 'innovate.jpeg', 'certificate.jpeg',
  'VNIT1.jpeg', 'skyhack2.0.jpg', 'vvce2.jpeg', 'vvce3.jpg', 'vvce4.jpg',
  'vvce5.jpg', 'VNIT2.jpeg', 'VNIT3.jpeg', 'VNIT4.jpeg', 'vnit5.jpeg',
  'skyhack1.jpeg', 'skyhack2.jpeg',
]);

function resolveCmsImage(imageUrl, fallbackImage) {
  if (!imageUrl) return fallbackImage ?? null;

  try {
    const resolved = new URL(imageUrl, publicSiteBaseUrl);
    if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') return fallbackImage ?? null;
    const filename = decodeURIComponent(resolved.pathname.split('/').pop() ?? '');
    if (!/^https?:\/\//i.test(imageUrl) && localPhotoNames.has(filename)) return photo(filename);
    return resolved.href;
  } catch {
    return fallbackImage ?? null;
  }
}

const activityImageFallbacks = new Map([
  ['hackathons', 'vvce1.jpg'],
  ['robo soccer', 'ROBOSOCCER2.jpeg'],
  ['line follower bot', 'LINE FOLLOWEER1.jpeg'],
  ['aero modelling', 'iitmaero.jpg'],
  ['circuit building workshop', 'workshop.jpeg'],
  ['cad workshop', 'CAD.jpeg'],
]);

const achievementImageFallbacks = new Map([
  [titleKey('1st place at the Social Work Innovation Ideathon conducted by Tumkur University.'), 'university.jpeg'],
  [titleKey('2nd place at ideathon conducted by ISBM.'), 'innovate.jpeg'],
  [titleKey('National level 3rd place in Robo Cup conducted by VNIT Nagpur.'), 'certificate.jpeg'],
]);

const documentedProjectIds = new Map([
  [titleKey('Crop Care & KVK Alert System'), 'crop-care'],
  [titleKey('Multifunctional AgriBot'), 'agribot'],
  [titleKey('Voice Controlled Bot'), 'voice-bot'],
  [titleKey('PET Bottle 3D Filament'), 'pet-filament'],
  [titleKey('Smart Kiosk Printer'), 'smart-kiosk'],
]);

function getProjectInteractionId(project) {
  return documentedProjectIds.get(titleKey(project.title)) ?? null;
}

function CollectionStatus({ collection, empty, className = '' }) {
  if (collection.loading) {
    return <p className={`py-8 text-center text-sm text-white/40 ${className}`}>Loading from RezonX CMS…</p>;
  }
  if (collection.error) {
    return <p role="status" className={`rounded-xl border border-amber-300/20 bg-amber-200/[0.04] p-5 text-center text-sm text-amber-100/70 ${className}`}>Unable to load this RezonX CMS data: {collection.error}</p>;
  }
  if (collection.data?.length === 0 || collection.data === null) {
    return <p className={`py-8 text-center text-sm text-white/40 ${className}`}>{empty}</p>;
  }
  return null;
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mb-12 text-center md:mb-16"
    >
      <p className="mb-3 font-display text-[10px] font-bold uppercase tracking-[0.45em] text-cyan-300/70">{eyebrow}</p>
      <h2 className="font-display text-4xl font-black uppercase tracking-wide text-white text-glow-cyan sm:text-5xl md:text-7xl">{title}</h2>
      {description && <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/50 md:text-base">{description}</p>}
    </motion.div>
  );
}

function SplashIntro({ onComplete }) {
  const shouldReduceMotion = useReducedMotion();
  const duration = shouldReduceMotion ? 1200 : 2700;

  useEffect(() => {
    const timer = window.setTimeout(onComplete, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.15 : 0.65, ease: 'easeInOut' }}
      className="fixed inset-0 z-[300] flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#03060c] px-6 text-white"
      role="status"
      aria-label="Loading RezonX"
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-0 bg-cross-grid opacity-20" />
      {!shouldReduceMotion && (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(88vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/[0.09]"
          >
            <span className="absolute -top-1 left-1/2 size-2 rounded-full bg-cyan-100/80 shadow-[0_0_14px_rgba(103,232,249,0.6)]" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(70vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.07]"
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[min(90vw,700px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-100/10 to-transparent" />
        </>
      )}

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex w-full max-w-md flex-col items-center text-center"
      >
        <div className="mb-8 flex items-center justify-center">
          <div className="size-28 overflow-hidden rounded-full border border-cyan-100/25 bg-[#07101b] p-2 shadow-[0_0_36px_rgba(34,211,238,0.16)] sm:size-32">
            <img src={photo('RezonX_logo.jpeg')} alt="RezonX logo" width="128" height="128" className="size-full rounded-full object-cover" />
          </div>
        </div>

        <p className="font-display text-2xl font-black tracking-[0.16em] sm:text-3xl">
          REZON<span className="text-cyan-200">X</span>
        </p>
        <p className="mt-3 font-display text-[9px] font-bold uppercase tracking-[0.32em] text-white/55 sm:text-[10px] sm:tracking-[0.4em]">
          Aspiration. Rezonate. Execution.
        </p>

        <div className="mt-11 w-full max-w-[260px]">
          <div className="mb-2 flex items-center justify-between font-display text-[8px] font-bold uppercase tracking-[0.22em] text-white/35">
            <span>Initializing</span>
            <span>REZONX SYSTEMS</span>
          </div>
          <div className="h-[2px] overflow-hidden bg-white/10">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              className="h-full origin-left bg-cyan-200/80 shadow-[0_0_10px_rgba(103,232,249,0.45)]"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AnimatedStatistic({ value }) {
  const numericValue = Number(value);
  const target = Number.isFinite(numericValue) ? Math.max(0, Math.round(numericValue)) : 0;
  const counterRef = useRef(null);
  const isInView = useInView(counterRef, { once: true, amount: 0.5 });
  const shouldReduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return undefined;
    if (shouldReduceMotion || target === 0) return undefined;

    let frameId;
    const startTime = performance.now();
    const duration = 1400;
    const update = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(target * eased));
      if (progress < 1) frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, shouldReduceMotion, target]);

  const displayedCount = shouldReduceMotion && isInView ? target : count;
  return <span ref={counterRef}>{displayedCount}+</span>;
}

function EventTakeover({ event, onClose }) {
  const [countdown, setCountdown] = useState(3);
  const [countdownVisible, setCountdownVisible] = useState(true);
  const [phase, setPhase] = useState('countdown');
  const shouldReduceMotion = useReducedMotion();
  const posterUrl = event.poster_url ? resolveCmsImage(event.poster_url, null) : null;
  const themeColor = event.theme?.trim() ?? '';
  const validThemeColor = /^#[\da-f]{6}$/i.test(themeColor)
    ? themeColor
    : /^#[\da-f]{3}$/i.test(themeColor)
      ? `#${[...themeColor.slice(1)].map((digit) => `${digit}${digit}`).join('')}`
      : '#67e8f9';

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const closeOnEscape = (keyboardEvent) => {
      if (keyboardEvent.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    if (shouldReduceMotion) {
      const revealTimer = window.setTimeout(() => setPhase('poster'), 0);
      return () => window.clearTimeout(revealTimer);
    }

    const timers = [
      window.setTimeout(() => setCountdownVisible(false), 760),
      window.setTimeout(() => {
        setCountdown(2);
        setCountdownVisible(true);
      }, 1000),
      window.setTimeout(() => setCountdownVisible(false), 1760),
      window.setTimeout(() => {
        setCountdown(1);
        setCountdownVisible(true);
      }, 2000),
      window.setTimeout(() => setCountdownVisible(false), 2760),
      window.setTimeout(() => setPhase('impact'), 3000),
      window.setTimeout(() => setPhase('poster'), 3650),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [shouldReduceMotion]);

  const particles = Array.from({ length: 30 }, (_, index) => {
    const angle = (index / 30) * Math.PI * 2 + (index % 2) * 0.12;
    const distance = 190 + ((index * 41) % 290);
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance * 0.8,
      rotate: (index % 2 ? 1 : -1) * (180 + (index % 5) * 55),
      width: index % 4 === 0 ? 5 : 3,
      height: index % 4 === 0 ? 20 : 12,
    };
  });

  const ribbons = Array.from({ length: 16 }, (_, index) => {
    const angle = (index / 16) * Math.PI * 2 + (index % 2) * 0.16;
    const distance = 230 + ((index * 53) % 250);
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance * 0.78,
      rotate: (index % 2 ? 1 : -1) * (120 + (index % 4) * 55),
      width: 66 + (index % 4) * 15,
    };
  });

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.35 }}
      className="fixed inset-0 z-[200] overflow-y-auto overscroll-contain bg-[#02040a]/[0.98] backdrop-blur-2xl"
      role="dialog"
      aria-modal="true"
      aria-label={`${event.title} event poster`}
      onMouseDown={(mouseEvent) => {
        if (mouseEvent.target === mouseEvent.currentTarget) onClose();
      }}
    >
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_50%_44%,rgba(8,145,178,0.14),transparent_55%)]" />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close event poster"
        className="fixed right-4 top-4 z-30 flex size-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-md transition hover:border-cyan-200/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 sm:right-7 sm:top-7"
      >
        <X size={19} />
      </button>

      {(phase === 'countdown' || phase === 'impact') && (
        <div
          className="pointer-events-none fixed inset-0 z-20 grid place-items-center"
          aria-live="assertive"
          aria-atomic="true"
          aria-label={phase === 'countdown' ? `Countdown ${countdown}` : 'Event reveal'}
        >
          {phase === 'countdown' && (
            <motion.span
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.72, y: 12, filter: 'blur(10px)' }}
              animate={countdownVisible
                ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, scale: 0.76, y: -8, filter: 'blur(8px)' }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : countdownVisible ? 0.3 : 0.22,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-display text-[clamp(9rem,35vw,22rem)] font-black leading-none"
              style={{ color: validThemeColor, textShadow: `0 0 24px ${validThemeColor}55, 0 0 100px ${validThemeColor}35` }}
            >
              {countdown}
            </motion.span>
          )}
          {phase === 'impact' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.35 }}
              animate={{ opacity: [0, 0.75, 0], scale: [0.35, 1, 1.35] }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.58, ease: 'easeOut' }}
              className="size-36 rounded-full border"
              style={{
                borderColor: `${validThemeColor}88`,
                boxShadow: `0 0 55px ${validThemeColor}55, inset 0 0 35px ${validThemeColor}30`,
              }}
            />
          )}
        </div>
      )}

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col items-center justify-center px-4 pb-8 pt-20 sm:px-8 sm:py-12">
        <div className="relative flex w-full flex-col items-center">
          {(phase === 'poster' || phase === 'details') && (
            <div className="relative flex w-full flex-col items-center">
              <div className="pointer-events-none absolute left-1/2 top-[min(35vh,300px)] z-0 aspect-square w-[min(110vw,900px)] -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.1 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.08, 1.25, 2.15] }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 1.05, times: [0, 0.12, 1], ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: `radial-gradient(circle, #ffffffb8 0%, ${validThemeColor}70 8%, ${validThemeColor}20 36%, transparent 70%)` }}
                />
                {!shouldReduceMotion && ribbons.map((ribbon, index) => (
                  <motion.svg
                    key={`ribbon-${index}`}
                    viewBox="0 0 120 64"
                    initial={{ opacity: 0, x: 0, y: 0, rotate: index * 24, scale: 0.2 }}
                    animate={{ opacity: [0, 0.98, 0.82, 0], x: ribbon.x, y: ribbon.y, rotate: ribbon.rotate, scale: [0.2, 1.1, 1] }}
                    transition={{ duration: 2.5 + (index % 5) * 0.16, delay: (index % 4) * 0.035, times: [0, 0.2, 0.62, 1], ease: [0.12, 0.72, 0.22, 1] }}
                    className="absolute left-1/2 top-1/2 overflow-visible"
                    style={{ width: ribbon.width, height: 48, marginLeft: -ribbon.width / 2, marginTop: -24 }}
                  >
                    <path d="M 5 34 C 28 2, 54 4, 62 30 S 95 58, 116 16" fill="none" stroke={index % 4 === 0 ? '#ffffff' : validThemeColor} strokeWidth={index % 3 === 0 ? 6 : 4} strokeLinecap="round" />
                    <path d="M 7 36 C 29 8, 51 9, 61 31" fill="none" stroke="#ffffff" strokeOpacity="0.72" strokeWidth="1.2" strokeLinecap="round" />
                  </motion.svg>
                ))}
                {!shouldReduceMotion && particles.map((particle, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.25 }}
                    animate={{ opacity: [0, 0.9, 0], x: particle.x, y: particle.y, rotate: particle.rotate, scale: [0.25, 1, 0.5] }}
                    transition={{ duration: 1.45 + (index % 4) * 0.16, delay: 0.03 + (index % 5) * 0.025, ease: [0.12, 0.7, 0.25, 1] }}
                    className="absolute left-1/2 top-1/2 block rounded-sm"
                    style={{
                      width: particle.width,
                      height: particle.height,
                      backgroundColor: index % 4 === 0 ? '#ffffff' : validThemeColor,
                      boxShadow: `0 0 14px ${validThemeColor}90`,
                    }}
                  />
                ))}
              </div>

              {posterUrl ? (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.38, rotate: -7, y: 54, filter: 'brightness(2.8) blur(12px)' }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: [0, 1, 1], scale: [0.38, 1.055, 1], rotate: [-7, 1.2, 0], y: [54, -8, 0], filter: ['brightness(2.8) blur(12px)', 'brightness(1.15) blur(0px)', 'brightness(1) blur(0px)'] }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 1.2, times: [0, 0.72, 1], ease: [0.16, 1, 0.3, 1] }}
                  onAnimationComplete={() => setPhase('details')}
                  className="relative z-10 h-[min(58svh,680px)] w-[min(88vw,520px)] overflow-hidden rounded-xl border border-white/15 bg-[#060a12] shadow-[0_30px_120px_rgba(0,0,0,0.65)] sm:h-[min(66svh,760px)]"
                >
                  <img src={posterUrl} alt={`${event.title} poster`} className="size-full object-contain" />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                </motion.div>
              ) : (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.42, rotate: 6, y: 48 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: [0, 1, 1], scale: [0.42, 1.055, 1], rotate: [6, -1, 0], y: [48, -7, 0] }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 1.2, times: [0, 0.72, 1], ease: [0.16, 1, 0.3, 1] }}
                  onAnimationComplete={() => setPhase('details')}
                  className="relative z-10 flex h-[min(58svh,680px)] w-[min(88vw,520px)] flex-col items-center justify-center rounded-xl border border-white/15 bg-[linear-gradient(145deg,#082f49,#02060f_60%,#0f172a)] p-8 text-center shadow-[0_30px_120px_rgba(0,0,0,0.65)]"
                >
                  <CalendarDays size={32} className="mb-5" style={{ color: validThemeColor }} />
                  <p className="font-display text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">RezonX event</p>
                  <h2 className="mt-5 font-display text-2xl font-black uppercase text-white sm:text-4xl">{event.title}</h2>
                  <p className="mt-5 text-sm text-white/50">No poster is available for this event.</p>
                </motion.div>
              )}

              <AnimatePresence>
                {phase === 'details' && (
                  <motion.section
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.01 : 0.55 }}
                    className="relative z-10 mt-6 w-full max-w-3xl rounded-2xl border border-white/10 bg-[#080d16]/85 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:mt-8 sm:p-7"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-[9px] font-bold uppercase tracking-[0.35em]" style={{ color: validThemeColor }}>Featured event</p>
                        <h2 className="mt-2 font-display text-xl font-black uppercase leading-tight text-white sm:text-3xl">{event.title}</h2>
                        {event.theme && !/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(event.theme.trim()) && (
                          <p className="mt-2 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">{event.theme}</p>
                        )}
                        {event.description && <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">{event.description}</p>}
                        {(event.event_date || event.event_time || event.venue) && (
                          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/65">
                            {(event.event_date || event.event_time) && (
                              <span className="inline-flex items-center gap-2"><CalendarDays size={14} style={{ color: validThemeColor }} />{[event.event_date, event.event_time?.slice(0, 5)].filter(Boolean).join(' · ')}</span>
                            )}
                            {event.venue && <span className="inline-flex items-center gap-2"><MapPin size={14} style={{ color: validThemeColor }} />{event.venue}</span>}
                          </div>
                        )}
                      </div>
                      {event.registration_url && (
                        <a
                          href={event.registration_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-200/25 bg-cyan-300/[0.08] px-5 py-3 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100 transition hover:border-cyan-200/45 hover:bg-cyan-300/[0.14]"
                        >
                          Register Now <ArrowUpRight size={15} />
                        </a>
                      )}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>,
    document.body,
  );
}

function EventCard({ event, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const closeTakeover = useCallback(() => setIsOpen(false), []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: Math.min(index, 3) * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto grid w-full max-w-5xl items-center gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12"
    >
      <div className="glow-card rounded-3xl p-3 sm:p-5">
        <div className="relative isolate flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-2xl border border-cyan-100/10 bg-[#07101b] p-6 text-center">
          <div className="dot-matrix pointer-events-none absolute inset-0 opacity-30" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,0.17),transparent_52%)]" />
          <div className="relative">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full border border-cyan-200/20 bg-cyan-300/[0.06] text-cyan-200 shadow-[0_0_45px_rgba(34,211,238,0.12)]">
              <CalendarDays size={27} strokeWidth={1.5} />
            </div>
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.42em] text-cyan-200/70">RezonX · Events</p>
            <p className="mt-3 font-display text-xl font-black uppercase tracking-wide text-white sm:text-2xl">{event.title}</p>
            <div className="mx-auto mt-7 h-px w-24 bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent" />
            <span className="mt-4 block font-display text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">Poster sealed</span>
          </div>
        </div>
        <motion.button
          type="button"
          whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-200/20 bg-cyan-300/[0.08] px-5 py-3.5 font-display text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-100 transition-colors hover:border-cyan-200/40 hover:bg-cyan-300/[0.13] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70"
        >
          Reveal Poster <ArrowRight size={15} />
        </motion.button>
      </div>
      <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
        <p className="font-display text-[9px] font-bold uppercase tracking-[0.35em] text-cyan-200/65">Featured event</p>
        <h3 className="mt-3 font-display text-2xl font-black uppercase leading-tight tracking-wide text-white sm:text-3xl">{event.title}</h3>
        {event.theme && <p className="mt-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-cyan-100/65">{event.theme}</p>}
        {event.description && <p className="mt-4 text-sm leading-7 text-white/55">{event.description}</p>}
        {(event.event_date || event.event_time || event.venue) && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {(event.event_date || event.event_time) && (
              <div className="flex items-start gap-3">
                <CalendarDays size={17} className="mt-0.5 shrink-0 text-cyan-200/70" />
                <div>
                  <p className="font-display text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">Date &amp; time</p>
                  <p className="mt-1 text-sm text-white/70">{[event.event_date, event.event_time?.slice(0, 5)].filter(Boolean).join(' · ')}</p>
                </div>
              </div>
            )}
            {event.venue && (
              <div className="flex items-start gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0 text-cyan-200/70" />
                <div>
                  <p className="font-display text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">Venue</p>
                  <p className="mt-1 text-sm text-white/70">{event.venue}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <AnimatePresence>{isOpen && <EventTakeover event={event} onClose={closeTakeover} />}</AnimatePresence>
    </motion.article>
  );
}

function FeaturedEvent({ collection }) {
  const events = collection.data ?? [];

  return (
    <section id="events" className="relative scroll-mt-20 overflow-hidden py-24 md:py-32">
      <SectionBackground variant="events" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(8,145,178,0.11),transparent_58%)]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading eyebrow="Events" title="Featured Event" description="Published RezonX event details." />
        {collection.loading || collection.error || events.length === 0 ? (
          <CollectionStatus collection={collection} empty="No events are currently published." className="mx-auto max-w-5xl" />
        ) : (
          <div className="space-y-10">
            {events.map((event, index) => <EventCard key={event.id} event={event} index={index} />)}
          </div>
        )}
      </div>
    </section>
  );
}

const MarqueeGroupContext = createContext({
  isDuplicate: false,
  loadDuplicates: true,
});

function CardMarquee({ children, trackRef: trackRefProp, groupRef: groupRefProp, interactiveDuplicates = false, reverse = false, duration = 52 }) {
  const containerRef = useRef(null);
  const internalTrackRef = useRef(null);
  const internalGroupRef = useRef(null);
  const trackRef = trackRefProp ?? internalTrackRef;
  const groupRef = groupRefProp ?? internalGroupRef;

  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(containerRef, { margin: '200px', once: false });
  const [loadDuplicateImages, setLoadDuplicateImages] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion || loadDuplicateImages || !isInView) return undefined;

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => setLoadDuplicateImages(true), { timeout: 1500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timer = window.setTimeout(() => setLoadDuplicateImages(true), 1200);
    return () => window.clearTimeout(timer);
  }, [isInView, shouldReduceMotion, loadDuplicateImages]);

  const handleInteraction = useCallback(() => {
    if (!shouldReduceMotion) setLoadDuplicateImages(true);
  }, [shouldReduceMotion]);

  const firstGroupDuplicate = !shouldReduceMotion && reverse;
  const secondGroupDuplicate = !shouldReduceMotion && !reverse;
  const duplicateLoadReady = !shouldReduceMotion && loadDuplicateImages;

  return (
    <div
      ref={containerRef}
      onPointerEnter={handleInteraction}
      onFocus={handleInteraction}
      className="marquee-window"
    >
      <div
        ref={trackRef}
        className={`marquee-track${reverse ? ' marquee-track--reverse' : ''}`}
        style={{ animationDuration: `${duration}s` }}
      >
        <MarqueeGroupContext.Provider value={{ isDuplicate: firstGroupDuplicate, loadDuplicates: firstGroupDuplicate ? duplicateLoadReady : true }}>
          <div ref={groupRef} className="marquee-group">
            {children}
          </div>
        </MarqueeGroupContext.Provider>

        <MarqueeGroupContext.Provider value={{ isDuplicate: secondGroupDuplicate, loadDuplicates: secondGroupDuplicate ? duplicateLoadReady : true }}>
          <div
            className="marquee-group"
            aria-hidden={interactiveDuplicates ? undefined : true}
            inert={!interactiveDuplicates || undefined}
          >
            {children}
          </div>
        </MarqueeGroupContext.Provider>
      </div>
    </div>
  );
}

function OptimizedCardImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  width = 400,
  height = 208,
  aspectRatio = '400 / 208',
  overlay = null,
}) {
  const { isDuplicate, loadDuplicates } = useContext(MarqueeGroupContext);
  const containerRef = useRef(null);
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (isDuplicate || inView) return;
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '350px 0px 350px 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [inView, isDuplicate]);

  const shouldLoad = isDuplicate ? loadDuplicates : inView;

  return (
    <div
      ref={containerRef}
      className={containerClassName}
      style={{ aspectRatio }}
    >
      {shouldLoad && src ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className={className}
          style={{ aspectRatio }}
        />
      ) : null}
      {overlay}
    </div>
  );
}

function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  const navigateTo = (id) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    let frameId;
    const updateActiveSection = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const activationPoint = window.innerHeight * 0.35;
        let currentSection = sections[0].id;
        sections.forEach(({ id }) => {
          const element = document.getElementById(id);
          if (element && element.getBoundingClientRect().top <= activationPoint) currentSection = id;
        });
        setActiveSection(currentSection);
      });
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  const navLinks = (
    <>
      {sections.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => navigateTo(id)}
          aria-current={activeSection === id ? 'location' : undefined}
          className={`group relative whitespace-nowrap rounded-full px-3 py-2 font-display text-[9px] font-bold uppercase tracking-[0.13em] transition-all duration-300 ${
            activeSection === id
              ? 'bg-cyan-200/[0.08] text-cyan-100 shadow-[inset_0_0_18px_rgba(34,211,238,0.05)]'
              : 'text-white/50 hover:bg-white/[0.05] hover:text-white'
          }`}
        >
          {label}
          <motion.span
            initial={false}
            animate={{ scaleX: activeSection === id ? 1 : 0, opacity: activeSection === id ? 1 : 0 }}
            className="absolute inset-x-3 -bottom-0.5 h-px origin-center bg-gradient-to-r from-transparent via-cyan-200 to-transparent"
          />
        </button>
      ))}
    </>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-[80] px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto flex min-h-[66px] max-w-[1440px] items-center justify-between gap-3 rounded-2xl border border-white/[0.09] bg-[#060a14]/80 px-4 shadow-[0_18px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl sm:px-5 md:rounded-full md:px-6">
        <button type="button" onClick={() => navigateTo('home')} aria-label="RezonX home" className="group flex min-w-0 items-center gap-2.5 text-left">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-200/20 bg-white/[0.04] p-1 shadow-[0_0_24px_rgba(34,211,238,0.08)] transition group-hover:border-cyan-200/40 group-hover:shadow-[0_0_28px_rgba(34,211,238,0.16)]">
            <img src={photo('RezonX_logo.jpeg')} alt="" className="h-full w-full rounded-full object-contain" />
          </span>
          <span className="font-display text-base font-black tracking-[0.1em] text-white sm:text-lg">
            REZON<span className="text-cyan-300">X</span>
          </span>
        </button>
        <nav aria-label="Main navigation" className="hidden items-center gap-0.5 rounded-full border border-white/[0.05] bg-black/20 p-1 xl:flex">
          {navLinks}
        </nav>
        <button
          type="button"
          onClick={() => navigateTo('join')}
          className="hidden items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/[0.08] px-4 py-2.5 font-display text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-100 transition hover:border-cyan-200/40 hover:bg-cyan-200/[0.14] xl:inline-flex"
        >
          Join RezonX <ArrowUpRight size={13} />
        </button>
        <button
          type="button"
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((open) => !open)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:border-cyan-200/30 hover:bg-cyan-200/[0.08] xl:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={isOpen ? 'close' : 'menu'} initial={{ opacity: 0, rotate: -45, scale: 0.8 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 45, scale: 0.8 }} transition={{ duration: 0.16 }}>
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mx-3 mt-2 max-h-[calc(100svh-6rem)] origin-top overscroll-contain overflow-y-auto rounded-2xl border border-white/[0.09] bg-[#060a14]/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:mx-5 xl:hidden"
          >
            <div className="flex flex-col gap-1">{navLinks}</div>
            <button type="button" onClick={() => navigateTo('join')} className="mt-2 flex w-full items-center justify-between rounded-xl border border-cyan-200/15 bg-cyan-200/[0.07] px-4 py-3 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100 transition hover:bg-cyan-200/[0.13]">
              Join RezonX <ArrowUpRight size={14} />
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ── Dynamic technical background for non-hero sections ────────────────── */
const SECTION_BG_CONFIGS = {
  events: {
    gridAnim: 'animate-grid-drift-x',
    glowColor: 'rgba(34,211,238,0.06)',
    glowPosition: 'left-1/2 top-0',
    pulseSpeed1: 'animate-trace-pulse-a',
    pulseSpeed2: 'animate-trace-pulse-b',
    accentOrange: true,
    particles: [
      { left: 14, top: 28, size: 2, anim: 'animate-particle-drift-1', color: 'bg-cyan-400/35' },
      { left: 84, top: 62, size: 2.5, anim: 'animate-particle-drift-2', color: 'bg-orange-400/30' },
      { left: 68, top: 18, size: 1.5, anim: 'animate-particle-drift-1', color: 'bg-cyan-300/25' },
    ],
  },
  about: {
    gridAnim: 'animate-grid-drift-y',
    glowColor: 'rgba(56,189,248,0.05)',
    glowPosition: 'left-1/3 top-0',
    pulseSpeed1: 'animate-trace-pulse-b',
    pulseSpeed2: 'animate-trace-pulse-c',
    accentOrange: false,
    particles: [
      { left: 20, top: 42, size: 2, anim: 'animate-particle-drift-2', color: 'bg-cyan-400/30' },
      { left: 74, top: 28, size: 2, anim: 'animate-particle-drift-1', color: 'bg-cyan-300/25' },
      { left: 88, top: 72, size: 1.5, anim: 'animate-particle-drift-2', color: 'bg-cyan-400/25' },
    ],
  },
  statistics: {
    gridAnim: 'animate-grid-drift-diag',
    glowColor: 'rgba(251,146,60,0.04)',
    glowPosition: 'left-1/2 top-0',
    pulseSpeed1: 'animate-trace-pulse-c',
    pulseSpeed2: 'animate-trace-pulse-a',
    accentOrange: true,
    particles: [
      { left: 16, top: 32, size: 2.5, anim: 'animate-particle-drift-1', color: 'bg-orange-400/35' },
      { left: 48, top: 68, size: 1.5, anim: 'animate-particle-drift-2', color: 'bg-cyan-300/25' },
      { left: 86, top: 42, size: 2, anim: 'animate-particle-drift-1', color: 'bg-cyan-400/30' },
    ],
  },
  activities: {
    gridAnim: 'animate-grid-drift-diag-rev',
    glowColor: 'rgba(34,211,238,0.06)',
    glowPosition: 'left-2/3 top-0',
    pulseSpeed1: 'animate-trace-pulse-a',
    pulseSpeed2: 'animate-trace-pulse-rev',
    accentOrange: true,
    particles: [
      { left: 12, top: 52, size: 2, anim: 'animate-particle-drift-2', color: 'bg-cyan-400/30' },
      { left: 58, top: 22, size: 1.5, anim: 'animate-particle-drift-1', color: 'bg-orange-400/30' },
      { left: 92, top: 58, size: 2, anim: 'animate-particle-drift-2', color: 'bg-cyan-300/35' },
    ],
  },
  projects: {
    gridAnim: 'animate-grid-drift-y-rev',
    glowColor: 'rgba(34,211,238,0.05)',
    glowPosition: 'left-1/2 top-0',
    pulseSpeed1: 'animate-trace-pulse-b',
    pulseSpeed2: 'animate-trace-pulse-a',
    accentOrange: false,
    particles: [
      { left: 24, top: 28, size: 2, anim: 'animate-particle-drift-1', color: 'bg-cyan-400/30' },
      { left: 82, top: 68, size: 2.5, anim: 'animate-particle-drift-2', color: 'bg-cyan-300/25' },
      { left: 62, top: 16, size: 1.5, anim: 'animate-particle-drift-1', color: 'bg-cyan-400/25' },
    ],
  },
  achievements: {
    gridAnim: 'animate-grid-drift-x-rev',
    glowColor: 'rgba(251,146,60,0.05)',
    glowPosition: 'left-1/3 top-0',
    pulseSpeed1: 'animate-trace-pulse-c',
    pulseSpeed2: 'animate-trace-pulse-b',
    accentOrange: true,
    particles: [
      { left: 10, top: 42, size: 2.5, anim: 'animate-particle-drift-2', color: 'bg-orange-400/35' },
      { left: 70, top: 32, size: 2, anim: 'animate-particle-drift-1', color: 'bg-cyan-400/25' },
      { left: 84, top: 78, size: 1.5, anim: 'animate-particle-drift-2', color: 'bg-orange-300/25' },
    ],
  },
  gallery: {
    gridAnim: 'animate-grid-drift-diag',
    glowColor: 'rgba(34,211,238,0.05)',
    glowPosition: 'left-1/2 top-0',
    pulseSpeed1: 'animate-trace-pulse-a',
    pulseSpeed2: 'animate-trace-pulse-c',
    accentOrange: false,
    particles: [
      { left: 18, top: 22, size: 1.5, anim: 'animate-particle-drift-1', color: 'bg-cyan-300/25' },
      { left: 76, top: 48, size: 2, anim: 'animate-particle-drift-2', color: 'bg-cyan-400/30' },
      { left: 86, top: 24, size: 2, anim: 'animate-particle-drift-1', color: 'bg-cyan-400/25' },
    ],
  },
  join: {
    gridAnim: 'animate-grid-drift-y',
    glowColor: 'rgba(34,211,238,0.07)',
    glowPosition: 'left-1/2 top-0',
    pulseSpeed1: 'animate-trace-pulse-b',
    pulseSpeed2: 'animate-trace-pulse-a',
    accentOrange: true,
    particles: [
      { left: 22, top: 28, size: 2.5, anim: 'animate-particle-drift-1', color: 'bg-cyan-400/35' },
      { left: 78, top: 38, size: 2.5, anim: 'animate-particle-drift-2', color: 'bg-orange-400/30' },
      { left: 48, top: 76, size: 1.5, anim: 'animate-particle-drift-1', color: 'bg-cyan-300/25' },
    ],
  },
};

function SectionBackground({ variant = 'events' }) {
  const config = SECTION_BG_CONFIGS[variant] || SECTION_BG_CONFIGS.events;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
      {/* Faint radial glow with subtle ambient breathing */}
      <div
        className={`absolute ${config.glowPosition} h-[min(50vw,480px)] w-[min(70vw,680px)] rounded-full animate-ambient-breathe opacity-70`}
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${config.glowColor} 0%, transparent 70%)` }}
      />
      {/* Micro technical grid with continuous seamless drift */}
      <div
        className={`absolute inset-0 bg-tech-grid ${config.gridAnim} opacity-[0.11] md:opacity-[0.14]`}
      />
      {/* Left edge dynamic circuit trace */}
      <svg
        viewBox="0 0 220 600"
        className="absolute left-0 top-1/4 h-2/3 w-32 md:w-52 opacity-40 md:opacity-55"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base circuit paths */}
        <path d="M0 80 H80 L120 120 H200" stroke="rgba(34,211,238,0.18)" strokeWidth="1" strokeLinecap="round" />
        <path d="M0 220 H60 L100 260 H180" stroke="rgba(34,211,238,0.22)" strokeWidth="1" strokeLinecap="round" strokeDasharray="6 4" className="animate-bus-stream" />
        <path d="M0 380 H90 L130 340 H200" stroke="rgba(34,211,238,0.18)" strokeWidth="1" strokeLinecap="round" />

        {/* Traveling signal pulses */}
        <path
          d="M0 80 H80 L120 120 H200"
          stroke="#22d3ee"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="36 300"
          className={config.pulseSpeed1}
        />
        <path
          d="M0 380 H90 L130 340 H200"
          stroke={config.accentOrange ? "#fb923c" : "#22d3ee"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="36 300"
          className={config.pulseSpeed2}
        />

        {/* Pulsing connection nodes & ping rings */}
        <circle cx="200" cy="120" r="2.5" fill="#22d3ee" className="animate-node-pulse-cyan" />
        <circle cx="200" cy="120" r="2.5" fill="none" stroke="#22d3ee" strokeWidth="1" className="animate-node-ping" />

        <circle cx="180" cy="260" r="2" fill="#22d3ee" className="animate-node-pulse-cyan" style={{ animationDelay: '1.8s' }} />

        <circle
          cx="200"
          cy="340"
          r="2.5"
          fill={config.accentOrange ? "#fb923c" : "#22d3ee"}
          className={config.accentOrange ? "animate-node-pulse-orange" : "animate-node-pulse-cyan"}
          style={{ animationDelay: '2.5s' }}
        />
        <circle
          cx="200"
          cy="340"
          r="2.5"
          fill="none"
          stroke={config.accentOrange ? "#fb923c" : "#22d3ee"}
          strokeWidth="1"
          className="animate-node-ping"
          style={{ animationDelay: '2.5s' }}
        />
      </svg>
      {/* Right edge dynamic circuit trace (mirrored) */}
      <svg
        viewBox="0 0 220 600"
        className="absolute right-0 top-1/4 h-2/3 w-32 md:w-52 opacity-40 md:opacity-55"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base circuit paths */}
        <path d="M220 80 H140 L100 120 H20" stroke="rgba(34,211,238,0.18)" strokeWidth="1" strokeLinecap="round" />
        <path d="M220 220 H160 L120 260 H40" stroke="rgba(34,211,238,0.22)" strokeWidth="1" strokeLinecap="round" strokeDasharray="6 4" className="animate-bus-stream" />
        <path d="M220 380 H130 L90 340 H20" stroke="rgba(34,211,238,0.18)" strokeWidth="1" strokeLinecap="round" />

        {/* Traveling signal pulses */}
        <path
          d="M220 80 H140 L100 120 H20"
          stroke="#22d3ee"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="36 300"
          className={config.pulseSpeed2}
        />
        <path
          d="M220 380 H130 L90 340 H20"
          stroke={config.accentOrange ? "#fb923c" : "#22d3ee"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="36 300"
          className={config.pulseSpeed1}
        />

        {/* Pulsing connection nodes & ping rings */}
        <circle cx="20" cy="120" r="2.5" fill="#22d3ee" className="animate-node-pulse-cyan" style={{ animationDelay: '1.2s' }} />
        <circle cx="20" cy="120" r="2.5" fill="none" stroke="#22d3ee" strokeWidth="1" className="animate-node-ping" style={{ animationDelay: '1.2s' }} />

        <circle cx="40" cy="260" r="2" fill="#22d3ee" className="animate-node-pulse-cyan" style={{ animationDelay: '2.8s' }} />

        <circle
          cx="20"
          cy="340"
          r="2.5"
          fill={config.accentOrange ? "#fb923c" : "#22d3ee"}
          className={config.accentOrange ? "animate-node-pulse-orange" : "animate-node-pulse-cyan"}
          style={{ animationDelay: '0.8s' }}
        />
        <circle
          cx="20"
          cy="340"
          r="2.5"
          fill="none"
          stroke={config.accentOrange ? "#fb923c" : "#22d3ee"}
          strokeWidth="1"
          className="animate-node-ping"
          style={{ animationDelay: '0.8s' }}
        />
      </svg>
      {/* Subtle floating telemetry micro-particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden hidden sm:block">
        {config.particles.map((p, idx) => (
          <div
            key={idx}
            className={`absolute rounded-full ${p.color} ${p.anim}`}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const heroParticles = [
  { x: 10, size: 2, startY: '85%', endY: '20%', duration: 15, delay: 0, maxOpacity: 0.5 },
  { x: 22, size: 1.5, startY: '75%', endY: '15%', duration: 19, delay: 3, maxOpacity: 0.4 },
  { x: 78, size: 2, startY: '80%', endY: '25%', duration: 16, delay: 1.5, maxOpacity: 0.45 },
  { x: 90, size: 1.5, startY: '90%', endY: '30%', duration: 17, delay: 4.5, maxOpacity: 0.5 },
  { x: 5, size: 2, startY: '70%', endY: '10%', duration: 22, delay: 2, maxOpacity: 0.35 },
  { x: 95, size: 2, startY: '85%', endY: '25%', duration: 18, delay: 5, maxOpacity: 0.4 },
];

function HeroBackground({ shouldReduceMotion }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {/* 1. Moving Technical Engineering Coordinate Grid */}
      <motion.div
        animate={shouldReduceMotion ? undefined : { backgroundPosition: ['0px 0px', '40px 40px'] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 bg-cross-grid opacity-35"
      />

      {/* 2. Soft Ambient Lab Depth Light */}
      <motion.div
        animate={shouldReduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.22, 0.34, 0.22] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-[44%] h-[min(82vw,800px)] w-[min(82vw,800px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.1)_0%,rgba(59,130,246,0.03)_45%,transparent_70%)]"
      />

      {/* 3. Subtle Horizontal Technical Scanning Beam */}
      {!shouldReduceMotion && (
        <motion.div
          animate={{ y: ['-10%', '115%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-transparent via-cyan-300/[0.035] to-transparent"
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-200/25 to-transparent" />
        </motion.div>
      )}

      {/* 4. Concentric Engineering & Robotics Orbital Rings */}
      <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2">
        {/* Outer Ring with Tracking Nodes */}
        <motion.div
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          className="aspect-square w-[min(90vw,840px)] rounded-full border border-cyan-200/[0.06]"
        >
          <span className="absolute -top-1 left-1/2 h-2 w-2 rounded-full bg-cyan-200/70 shadow-[0_0_16px_rgba(103,232,249,0.7)]" />
          <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 rounded-full bg-orange-400/60 shadow-[0_0_12px_rgba(251,146,60,0.6)]" />
        </motion.div>

        {/* Middle Ring - Counter-rotating dashed blueprint gimbal */}
        <motion.div
          animate={shouldReduceMotion ? undefined : { rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 m-auto aspect-square w-[min(72vw,660px)] rounded-full border border-dashed border-white/[0.05]"
        />

        {/* Inner Ring - Fine telemetry circle */}
        <motion.div
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 m-auto aspect-square w-[min(54vw,480px)] rounded-full border border-cyan-400/[0.04]"
        />
      </div>

      {/* 5. Left Flank Circuit Traces & Robotics Data Nodes (Hidden on mobile) */}
      <div className="absolute left-0 top-1/4 bottom-1/4 w-72 md:w-96 hidden md:block opacity-45">
        <svg viewBox="0 0 380 400" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60 H140 L190 110 H260 L280 130" stroke="rgba(34,211,238,0.22)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M0 160 H100 L150 210 H240" stroke="rgba(34,211,238,0.18)" strokeWidth="1" strokeDasharray="6 3" />
          <path d="M0 260 H80 L130 210 H170 L210 250 H290" stroke="rgba(34,211,238,0.2)" strokeWidth="1.2" />
          <path d="M0 340 H160 L200 300 H270" stroke="rgba(251,146,60,0.22)" strokeWidth="1" />
          
          <circle cx="280" cy="130" r="3" fill="#22d3ee" fillOpacity="0.4" stroke="rgba(34,211,238,0.6)" strokeWidth="1" />
          <circle cx="240" cy="210" r="2.5" fill="#22d3ee" fillOpacity="0.3" />
          <circle cx="290" cy="250" r="3.5" fill="#22d3ee" fillOpacity="0.5" stroke="rgba(34,211,238,0.7)" strokeWidth="1" />
          <circle cx="270" cy="300" r="2.5" fill="#fb923c" fillOpacity="0.4" stroke="rgba(251,146,60,0.6)" strokeWidth="1" />
          <circle cx="140" cy="60" r="2" fill="#22d3ee" fillOpacity="0.3" />
          <circle cx="130" cy="210" r="2" fill="#22d3ee" fillOpacity="0.3" />

          <line x1="190" y1="110" x2="240" y2="210" stroke="rgba(34,211,238,0.08)" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="240" y1="210" x2="210" y2="250" stroke="rgba(34,211,238,0.08)" strokeWidth="0.8" strokeDasharray="3 3" />
        </svg>

        <div className="absolute left-6 top-12 font-mono text-[8px] uppercase tracking-widest text-cyan-200/25">
          <span>BUS_01 // CLK: 120MHz</span>
        </div>
        <div className="absolute left-8 bottom-16 font-mono text-[8px] uppercase tracking-widest text-orange-200/25">
          <span>PWR // 3.3V [ROBOTICS]</span>
        </div>
      </div>

      {/* 6. Right Flank Circuit Traces & Engineering Telemetry (Hidden on mobile) */}
      <div className="absolute right-0 top-1/4 bottom-1/4 w-72 md:w-96 hidden md:block opacity-45">
        <svg viewBox="0 0 380 400" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M380 70 H240 L190 120 H120" stroke="rgba(34,211,238,0.22)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M380 170 H270 L220 220 H140" stroke="rgba(34,211,238,0.18)" strokeWidth="1" strokeDasharray="6 3" />
          <path d="M380 270 H290 L240 220 H200 L160 260 H90" stroke="rgba(34,211,238,0.2)" strokeWidth="1.2" />
          <path d="M380 330 H220 L180 290 H100" stroke="rgba(251,146,60,0.22)" strokeWidth="1" />

          <circle cx="120" cy="120" r="3" fill="#22d3ee" fillOpacity="0.4" stroke="rgba(34,211,238,0.6)" strokeWidth="1" />
          <circle cx="140" cy="220" r="2.5" fill="#22d3ee" fillOpacity="0.3" />
          <circle cx="90" cy="260" r="3.5" fill="#22d3ee" fillOpacity="0.5" stroke="rgba(34,211,238,0.7)" strokeWidth="1" />
          <circle cx="100" cy="290" r="2.5" fill="#fb923c" fillOpacity="0.4" stroke="rgba(251,146,60,0.6)" strokeWidth="1" />
          <circle cx="240" cy="70" r="2" fill="#22d3ee" fillOpacity="0.3" />

          <path d="M120 114 V126 M114 120 H126" stroke="rgba(34,211,238,0.4)" strokeWidth="0.8" />
        </svg>

        <div className="absolute right-6 top-14 font-mono text-[8px] text-right uppercase tracking-widest text-cyan-200/25">
          <span>AI_CORE // SYNAPSE_OK</span>
        </div>
        <div className="absolute right-8 bottom-14 font-mono text-[8px] text-right uppercase tracking-widest text-cyan-200/25">
          <span>SENSORS // ONLINE</span>
        </div>
      </div>

      {/* 7. Tiny Drifting Engineering Data Particles */}
      {!shouldReduceMotion && heroParticles.map((p, index) => (
        <motion.span
          key={index}
          animate={{ y: [p.startY, p.endY], opacity: [0, p.maxOpacity, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute rounded-full bg-cyan-200 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
          style={{ left: `${p.x}%`, width: `${p.size}px`, height: `${p.size}px` }}
        />
      ))}

      {/* 8. Laboratory Corner Coordinates & Calibration Marks (Desktop only) */}
      <div className="absolute inset-x-8 top-28 hidden items-center justify-between font-mono text-[8px] uppercase tracking-widest text-cyan-200/20 md:flex">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/50" />
          <span>[LAB_ID // 0xRX-77]</span>
        </div>
        <div className="flex items-center gap-2">
          <span>COORDS // 13.33° N, 77.10° E</span>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/50" />
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] scroll-mt-20 items-center justify-center overflow-hidden px-5 pb-16 pt-28 md:pt-32"
    >
      <HeroBackground shouldReduceMotion={shouldReduceMotion} />

      <motion.div
        initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center"
      >
        {/* Top Institutional Logos (SSAHE University + InUnity) */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mb-8 inline-flex items-center justify-center gap-5 rounded-full border border-white/[0.10] bg-[#050a15]/80 px-6 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md sm:mb-9 sm:gap-8 sm:px-9 sm:py-4 md:mb-10 md:gap-10 md:px-12 md:py-5"
        >
          <img
            src={photo('ssahe_university-7.webp')}
            alt="Sri Siddhartha Academy of Higher Education"
            width="300"
            height="72"
            className="h-10 w-auto max-w-[150px] object-contain brightness-95 filter transition duration-300 hover:brightness-110 sm:h-14 sm:max-w-[220px] md:h-16 md:max-w-[260px] lg:h-[4.25rem] lg:max-w-[300px]"
          />
          <span aria-hidden="true" className="h-8 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent sm:h-11 md:h-14" />
          <img
            src={photo('InUnity-Full-Logo-2.png')}
            alt="InUnity"
            width="260"
            height="64"
            className="h-9 w-auto max-w-[130px] object-contain brightness-95 filter transition duration-300 hover:brightness-110 sm:h-12 sm:max-w-[190px] md:h-14 md:max-w-[230px] lg:h-16 lg:max-w-[260px]"
          />
        </motion.div>

        {/* Central RezonX Hero Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex items-center justify-center sm:mb-8 md:mb-9"
        >
          <motion.div
            animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-cyan-200/25 bg-[#07101b]/80 p-2.5 shadow-[0_0_60px_rgba(34,211,238,0.18)] backdrop-blur-xl sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40"
          >
            {!shouldReduceMotion && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
                className="pointer-events-none absolute inset-1 rounded-full border border-cyan-200/20 border-t-cyan-300/60"
              />
            )}
            <img src={photo('RezonX_logo.jpeg')} alt="RezonX club logo" width="160" height="160" className="size-full rounded-full object-cover" />
          </motion.div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="mb-4 font-display text-[9px] font-bold uppercase tracking-[0.5em] text-cyan-200/70 sm:text-[10px] md:text-xs"
        >
          Aspirations Resonate Execution
        </motion.p>
        <h1 className="font-display text-[clamp(3.5rem,14vw,9rem)] font-black leading-[0.9] tracking-[0.06em] text-white">
          Rezon<span className="text-cyan-300 text-glow-cyan">X</span>
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/50 sm:text-base md:mt-8 md:text-lg">
          Innovation, technical learning, teamwork, and project development.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.8 }}
          className="mt-9 mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row md:mb-24"
        >
          <LiquidButton onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })} className="!border-cyan-300/30 !bg-cyan-300 !px-8 !py-4 !text-[#041016] hover:!bg-cyan-200">
            Join Our Club <ArrowUpRight size={16} />
          </LiquidButton>
          <a href="#about" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-7 py-4 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 transition hover:border-cyan-300/30 hover:text-white">
            Explore <ArrowDown size={14} />
          </a>
        </motion.div>
      </motion.div>
      <div className="absolute inset-x-0 bottom-4 border-y border-white/[0.04] py-3 md:bottom-6 md:py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-5 font-display text-[8px] font-bold uppercase tracking-[0.28em] text-cyan-100/55 sm:gap-8 sm:text-[10px] md:text-xs">
          <span>Innovation</span><span className="h-1 w-1 rounded-full bg-cyan-300/70" />
          <span>Technology</span><span className="h-1 w-1 rounded-full bg-cyan-300/70" />
          <span>Execution</span>
        </div>
      </div>
      <div className="absolute bottom-[3.5rem] left-1/2 -translate-x-1/2 font-display text-[8px] tracking-[0.5em] text-white/20 md:bottom-[4.5rem]">SCROLL TO EXPLORE</div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative scroll-mt-20 overflow-hidden py-24 md:py-32">
      <SectionBackground variant="about" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
        <SectionHeading eyebrow="About" title="About Our Club" />
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85 }}
          className="glow-card rounded-3xl p-7 md:p-10"
        >
          <div className="mb-6 h-px w-16 bg-cyan-300/70" />
          <p className="text-base leading-8 text-white/65 md:text-lg md:leading-9">
            Our club focuses on innovation, technical learning, teamwork, and project development. We organize workshops, hackathons, and participate in inter-college competitions. Our mission is to help students gain practical skills, leadership qualities, and industry exposure.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Statistics({ data }) {
  const stats = [
    { collection: data.members, value: data.members.data?.member_count, label: 'Members' },
    { collection: data.activityCount, value: data.activityCount.data, label: 'Events' },
    { collection: data.prizes, value: data.prizes.data?.value, label: 'Prizes Won' },
    { collection: data.projectCount, value: data.projectCount.data, label: 'Projects' },
  ];
  return (
    <section id="statistics" className="relative scroll-mt-20 overflow-hidden py-20 md:py-28">
      <SectionBackground variant="statistics" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading eyebrow="Club statistics" title="Club Statistics" />
        <div className="grid grid-cols-2 border-y border-white/[0.08] md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.7 }}
              className={`px-4 py-8 text-center md:py-12 ${index < 2 ? 'border-b border-white/[0.08] md:border-b-0' : ''} ${index % 2 === 0 ? 'md:border-r md:border-white/[0.08]' : ''} ${index < 3 ? 'md:border-r md:border-white/[0.08]' : ''}`}
            >
              {stat.collection.loading ? (
                <div className="font-display text-4xl font-black text-white/25 md:text-5xl">…</div>
              ) : stat.collection.error ? (
                <div className="font-display text-xs font-bold uppercase text-amber-100/60">Unavailable</div>
              ) : (
                <div className="font-display text-5xl font-black text-cyan-200 text-glow-cyan md:text-6xl"><AnimatedStatistic value={stat.value ?? 0} /></div>
              )}
              <p className="mt-3 font-display text-[9px] font-bold uppercase tracking-[0.25em] text-white/45 md:text-[10px]">{stat.label}</p>
              {stat.collection.error && <p className="mt-2 text-xs text-amber-100/50">{stat.collection.error}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ActivityCards({ collection, type, reverse = false }) {
  const items = collection.data ?? [];
  const shouldMarquee = items.length > 0;
  const cards = items.map((item, index) => {
    const localImage = activityImageFallbacks.get(titleKey(item.title));
    const image = resolveCmsImage(item.image_url, localImage ? photo(localImage) : null);
    const content = (
      <>
        {image && (
          <OptimizedCardImage
            src={image}
            alt={item.title}
            width={400}
            height={208}
            aspectRatio="400 / 208"
            containerClassName="relative h-52 w-full overflow-hidden bg-white/[0.02]"
            className="h-full w-full object-cover brightness-[0.72] transition duration-700 group-hover:scale-105 group-hover:brightness-100"
            overlay={<div className="absolute inset-0 bg-gradient-to-t from-[#07101b] to-transparent" />}
          />
        )}
        <div className="relative bg-gradient-to-b from-white/[0.025] to-transparent p-6">
          <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white transition-colors duration-300 group-hover:text-cyan-100">{item.title}</h3>
          {item.description && <p className="mt-3 text-sm leading-7 text-white/55">{item.description}</p>}
          {item.link && <span className="mt-5 inline-flex items-center gap-2 font-display text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-200">View details <ArrowUpRight size={13} /></span>}
        </div>
      </>
    );

    return (
      <motion.article
        key={item.id}
        initial={shouldMarquee ? false : { opacity: 0, y: 28 }}
        whileInView={shouldMarquee ? undefined : { opacity: 1, y: 0 }}
        whileHover={{ y: -7, scale: 1.01 }}
        viewport={shouldMarquee ? undefined : { once: true, margin: '-40px' }}
        transition={{ delay: (index % 3) * 0.08, duration: 0.7 }}
        className={`glow-card group overflow-hidden rounded-2xl shadow-[0_18px_50px_rgba(0,0,0,0.16)] ${shouldMarquee ? 'marquee-card' : ''}`}
      >
        {item.link ? <a href={item.link} target="_blank" rel="noopener noreferrer" className="block h-full">{content}</a> : content}
      </motion.article>
    );
  });

  return (
    <>
      <CollectionStatus collection={collection} empty={`No ${type.toLowerCase()} are currently published.`} />
      {!collection.loading && !collection.error && items.length > 0 && (
        shouldMarquee
          ? <CardMarquee duration={30} reverse={reverse}>{cards}</CardMarquee>
          : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{cards}</div>
      )}
    </>
  );
}

function Activities({ activities, highlights }) {
  return (
    <section id="activities" className="relative scroll-mt-20 overflow-hidden py-24 md:py-32">
      <SectionBackground variant="activities" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading eyebrow="Activities & events" title="Activities & Events" />
        <div className="mb-16">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-6 text-center font-display text-xs font-bold uppercase tracking-[0.3em] text-cyan-200/70">Activities</motion.p>
          <ActivityCards collection={activities} type="Activities" />
        </div>
        <div id="highlights" className="scroll-mt-24">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-6 text-center font-display text-xs font-bold uppercase tracking-[0.3em] text-cyan-200/70">Recent Highlights</motion.p>
          <ActivityCards collection={highlights} type="Recent Highlights" reverse />
        </div>
      </div>
    </section>
  );
}

function ProjectDialog({ project, onClose, initialAction, onInteractionUpdate }) {
  const projectId = getProjectInteractionId(project);
  const [likes, setLikes] = useState(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(null);
  const [likesError, setLikesError] = useState('');
  const [commentsError, setCommentsError] = useState('');
  const [actionError, setActionError] = useState('');
  const [liking, setLiking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const commentInputRef = useRef(null);
  const handleLikeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  async function refreshComments(supabase = getSupabaseClient()) {
    const { data, error } = await supabase
      .from('project_comments')
      .select('id, name, message, created_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    setComments(data ?? []);
    onInteractionUpdate?.(project, { comments: data?.length });
  }

  useEffect(() => {
    let isActive = true;

    async function loadInteractions() {
      if (!projectId) {
        const message = 'This CMS project has no verified RezonX text ID for likes and comments.';
        setLikesError(message);
        setCommentsError(message);
        return;
      }

      try {
        const supabase = getSupabaseClient();
        const visitorId = window.localStorage.getItem('rezonx_visitor_id');
        const [likeResult, duplicateResult, commentResult] = await Promise.all([
          supabase.from('project_likes').select('id', { count: 'exact', head: true }).eq('project_id', projectId),
          visitorId
            ? supabase.from('project_likes').select('id').eq('project_id', projectId).eq('visitor_id', visitorId).maybeSingle()
            : Promise.resolve({ data: null, error: null }),
          supabase.from('project_comments').select('id, name, message, created_at').eq('project_id', projectId).order('created_at', { ascending: true }),
        ]);
        if (!isActive) return;
        const likeError = likeResult.error ?? duplicateResult.error;
        if (likeError) {
          setLikesError(likeError.message);
        } else {
          setLikes(likeResult.count ?? 0);
          setLiked(Boolean(duplicateResult.data));
        }
        if (commentResult.error) {
          setCommentsError(commentResult.error.message);
        } else {
          setComments(commentResult.data ?? []);
        }
        onInteractionUpdate?.(project, {
          likes: likeError ? undefined : likeResult.count ?? 0,
          liked: likeError ? undefined : Boolean(duplicateResult.data),
          comments: commentResult.error ? undefined : commentResult.data?.length ?? 0,
        });
      } catch (error) {
        if (isActive) {
          const message = error instanceof Error ? error.message : 'Could not load project interactions.';
          setLikesError(message);
          setCommentsError(message);
        }
      }
    }

    loadInteractions();
    return () => {
      isActive = false;
    };
  }, [projectId, onInteractionUpdate, project]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  async function handleLike() {
    setActionError('');
    setLiking(true);
    try {
      if (!projectId) throw new Error('This CMS project has no verified RezonX text ID for likes.');
      const supabase = getSupabaseClient();
      let visitorId = window.localStorage.getItem('rezonx_visitor_id');
      if (!visitorId) {
        visitorId = window.crypto.randomUUID();
        window.localStorage.setItem('rezonx_visitor_id', visitorId);
      }

      const { data: existingLike, error: lookupError } = await supabase
        .from('project_likes')
        .select('id')
        .eq('project_id', projectId)
        .eq('visitor_id', visitorId)
        .maybeSingle();
      if (lookupError) throw lookupError;
      if (existingLike) {
        setLiked(true);
        onInteractionUpdate?.(project, { likes, liked: true, comments: comments?.length });
        return;
      }

      const { error: insertError } = await supabase
        .from('project_likes')
        .insert({ project_id: projectId, visitor_id: visitorId });
      if (insertError) throw insertError;

      setLiked(true);
      setLikes((count) => count === null ? null : count + 1);
      onInteractionUpdate?.(project, { likes: likes === null ? undefined : likes + 1, liked: true, comments: comments?.length });
    } catch (error) {
      setLikesError(error instanceof Error ? error.message : 'Could not load project likes.');
      setActionError(error instanceof Error ? error.message : 'Could not add your like.');
    } finally {
      setLiking(false);
    }
  }

  useEffect(() => {
    handleLikeRef.current = handleLike;
  });

  useEffect(() => {
    if (!initialAction) return undefined;
    const flipTimer = window.setTimeout(() => setIsFlipped(true), 450);
    return () => window.clearTimeout(flipTimer);
  }, [initialAction]);

  useEffect(() => {
    if (!isFlipped) return;
    if (initialAction === 'like') handleLikeRef.current?.();
    if (initialAction === 'comment') commentInputRef.current?.focus({ preventScroll: true });
  }, [initialAction, isFlipped]);

  async function handleComment(event) {
    event.preventDefault();
    setActionError('');
    setSubmitting(true);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();

    if (!name || !message) {
      setActionError('Name and comment are required.');
      setSubmitting(false);
      return;
    }

    try {
      if (!projectId) throw new Error('This CMS project has no verified RezonX text ID for comments.');
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('project_comments').insert({
        project_id: projectId,
        name,
        email: email || null,
        message,
      });
      if (error) throw error;
      formElement.reset();
      await refreshComments(supabase);
    } catch (error) {
      setCommentsError(error instanceof Error ? error.message : 'Could not load project comments.');
      setActionError(error instanceof Error ? error.message : 'Could not submit your comment.');
    } finally {
      setSubmitting(false);
    }
  }

  const techStack = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : typeof project.tech_stack === 'string'
      ? project.tech_stack.split(',').map((tech) => tech.trim()).filter(Boolean)
      : [];
  const projectImage = resolveCmsImage(project.image_url);
  const projectDate = project.created_at ? new Date(project.created_at) : null;
  const validProjectDate = projectDate && !Number.isNaN(projectDate.getTime());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-lenis-prevent
      className="fixed inset-0 z-[110] flex items-center justify-center overflow-hidden bg-[#03060c]/90 p-3 backdrop-blur-xl sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="project-flip-perspective w-full max-w-3xl" style={{ height: 'min(84svh, 760px)' }}>
        <motion.div
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.72, ease: [0.22, 0.68, 0, 1] }}
          className="project-flip-card relative h-full w-full"
        >
          <section
            className="project-flip-face absolute inset-0 flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#080d18] shadow-2xl"
            aria-label={`${project.title} project card`}
            aria-hidden={isFlipped}
            inert={isFlipped || undefined}
            style={{ pointerEvents: isFlipped ? 'none' : 'auto' }}
          >
            <div className="relative h-48 w-full shrink-0 overflow-hidden bg-white/[0.02] sm:h-60" style={{ aspectRatio: '800 / 240' }}>
              {projectImage && (
                <img
                  src={projectImage}
                  alt={project.title}
                  width={800}
                  height={240}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover brightness-75"
                  style={{ aspectRatio: '800 / 240' }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080d18] via-transparent to-transparent" />
              <button type="button" onClick={onClose} aria-label="Close project details" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition hover:border-cyan-200/30 hover:text-cyan-100">
                <X size={18} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 md:p-9" data-lenis-prevent>
              <p className="font-display text-[9px] font-bold uppercase tracking-[0.35em] text-cyan-200/70">Project</p>
              <h2 className="mt-3 font-display text-2xl font-black uppercase leading-tight text-white md:text-4xl">{project.title}</h2>
              {project.short_description && <p className="mt-4 text-base leading-7 text-white/70">{project.short_description}</p>}
              <div className="mt-7 flex flex-wrap items-center gap-3 border-y border-white/[0.08] py-4">
                <button type="button" onClick={handleLike} disabled={liking || liked || Boolean(likesError)} aria-pressed={liked} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-pink-300/30 hover:text-pink-200 disabled:cursor-not-allowed disabled:opacity-50">
                  <Heart size={16} className={liked ? 'fill-pink-300 text-pink-300' : ''} /> {likes === null ? 'Likes unavailable' : `${likes} ${likes === 1 ? 'Like' : 'Likes'}`}
                </button>
                <span className="inline-flex items-center gap-2 text-sm text-white/45"><MessageCircle size={16} /> {comments === null ? 'Comments unavailable' : `${comments.length} ${comments.length === 1 ? 'Comment' : 'Comments'}`}</span>
              </div>
              <button type="button" onClick={() => setIsFlipped(true)} className="mt-7 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/[0.06] px-5 py-3 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100 transition hover:border-cyan-200/40 hover:bg-cyan-200/[0.12]">
                Flip for details &amp; comments <ArrowUpRight size={14} />
              </button>
            </div>
          </section>

          <section
            className="project-flip-face project-flip-back absolute inset-0 flex flex-col overflow-hidden rounded-3xl border border-cyan-200/15 bg-[#080d18] shadow-2xl"
            aria-label={`${project.title} details and comments`}
            aria-labelledby="project-dialog-title"
            aria-hidden={!isFlipped}
            inert={!isFlipped || undefined}
            style={{ pointerEvents: isFlipped ? 'auto' : 'none' }}
          >
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.08] bg-[#080d18]/95 px-5 py-4 sm:px-7">
              <button type="button" onClick={() => setIsFlipped(false)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-display text-[9px] font-bold uppercase tracking-[0.16em] text-white/65 transition hover:border-cyan-200/30 hover:text-cyan-100">
                <ChevronLeft size={14} /> Back to project
              </button>
              <button type="button" onClick={onClose} aria-label="Close project interaction" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-cyan-200/30 hover:text-white">
                <X size={17} />
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7 md:p-9" data-lenis-prevent>
              <p className="font-display text-[9px] font-bold uppercase tracking-[0.35em] text-cyan-200/70">Project details</p>
              <h2 id="project-dialog-title" className="mt-3 font-display text-2xl font-black uppercase leading-tight text-white md:text-4xl">{project.title}</h2>
              {project.short_description && <p className="mt-4 text-base leading-7 text-white/70">{project.short_description}</p>}
              {project.description && <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/55">{project.description}</p>}
              {validProjectDate && <p className="mt-4 text-xs text-white/35">Added {projectDate.toLocaleDateString()}</p>}
              {techStack.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {techStack.map((tech) => <span key={tech} className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.04] px-3 py-1.5 text-xs text-cyan-100/70">{tech}</span>)}
                </div>
              )}
              <div className="mt-7 flex flex-wrap items-center gap-3 border-y border-white/[0.08] py-4">
                <button type="button" onClick={handleLike} disabled={liking || liked || Boolean(likesError)} aria-pressed={liked} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-pink-300/30 hover:text-pink-200 disabled:cursor-not-allowed disabled:opacity-50">
                  <Heart size={16} className={liked ? 'fill-pink-300 text-pink-300' : ''} /> {likes === null ? 'Likes unavailable' : `${likes} ${likes === 1 ? 'Like' : 'Likes'}`}
                </button>
                <span className="inline-flex items-center gap-2 text-sm text-white/45"><MessageCircle size={16} /> {comments === null ? 'Comments unavailable' : `${comments.length} ${comments.length === 1 ? 'Comment' : 'Comments'}`}</span>
              </div>
              {likesError && <p role="status" className="mt-4 text-sm text-amber-100/65">Project likes unavailable: {likesError}</p>}
              {commentsError && <p role="status" className="mt-4 text-sm text-amber-100/65">Project comments unavailable: {commentsError}</p>}
              {actionError && <p role="alert" className="mt-4 text-sm text-rose-200/80">{actionError}</p>}
              <form onSubmit={handleComment} className="mt-6 grid gap-3">
                <label className="sr-only" htmlFor="project-comment-name">Name</label>
                <input id="project-comment-name" name="name" required placeholder="Your name" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-200/30" />
                <label className="sr-only" htmlFor="project-comment-email">Email (optional)</label>
                <input id="project-comment-email" name="email" type="email" placeholder="Email (optional)" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-200/30" />
                <label className="sr-only" htmlFor="project-comment-message">Comment</label>
                <textarea ref={commentInputRef} id="project-comment-message" name="message" required rows={3} placeholder="Add a comment" className="resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-200/30" />
                <button type="submit" disabled={submitting || Boolean(commentsError)} className="inline-flex items-center justify-center gap-2 justify-self-end rounded-full bg-cyan-300 px-5 py-3 font-display text-[9px] font-black uppercase tracking-[0.2em] text-[#041016] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50">
                  {submitting ? 'Submitting…' : 'Submit comment'} <Send size={13} />
                </button>
              </form>
              <div className="mt-8 space-y-4">
                {(comments ?? []).map((comment) => (
                  <article key={comment.id} className="border-l border-cyan-200/20 pl-4">
                    <p className="text-sm font-semibold text-white/80">{comment.name}</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-white/50">{comment.message}</p>
                    {comment.created_at && <time className="mt-2 block text-[10px] text-white/30">{new Date(comment.created_at).toLocaleDateString()}</time>}
                  </article>
                ))}
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Projects({ collection }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [interactionSummaries, setInteractionSummaries] = useState({});
  const projects = collection.data ?? [];
  const shouldMarquee = projects.length > 0;
  const trackRef = useRef(null);
  const groupRef = useRef(null);
  const seekFrameRef = useRef(0);

  const updateInteractionSummary = useCallback((project, summary) => {
    const availableValues = Object.fromEntries(
      Object.entries(summary).filter(([, value]) => value !== undefined && value !== null),
    );
    setInteractionSummaries((current) => ({
      ...current,
      [project.title]: { ...current[project.title], ...availableValues },
    }));
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadProjectInteractionCounts() {
      const mappedProjects = (collection.data ?? [])
        .map((project) => ({ project, projectId: getProjectInteractionId(project) }))
        .filter(({ projectId }) => projectId);
      if (!mappedProjects.length) return;

      try {
        const supabase = getSupabaseClient();
        const visitorId = window.localStorage.getItem('rezonx_visitor_id');
        await Promise.all(mappedProjects.map(async ({ project, projectId }) => {
          const [likeResult, duplicateResult, commentResult] = await Promise.all([
            supabase.from('project_likes').select('id', { count: 'exact', head: true }).eq('project_id', projectId),
            visitorId
              ? supabase.from('project_likes').select('id').eq('project_id', projectId).eq('visitor_id', visitorId).maybeSingle()
              : Promise.resolve({ data: null, error: null }),
            supabase.from('project_comments').select('id', { count: 'exact', head: true }).eq('project_id', projectId),
          ]);
          if (!isActive) return;

          updateInteractionSummary(project, {
            likes: !likeResult.error && !duplicateResult.error ? likeResult.count ?? 0 : undefined,
            liked: !likeResult.error && !duplicateResult.error ? Boolean(duplicateResult.data) : undefined,
            comments: !commentResult.error ? commentResult.count ?? 0 : undefined,
          });
        }));
      } catch (error) {
        console.error('Could not load project interaction counts.', error);
      }
    }

    loadProjectInteractionCounts();
    return () => {
      isActive = false;
    };
  }, [collection.data, updateInteractionSummary]);

  useEffect(() => () => cancelAnimationFrame(seekFrameRef.current), []);

  const navigateProjects = useCallback((direction) => {
    if (!shouldMarquee || !trackRef.current || !groupRef.current) return;
    const animation = trackRef.current.getAnimations()[0];
    const card = groupRef.current.querySelector('.marquee-card');
    if (!card) return;
    const groupWidth = groupRef.current.getBoundingClientRect().width;
    const step = card.getBoundingClientRect().width + Number.parseFloat(getComputedStyle(groupRef.current).gap || '0');
    if (!groupWidth || !step) return;

    cancelAnimationFrame(seekFrameRef.current);
    const duration = Number(animation?.effect?.getComputedTiming().duration);
    const currentTime = Number(animation?.currentTime);
    if (animation && Number.isFinite(duration) && Number.isFinite(currentTime)) {
      animation.pause();
      const normalizedTime = ((currentTime % duration) + duration) % duration;
      const offset = duration * (step / groupWidth) * direction;
      const from = normalizedTime + (direction < 0 && normalizedTime + offset < 0 ? duration : 0);
      const to = from + offset;
      const startedAt = performance.now();
      const seekDuration = 360;

      const seek = (now) => {
        const progress = Math.min(1, (now - startedAt) / seekDuration);
        const eased = 1 - Math.pow(1 - progress, 3);
        animation.currentTime = from + (to - from) * eased;
        if (progress < 1) {
          seekFrameRef.current = requestAnimationFrame(seek);
        } else {
          animation.play();
        }
      };
      seekFrameRef.current = requestAnimationFrame(seek);
      return;
    }

    const track = trackRef.current;
    const matrix = new DOMMatrixReadOnly(getComputedStyle(track).transform);
    const fromX = matrix.m41;
    const toX = fromX - step * direction;
    const fallbackAnimation = track.animate(
      [{ transform: `translateX(${fromX}px)` }, { transform: `translateX(${toX}px)` }],
      { duration: 360, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    );
    fallbackAnimation.onfinish = () => {
      track.style.transform = `translateX(${toX}px)`;
    };
  }, [shouldMarquee]);

  const cards = projects.map((project, index) => {
    const summary = interactionSummaries[project.title];
    const interactionIdAvailable = Boolean(getProjectInteractionId(project));

    return (
      <motion.article
        key={project.title}
        initial={shouldMarquee ? false : { opacity: 0, y: 24 }}
        whileInView={shouldMarquee ? undefined : { opacity: 1, y: 0 }}
        whileHover={{ y: -7, scale: 1.01 }}
        viewport={shouldMarquee ? undefined : { once: true, margin: '-40px' }}
        transition={{ delay: (index % 2) * 0.08, duration: 0.7 }}
        className={`glow-card group relative overflow-hidden rounded-2xl shadow-[0_18px_50px_rgba(0,0,0,0.16)] ${shouldMarquee ? 'marquee-card' : ''}`}
      >
        <button
          type="button"
          onClick={() => {
            setSelectedProject(project);
            setSelectedAction(null);
          }}
          className="relative z-10 block w-full bg-gradient-to-b from-white/[0.025] to-transparent p-6 text-left md:p-8"
        >
          {resolveCmsImage(project.image_url) && (
            <OptimizedCardImage
              src={resolveCmsImage(project.image_url)}
              alt={project.title}
              width={400}
              height={208}
              aspectRatio="400 / 208"
              containerClassName="mb-6 h-52 w-full overflow-hidden rounded-xl bg-white/[0.02]"
              className="h-full w-full object-cover brightness-[0.68] transition duration-700 group-hover:scale-105 group-hover:brightness-100"
            />
          )}
          <span className="font-display text-xs font-bold tracking-[0.25em] text-cyan-300/70">0{index + 1}</span>
          <h3 className="mt-4 font-display text-lg font-black uppercase leading-snug tracking-wide text-white transition-colors duration-300 group-hover:text-cyan-100 md:text-xl">{project.title}</h3>
          {project.short_description && <p className="mt-3 text-sm leading-7 text-white/65">{project.short_description}</p>}
          <span className="mt-5 inline-flex items-center gap-2 font-display text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-200/70">Project details <ArrowUpRight size={13} /></span>
        </button>
        <div className="flex items-center gap-2 border-t border-white/[0.07] px-5 py-3 md:px-7">
          <motion.button
            type="button"
            aria-label={summary?.liked ? `Liked ${project.title}` : `Like ${project.title}`}
            aria-pressed={Boolean(summary?.liked)}
            title={interactionIdAvailable ? 'Like this project' : 'Open project details to see interaction availability'}
            onClick={() => {
              setSelectedProject(project);
              setSelectedAction('like');
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-xs transition-colors duration-300 ${
              summary?.liked
                ? 'border-pink-300/30 bg-pink-300/[0.08] text-pink-200'
                : 'border-white/[0.08] text-white/50 hover:border-pink-300/25 hover:bg-pink-300/[0.05] hover:text-pink-200'
            }`}
          >
            <Heart size={14} className={summary?.liked ? 'fill-current' : ''} />
            {summary?.likes !== undefined && <span>{summary.likes}</span>}
            <span className="sr-only">Like</span>
          </motion.button>
          <motion.button
            type="button"
            aria-label={`View comments for ${project.title}${summary?.comments !== undefined ? ` (${summary.comments})` : ''}`}
            title={summary?.comments !== undefined ? `${summary.comments} comments` : 'Open project comments'}
            onClick={() => {
              setSelectedProject(project);
              setSelectedAction('comment');
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/[0.08] px-3 text-xs text-white/50 transition-colors duration-300 hover:border-cyan-200/25 hover:bg-cyan-200/[0.05] hover:text-cyan-100"
          >
            <MessageCircle size={14} />
            {summary?.comments !== undefined && <span>{summary.comments}</span>}
            <span className="sr-only">Comments</span>
          </motion.button>
          {!interactionIdAvailable && <span className="ml-auto text-[9px] text-white/25">Interactions in details</span>}
        </div>
      </motion.article>
    );
  });

  return (
    <section id="projects" className="relative scroll-mt-20 overflow-hidden py-24 md:py-32">
      <SectionBackground variant="projects" />
      <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.05),transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading eyebrow="Projects" title="Projects" />
        <CollectionStatus collection={collection} empty="No projects are currently published." />
        {!collection.loading && !collection.error && projects.length > 0 && (
          <>
            <div className="mb-4 flex justify-end gap-2">
              <motion.button
                type="button"
                aria-label="Previous projects"
                onClick={() => navigateProjects(-1)}
                disabled={!shouldMarquee}
                whileHover={shouldMarquee ? { scale: 1.06 } : undefined}
                whileTap={shouldMarquee ? { scale: 0.94 } : undefined}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-cyan-200/30 hover:bg-cyan-200/[0.06] hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </motion.button>
              <motion.button
                type="button"
                aria-label="Next projects"
                onClick={() => navigateProjects(1)}
                disabled={!shouldMarquee}
                whileHover={shouldMarquee ? { scale: 1.06 } : undefined}
                whileTap={shouldMarquee ? { scale: 0.94 } : undefined}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-cyan-200/30 hover:bg-cyan-200/[0.06] hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </motion.button>
            </div>
            {shouldMarquee
              ? <CardMarquee trackRef={trackRef} groupRef={groupRef} interactiveDuplicates duration={30}>{cards}</CardMarquee>
              : <div className="grid gap-4 md:grid-cols-2">{cards}</div>}
          </>
        )}
      </div>
      <AnimatePresence>
        {selectedProject && (
          <ProjectDialog
            project={selectedProject}
            initialAction={selectedAction}
            onInteractionUpdate={updateInteractionSummary}
            onClose={() => {
              setSelectedProject(null);
              setSelectedAction(null);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function Achievements({ collection }) {
  const achievements = collection.data ?? [];

  return (
    <section id="achievements" className="relative scroll-mt-20 overflow-hidden py-24 md:py-32">
      <SectionBackground variant="achievements" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading eyebrow="Achievements" title="Achievement Highlights" />
        <CollectionStatus collection={collection} empty="No achievements are currently published." />
        {!collection.loading && !collection.error && achievements.length > 0 && <div className="grid gap-5 md:grid-cols-3">
          {achievements.map((achievement, index) => {
            const localImage = achievementImageFallbacks.get(titleKey(achievement.title));
            const image = resolveCmsImage(achievement.image_url, localImage ? photo(localImage) : null);
            return (
            <motion.article
              key={achievement.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -7, scale: 1.015 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.1, duration: 0.7 }}
              className="glow-card group relative overflow-hidden rounded-2xl shadow-[0_18px_50px_rgba(0,0,0,0.16)]"
            >
              {image && <div className="relative h-56 overflow-hidden">
                <img src={image} alt={achievement.title} loading="lazy" className="h-full w-full object-cover brightness-[0.78] transition duration-700 group-hover:scale-105 group-hover:brightness-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07101b]/70 via-transparent to-transparent" />
              </div>}
              <div className="relative bg-gradient-to-b from-white/[0.025] to-transparent p-6">
                <h3 className="font-display text-sm font-bold leading-6 text-white transition-colors duration-300 group-hover:text-cyan-100 md:text-base">{achievement.title}</h3>
                {achievement.description && <p className="mt-3 text-sm leading-6 text-white/55">{achievement.description}</p>}
              </div>
            </motion.article>
            );
          })}
        </div>}
      </div>
    </section>
  );
}

function Gallery({ collection, onSelectAlbum }) {
  const albumsByName = new Map();
  (collection.data ?? []).forEach((image) => {
    const name = image.event_name || image.title || 'Uncategorized Album';
    if (!albumsByName.has(name)) albumsByName.set(name, []);
    albumsByName.get(name).push(image);
  });
  const albums = [...albumsByName.entries()].map(([name, images]) => ({
    title: name,
    images,
    cover: images.find((image) => image.is_cover) ?? images[0],
  }));
  const shouldMarquee = albums.length >= 4;
  const cards = albums.map((album) => (
    <motion.button
      key={album.title}
      type="button"
      onClick={() => onSelectAlbum(album)}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      className={`glow-card group relative h-64 overflow-hidden rounded-2xl text-left shadow-[0_18px_50px_rgba(0,0,0,0.2)] md:h-80 ${shouldMarquee ? 'marquee-card' : ''}`}
    >
      {resolveCmsImage(album.cover.image_url) && <img src={resolveCmsImage(album.cover.image_url)} alt={album.cover.title || album.title} loading="lazy" className="h-full w-full object-cover brightness-[0.58] transition duration-700 group-hover:scale-105 group-hover:brightness-90" />}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050812] via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between border-t border-white/[0.08] bg-gradient-to-t from-[#050812]/90 to-transparent p-6">
        <span className="font-display text-lg font-black tracking-[0.08em] text-white transition-colors duration-300 group-hover:text-cyan-100">{album.title}</span>
        <ArrowUpRight className="text-cyan-200 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" size={20} />
      </div>
    </motion.button>
  ));

  return (
    <section id="gallery" className="relative scroll-mt-20 overflow-hidden py-24 md:py-32">
      <SectionBackground variant="gallery" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading eyebrow="Gallery" title="Gallery" />
        <CollectionStatus collection={collection} empty="No gallery photos are currently published." />
        {!collection.loading && !collection.error && albums.length > 0 && (
          shouldMarquee
            ? <CardMarquee>{cards}</CardMarquee>
            : <div className="grid gap-5 md:grid-cols-3">{cards}</div>
        )}
      </div>
    </section>
  );
}

function GalleryModal({ album, onClose }) {
  useEffect(() => {
    if (!album) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [album, onClose]);

  return (
    <AnimatePresence>
      {album && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] overflow-y-auto bg-[#03060c]/95 p-5 backdrop-blur-xl md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={`${album.title} gallery`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <button type="button" onClick={onClose} aria-label="Close gallery" className="fixed right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white hover:border-cyan-300/40">
            <X size={18} />
          </button>
          <div className="mx-auto max-w-6xl py-10">
            <p className="mb-8 font-display text-center text-2xl font-black uppercase tracking-[0.2em] text-white">{album.title}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {album.images.map((image) => image.image_url && (
                <img key={image.id} src={resolveCmsImage(image.image_url)} alt={image.title || album.title} className="max-h-[70vh] w-full rounded-xl object-cover" />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Join() {
  return (
    <section id="join" className="relative scroll-mt-20 overflow-hidden py-24 md:py-32">
      <SectionBackground variant="join" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.08),transparent_65%)]" />
      <div className="relative mx-auto max-w-5xl px-5 text-center">
        <SectionHeading eyebrow="Join" title="Ready to Build Something Extraordinary?" />
        <a href="https://forms.gle/6BAj9EvfC3Y6bKty5" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 rounded-full border border-cyan-300/30 bg-cyan-300 px-8 py-4 font-display text-xs font-black uppercase tracking-[0.2em] text-[#041016] transition hover:bg-cyan-200">
          Click here <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08]">
      <div className="dot-matrix pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 text-center sm:flex-row sm:text-left md:px-8">
        <a href="#home" className="font-display text-lg font-black tracking-[0.12em] text-white">REZON<span className="text-cyan-300">X</span></a>
        <p className="text-xs text-white/40">© 2026 RezonX Club | Designed for Innovation</p>
        <a href="#home" className="font-display text-[9px] font-bold uppercase tracking-[0.2em] text-white/45 transition hover:text-cyan-200">Back to top ↑</a>
      </div>
    </footer>
  );
}

function App() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return window.sessionStorage.getItem('rezonx-intro-seen') !== 'true';
    } catch {
      return true;
    }
  });
  const data = useRezonxData();
  const completeIntro = useCallback(() => {
    try {
      window.sessionStorage.setItem('rezonx-intro-seen', 'true');
    } catch (error) {
      console.warn('Unable to persist the intro dismissal.', error);
    }
    setShowIntro(false);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {showIntro && <SplashIntro onComplete={completeIntro} />}
      </AnimatePresence>
      <SmoothScroll />
      <InteractiveBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Statistics data={data} />
        <FeaturedEvent collection={data.events} />
        <Activities activities={data.activities} highlights={data.highlights} />
        <Projects collection={data.projects} />
        <Achievements collection={data.achievements} />
        <Gallery collection={data.gallery} onSelectAlbum={setSelectedAlbum} />
        <Join />
      </main>
      <Footer />
      <GalleryModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
    </MotionConfig>
  );
}

export default App;

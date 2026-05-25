'use client';

import { useEffect, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import { Sparkles, Music, Music2, ChevronRight, Palette, Heart, Star, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { defaultPrices } from '@/data/prices';
import { defaultGallery, type GalleryItem } from '@/data/gallery';
import { defaultCompletedCommissions, type CompletedCommission } from '@/data/commissions';
import { defaultLinks } from '@/data/links';
import { defaultSettings } from '@/data/settings';
import { formatPrice } from '@/lib/utils';

const categoryLabels: Record<string, string> = {
  'fully-render': 'fullyRender',
  'flat-colors': 'flatColors',
  reference: 'refSheet',
};

export default function HomePage() {
  const { lang, setLang, t } = useLanguage();
  const [musicOn, setMusicOn] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(defaultGallery);
  const [completedCommissions, setCompletedCommissions] = useState<CompletedCommission[]>(defaultCompletedCommissions);

  const primaryLink = defaultLinks.find((link) => link.primary && link.active) ?? defaultLinks.find((link) => link.active);
  const activeLinks = defaultLinks.filter((link) => link.active);
  const activeGallery = galleryItems.filter((item) => item.active && (galleryFilter === 'all' || item.category === galleryFilter));
  const activeCompletedCommissions = completedCommissions.filter((item) => item.active);

  const groupedPrices = useMemo(() => {
    return defaultPrices
      .filter((item) => item.active)
      .sort((a, b) => a.order - b.order)
      .reduce<Record<string, typeof defaultPrices>>((acc, item) => {
        acc[item.category] ??= [];
        acc[item.category].push(item);
        return acc;
      }, {});
  }, []);

  useEffect(() => {
    let mounted = true;

    fetch('/api/content', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((content: { gallery?: GalleryItem[]; completed?: CompletedCommission[] } | null) => {
        if (!mounted || !content) return;
        if (Array.isArray(content.gallery)) setGalleryItems(content.gallery);
        if (Array.isArray(content.completed)) setCompletedCommissions(content.completed);
      })
      .catch(() => {
        // Keep bundled defaults visible if the database is not configured yet.
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gsap-hero', { opacity: 0, y: 28, duration: 0.9, stagger: 0.12, ease: 'power3.out' });
      gsap.to('.orb', { y: -18, x: 8, duration: 3.8, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.3 });
      gsap.to('.mascot-float', { y: -16, rotate: 2, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.balloon', { y: -20, rotate: 4, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.16 });
      gsap.from('.gsap-card', { opacity: 0, y: 28, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: undefined });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const audio = document.getElementById('site-music') as HTMLAudioElement | null;
    if (!audio) return;
    if (musicOn) audio.play().catch(() => setMusicOn(false));
    else audio.pause();
  }, [musicOn]);

  return (
    <main className="min-h-screen overflow-hidden">
      <audio id="site-music" src={defaultSettings.musicPath} loop />

      <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 rounded-full glass px-4 py-3 shadow-cute">
        <nav className="flex items-center justify-between gap-3">
          <a href="#home" className="font-display text-sm text-ink sm:text-lg">{defaultSettings.logoText}</a>
          <div className="hidden items-center gap-5 text-sm font-extrabold text-ink/80 md:flex">
            <a href="#prices" className="hover:text-pistachio-purple">{t.nav.prices}</a>
            <a href="#gallery" className="hover:text-pistachio-purple">{t.nav.gallery}</a>
            <a href="#completed" className="hover:text-pistachio-purple">{t.nav.completed}</a>
            <a href="#how" className="hover:text-pistachio-purple">{t.nav.howItWorks}</a>
            <a href="#tos" className="hover:text-pistachio-purple">{t.nav.tos}</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setMusicOn((v) => !v)} className="rounded-full bg-white/80 p-2 shadow-cute" aria-label="Toggle music">
              {musicOn ? <Music2 size={18} /> : <Music size={18} />}
            </button>
            <button onClick={() => setLang(lang === 'en' ? 'pt' : 'en')} className="rounded-full bg-pistachio-green px-3 py-2 text-xs font-black shadow-green">
              {lang === 'en' ? 'PT' : 'EN'}
            </button>
          </div>
        </nav>
      </header>

      <section id="home" className="hero-gradient relative min-h-screen px-5 pb-20 pt-32">
        <div className="orb absolute left-[8%] top-[18%] h-24 w-24 rounded-full bg-pistachio-green/50 blur-xl" />
        <div className="orb absolute right-[10%] top-[24%] h-32 w-32 rounded-full bg-pistachio-purple/30 blur-2xl" />
        <div className="orb absolute bottom-[10%] left-[30%] h-28 w-28 rounded-full bg-pistachio-pink/40 blur-2xl" />

        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="gsap-hero mb-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-black shadow-cute">
              <Sparkles size={16} /> {defaultSettings.commissionsOpen ? t.hero.badge : t.nav.closed}
            </div>
            <h1 className="gsap-hero font-display text-5xl leading-tight text-ink sm:text-7xl lg:text-8xl">
              {t.hero.title.split(' ')[0]} <span className="text-gradient">{t.hero.title.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="gsap-hero mt-6 max-w-xl text-lg font-bold leading-relaxed text-ink/75 sm:text-xl">{t.hero.subtitle}</p>
            <div className="gsap-hero mt-8 flex flex-wrap gap-3">
              <a href="#prices" className="shine-effect rounded-full bg-pistachio-purple px-6 py-3 font-black text-white shadow-cute-lg">{t.hero.viewPrices}</a>
              {primaryLink && <a href={primaryLink.url} className="rounded-full bg-white px-6 py-3 font-black text-ink shadow-cute" target="_blank">{t.hero.orderDiscord}</a>}
            </div>
          </div>

          <div className="gsap-hero relative mx-auto w-full max-w-md">
            <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 gap-3">
              <span className="balloon text-6xl">🎈</span><span className="balloon text-5xl">💜</span><span className="balloon text-6xl">🎈</span>
            </div>
            <div className="mascot-float relative mt-20 rounded-[2rem] border-4 border-white bg-white/70 p-6 shadow-cute-lg">
              <div className="absolute -right-4 -top-4 rounded-2xl bg-pistachio-yellow px-4 py-2 text-sm font-black shadow-cute">{t.mascot.speech}</div>
              <div className="grid place-items-center rounded-[1.5rem] bg-gradient-to-br from-pistachio-green via-pistachio-yellow to-pistachio-purple p-10 text-center">
                <div className="animate-float text-9xl drop-shadow-lg">🐾</div>
                <p className="mt-4 font-display text-2xl text-white drop-shadow">Pistache Pixel Container</p>
                <p className="mt-2 text-sm font-extrabold text-white/90">troque este bloco pelo sprite/frame animado em pixel art</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="prices" className="section-padding bg-pistachio-cream">
        <SectionTitle icon={<Palette />} title={t.prices.title} subtitle={t.prices.subtitle} />
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-3">
          {Object.entries(groupedPrices).map(([category, items]) => (
            <div key={category} className="gsap-card card-cute p-6">
              <h3 className="font-display text-2xl text-pistachio-purple">{t.prices[categoryLabels[category] as keyof typeof t.prices] as string}</h3>
              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="rounded-3xl bg-pistachio-cream p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-lg font-black">{t.prices[item.nameKey as keyof typeof t.prices] as string}</h4>
                        {item.tag && <span className={`tag-${item.tagType}`}>{item.tag}</span>}
                      </div>
                      <strong className="text-xl text-pistachio-purple">{formatPrice(item.price)}</strong>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-ink/65">{t.prices.descriptions[item.descriptionKey as keyof typeof t.prices.descriptions]}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery" className="section-padding bg-white">
        <SectionTitle icon={<Star />} title={t.gallery.title} subtitle={t.gallery.subtitle} />
        <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2">
          {Object.entries(t.gallery.filters).map(([key, label]) => (
            <button key={key} onClick={() => setGalleryFilter(key === 'refSheet' ? 'reference-sheet' : key)} className="rounded-full bg-pistachio-cream px-4 py-2 text-sm font-black shadow-cute hover:bg-pistachio-green">
              {label}
            </button>
          ))}
        </div>
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeGallery.map((item) => (
            <a key={item.id} href={item.src} target="_blank" className="gsap-card card-cute block overflow-hidden">
              <img src={item.src} alt={item.title} className="h-72 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-black">{item.title}</h3>
                <p className="text-sm font-bold text-pistachio-purple">{item.category}</p>
              </div>
            </a>
          ))}
        </div>
      </section>


      <section id="completed" className="section-padding bg-pistachio-cream">
        <SectionTitle icon={<Sparkles />} title={t.completed.title} subtitle={t.completed.subtitle} />
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeCompletedCommissions.map((item) => (
            <article key={item.id} className="gsap-card card-cute overflow-hidden">
              <a href={item.src} target="_blank" className="block">
                <img src={item.src} alt={item.title} className="h-80 w-full object-cover" />
              </a>
              <div className="p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="tag-popular">{t.completed.doneBadge}</span>
                  <span className="rounded-full bg-pistachio-green px-3 py-1 text-xs font-black text-ink">{item.category}</span>
                </div>
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-1 text-sm font-extrabold text-pistachio-purple">{t.completed.clientLabel}: {item.clientName}</p>
                <p className="mt-3 text-sm font-semibold text-ink/70">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="how" className="section-padding bg-white">
        <SectionTitle icon={<Heart />} title={t.howItWorks.title} subtitle={t.howItWorks.subtitle} />
        <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.howItWorks.steps.map((step, index) => (
            <div key={step.title} className="gsap-card card-cute p-6">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-pistachio-green font-display text-xl">{index + 1}</div>
              <h3 className="text-xl font-black">{step.title}</h3>
              <p className="mt-2 font-semibold text-ink/65">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tos" className="section-padding bg-pistachio-cream">
        <SectionTitle icon={<Sparkles />} title={t.tos.title} subtitle={t.tos.subtitle} />
        <div className="mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.tos.sections.map((section) => (
            <div key={section.title} className="gsap-card rounded-3xl border border-pistachio-purple/10 bg-pistachio-cream p-5 shadow-cute">
              <h3 className="font-black text-pistachio-purple">{section.title}</h3>
              <p className="mt-2 text-sm font-semibold text-ink/70">{section.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="section-padding bg-pistachio-purple text-white">
        <div className="mx-auto max-w-4xl text-center">
          <MessageCircle className="mx-auto mb-4" size={42} />
          <h2 className="font-display text-4xl sm:text-5xl">{t.contact.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-bold text-white/80">{t.contact.subtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {activeLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" className="rounded-full bg-white px-5 py-3 font-black text-ink shadow-cute hover:-translate-y-1 transition">
                <span className="mr-2">{link.icon}</span>{link.label}<ChevronRight className="ml-1 inline" size={16} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-ink px-5 py-8 text-center text-sm font-bold text-white/70">
        <p>{t.footer.copy}</p>
        <p className="mt-1">{t.footer.made}</p>
      </footer>
    </main>
  );
}

function SectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-pistachio-green text-ink shadow-green">{icon}</div>
      <h2 className="font-display text-4xl text-ink sm:text-5xl">{title}</h2>
      <p className="mt-3 text-lg font-bold text-ink/65">{subtitle}</p>
    </div>
  );
}

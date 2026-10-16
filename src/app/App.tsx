import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CustomEase } from "gsap/CustomEase"
import { startSplash } from "./splash"
import {
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Menu,
  X,
  MapPin,
  Phone,
  Snowflake,
  ShieldCheck,
  Wrench,
  ClipboardCheck,
  MessageCircle,
  Refrigerator,
  WashingMachine,
  ThermometerSnowflake,
  Droplets,
  Settings2,
  Clock3,
  CalendarCheck,
  Truck,
  Flame,
  CheckCircle2,
  Award,
  Sparkles,
} from "lucide-react"

// Prefixes public asset paths with the deploy base (e.g. /refrimax-lp/ on GitHub Pages)
const u = (path: string) => import.meta.env.BASE_URL.replace(/\/$/, "") + path

gsap.registerPlugin(ScrollTrigger, CustomEase)

// Strong ease-out: instant response, long settle (UI standard curve)
CustomEase.create("ui", "0.23, 1, 0.32, 1")

// Global CSS transitions on a/button fight GSAP's per-frame updates, so they
// are switched off for an element only while it is being tweened.
gsap.defaults({
  onStart(this: gsap.core.Tween) {
    this.targets().forEach((t) => t instanceof HTMLElement && (t.style.transition = "none"))
  },
  onComplete(this: gsap.core.Tween) {
    this.targets().forEach((t) => t instanceof HTMLElement && t.style.removeProperty("transition"))
  },
})

const phoneHref = "tel:+5548999216831"
const mapsHref =
  "https://www.google.com/maps/search/?api=1&query=Rua+Eduardo+Souto+700+Oper%C3%A1ria+Nova+Crici%C3%BAma+SC"

const whatsappUrl = (message: string) =>
  `https://wa.me/5548999216831?text=${encodeURIComponent(message)}`

const contact = whatsappUrl(
  "Olá, Refrimax! Gostaria de solicitar um orçamento para manutenção do meu equipamento.",
)

const nav = [
  ["Início", "inicio"],
  ["Tradição", "tradicao"],
  ["Equipamentos", "equipamentos"],
  ["Serviços", "servicos"],
  ["Como Funciona", "como-funciona"],
  ["Dúvidas", "duvidas"],
] as const

const equipment = [
  {
    title: "Geladeiras e Freezers",
    badge: "Residencial e Comercial",
    symptoms: ["Não gela", "Vazamento de água", "Barulho no motor"],
    message:
      "Olá, Refrimax! Gostaria de solicitar um orçamento para manutenção de geladeira ou freezer.",
    text: "Diagnóstico preciso em sistemas Frost Free, Inverter, Side by Side e freezers.",
    icon: Refrigerator,
    image: u("/assets/cozinha-refrigeracao.webp"),
  },
  {
    title: "Máquinas de Lavar",
    badge: "Lavadoras e Lava e Seca",
    symptoms: ["Não centrifuga", "Não drena água", "Painel piscando"],
    message:
      "Olá, Refrimax! Gostaria de solicitar um orçamento para manutenção de máquina de lavar.",
    text: "Conserto completo de lavadoras automáticas, tanquinhos e sistemas de centrifugação.",
    icon: WashingMachine,
    image: u("/assets/lavadora.webp"),
  },
  {
    title: "Micro-ondas e Fornos",
    badge: "Linha Cozinha",
    symptoms: ["Não aquece", "Prato parado", "Faíscas internas"],
    message:
      "Olá, Refrimax! Gostaria de solicitar um orçamento para manutenção de micro-ondas ou forno elétrico.",
    text: "Reparo de magnetron, placas eletrônicas, membranas, travas de segurança e resistências.",
    icon: Flame,
    image: u("/assets/microondas.webp"),
  },
  {
    title: "Expositores e Cervejeiras",
    badge: "Linha Comercial",
    symptoms: ["Oscilação térmica", "Borracha gasta", "Compressor"],
    message:
      "Olá, Refrimax! Gostaria de solicitar um orçamento para manutenção de expositor ou equipamento comercial.",
    text: "Refrigeração confiável à altura do seu comércio para não comprometer seu estoque.",
    icon: ThermometerSnowflake,
    image: u("/assets/expositor.webp"),
  },
  {
    title: "Bebedouros e Frigobares",
    badge: "Casa e Escritório",
    symptoms: ["Água natural", "Baixa vazão", "Termostato"],
    message:
      "Olá, Refrimax! Gostaria de solicitar um orçamento para manutenção de bebedouro ou frigobar.",
    text: "Higienização técnica, troca de elementos filtrantes, gás refrigerante e termostatos.",
    icon: Droplets,
    image: u("/assets/bebedouro.webp"),
  },
  {
    title: "Preventiva e Corretiva",
    badge: "Revisão Completa",
    symptoms: ["Alto consumo", "Revisão periódica", "Troca de peças"],
    message:
      "Olá, Refrimax! Gostaria de solicitar um orçamento para manutenção preventiva ou corretiva do meu equipamento.",
    text: "Do diagnóstico detalhado à substituição com peças originais e garantia de serviço.",
    icon: Wrench,
    image: u("/assets/carlosmoura-800.webp"),
  },
]

const benefits = [
  [
    Clock3,
    "Evite paradas inesperadas",
    "Identificar sinais de desgaste a tempo evita que pequenos ruídos se tornem queimas graves de compressor ou placa.",
  ],
  [
    Truck,
    "Buscamos e entregamos seu aparelho",
    "Frota utilitária própria preparada para o transporte seguro do seu eletrodoméstico em Criciúma e região.",
  ],
  [
    ClipboardCheck,
    "Diagnóstico transparente",
    "Avaliamos a causa real do defeito e apresentamos o orçamento com clareza antes de qualquer intervenção.",
  ],
  [
    Settings2,
    "Manutenção preventiva",
    "Limpeza técnica, verificação de gás, vedação e componentes para reduzir o consumo de energia e ampliar a vida útil.",
  ],
  [
    Wrench,
    "Manutenção corretiva com peças originais",
    "Reparos técnicos em multimarcas (Brastemp, Consul, Electrolux e mais) com componentes de procedência.",
  ],
  [
    MapPin,
    "Sede própria em Criciúma-SC",
    "Oficina estruturada no bairro Operária Nova e atendimento ágil em Criciúma e municípios vizinhos.",
  ],
] as const

// Background photo per benefit card (same order as `benefits`)
const benefitImages = [
  [u("/assets/card-3.webp"), "90% 50%"],
  [u("/assets/card-1.webp"), "50% 40%"],
  [u("/assets/card-3.webp"), "10% 50%"],
  [u("/assets/card-4.webp"), "50% 50%"],
  [u("/assets/card-2.webp"), "50% 15%"],
  [u("/assets/card-5.webp"), "50% 40%"],
] as const

const questions = [
  [
    "Quais equipamentos a Refrimax atende?",
    "Atendemos geladeiras, freezers, máquinas de lavar, micro-ondas, fornos elétricos, expositores comerciais, cervejeiras, bebedouros e frigobares. Para outros equipamentos, consulte nossa equipe pelo WhatsApp.",
  ],
  [
    "Quais marcas vocês atendem?",
    "Somos especializados nas principais marcas do mercado, incluindo Brastemp, Consul, Electrolux, entre outras. Informe a marca e o modelo do seu aparelho pelo WhatsApp para agilizarmos seu atendimento.",
  ],
  [
    "Vocês buscam e entregam o aparelho?",
    "Sim! Contamos com veículo utilitário próprio adaptado para buscar e entregar seu eletrodoméstico com total segurança e praticidade. Basta combinar o horário pelo WhatsApp.",
  ],
  [
    "Vocês fazem manutenção preventiva e corretiva?",
    "Sim. Realizamos tanto a manutenção preventiva (revisão, troca de borrachas, limpeza técnica e testes de eficiência) quanto a corretiva (conserto de aparelhos que pararam de funcionar ou apresentam falhas).",
  ],
  [
    "A Refrimax atende fora de Criciúma?",
    "Sim. Nossa sede fica no bairro Operária Nova em Criciúma-SC e atendemos Criciúma e toda a região próxima. Envie sua localização pelo WhatsApp para combinarmos a visita ou coleta.",
  ],
  [
    "Como solicitar um orçamento?",
    "Clique em qualquer botão de WhatsApp desta página, informe qual é o equipamento, a marca e o sintoma apresentado. Nossa equipe técnica responderá rapidamente com as orientações.",
  ],
] as const

function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path d="M12.03 2C6.51 2 2.02 6.49 2.02 12.01c0 1.77.46 3.49 1.34 5.01L2 22l5.12-1.34a9.97 9.97 0 0 0 4.91 1.3h.01c5.52 0 10.01-4.49 10.01-10.01C22.05 6.49 17.55 2 12.03 2Zm5.85 14.15c-.25.7-1.44 1.34-2.01 1.43-.52.08-1.19.12-1.93-.12-.45-.14-1.02-.33-1.76-.65-3.1-1.34-5.12-4.46-5.27-4.67-.15-.21-1.26-1.68-1.26-3.2 0-1.52.8-2.27 1.08-2.58.29-.31.63-.39.84-.39.21 0 .42 0 .6.01.19.01.45-.07.7.53.26.62.88 2.14.95 2.3.08.15.13.34.03.55-.1.21-.15.34-.31.52-.15.18-.32.4-.46.54-.15.15-.31.32-.13.63.18.31.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.49 1.53.31.15.49.13.67-.08.18-.21.77-.9.98-1.21.21-.31.41-.26.69-.15.29.1 1.81.85 2.12 1.01.31.15.52.23.59.36.08.13.08.75-.17 1.45Z" />
    </svg>
  )
}

function Logo({
  light = false,
  prominent = false,
}: {
  light?: boolean
  prominent?: boolean
}) {
  return (
    <a
      href="#inicio"
      aria-label="Refrimax — início"
      className={`inline-flex shrink-0 items-center ${prominent ? "pl-2 sm:pl-1" : ""}`}
    >
      <img
        src={light ? u("/assets/logo-white.svg") : u("/assets/ab860.svg")}
        alt="Refrimax Refrigeração"
        width="693"
        height="183"
        className={
          prominent
            ? "h-auto w-[132px] sm:w-[170px]"
            : "h-auto w-[155px] sm:w-[175px]"
        }
      />
    </a>
  )
}

function Whatsapp({
  children = "Solicitar orçamento pelo WhatsApp",
  className = "",
  href = contact,
}: {
  children?: React.ReactNode
  className?: string
  href?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`press inline-flex items-center justify-center gap-3 rounded-full bg-[var(--whatsapp-action)] px-6 py-4 text-base font-extrabold text-white shadow-[var(--shadow-cta)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--whatsapp-action-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 ${className}`}
    >
      <WhatsAppIcon className="size-5" />
      <span>{children}</span>
      <ArrowUpRight className="ml-0.5 size-4 shrink-0" />
    </a>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const [playMobileVideo, setPlayMobileVideo] = useState(false)
  const [slide, setSlide] = useState(0)
  const [marqueePaused, setMarqueePaused] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)
  const track = useRef<HTMLDivElement>(null)

  const onTrackScroll = () => {
    const el = track.current
    if (!el || !el.firstElementChild) return
    const step = (el.firstElementChild as HTMLElement).offsetWidth + 16
    setSlide(Math.min(equipment.length - 1, Math.round(el.scrollLeft / step)))
  }
  const goTo = (i: number) => {
    const el = track.current
    if (!el || !el.firstElementChild) return
    const step = (el.firstElementChild as HTMLElement).offsetWidth + 16
    const next = Math.max(0, Math.min(equipment.length - 1, i))
    el.scrollTo({
      left: next * step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    })
  }
  const mobileMenu = useRef<HTMLElement>(null)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection
    const calm = !conn?.saveData && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const update = () => {
      setIsDesktop(mq.matches && !conn?.saveData)
      setPlayMobileVideo(!mq.matches && calm)
    }
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  // Mobile menu: body lock, Esc to close, animated entrance
  useEffect(() => {
    if (!menuOpen) return
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false)
    window.addEventListener("keydown", onKey)
    const el = mobileMenu.current
    if (el && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: -12 },
        { autoAlpha: 1, y: 0, duration: 0.22, ease: "ui" },
      )
      gsap.from(el.querySelectorAll("a"), {
        x: -16,
        autoAlpha: 0,
        stagger: 0.04,
        duration: 0.28,
        delay: 0.04,
        ease: "ui",
      })
    }
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [menuOpen])

  // Loading splash (index.html) → releases the hero intro when it fades out
  useEffect(() => startSplash(() => intro.current?.play()), [])

  // Page animations (GSAP) — disabled for reduced-motion users
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Hero intro
      const tl = gsap.timeline({ paused: true, defaults: { ease: "ui" } })
      intro.current = tl
      tl
        .from("[data-hero='logo']", { y: -10, scale: 0.96, autoAlpha: 0, duration: 0.5 })
        .from("[data-hero='pill']", { y: -10, autoAlpha: 0, duration: 0.4 }, "<")
        .from("[data-hero='title']", { y: 20, autoAlpha: 0, duration: 0.6 }, "-=0.2")
        .from("[data-hero='tagline']", { y: 14, autoAlpha: 0, duration: 0.45 }, "-=0.3")
        .from("[data-hero='text']", { y: 14, autoAlpha: 0, duration: 0.5 }, "-=0.4")
        .from("[data-hero='cta'] > *", { y: 14, autoAlpha: 0, stagger: 0.07, duration: 0.45 }, "-=0.3")
        .from("[data-hero='trust'] > *", { y: 10, autoAlpha: 0, stagger: 0.05, duration: 0.4 }, "-=0.3")
        .from("[data-hero='media']", { autoAlpha: 0, scale: 1.03, duration: 0.7, ease: "ui" }, 0.15)

      // Scroll reveals
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 20,
          autoAlpha: 0,
          duration: 0.5,
          ease: "ui",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        })
      })
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => {
        gsap.from(el.children, {
          y: 20,
          autoAlpha: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "ui",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        })
      })

      // Count-up for the "+35" metric
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count)
        const state = { v: 0 }
        gsap.to(state, {
          v: end,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = String(Math.round(state.v))
          },
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        })
      })

      // Bottom action bar slides in after the hero
      gsap.set("[data-bar]", { yPercent: 120 })
      ScrollTrigger.create({
        start: 360,
        onEnter: () =>
          gsap.to("[data-bar]", { yPercent: 0, duration: 0.35, ease: "ui" }),
        onLeaveBack: () =>
          gsap.to("[data-bar]", { yPercent: 120, duration: 0.25, ease: "power2.in" }),
      })
    })
    // Decorative, scroll-bound motion: desktop only (saves main-thread work on phones)
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      // Subtle parallax on tradition photo + drifting snowflake
      gsap.to("[data-parallax]", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: "#tradicao",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })
      gsap.to("[data-spin]", {
        rotation: 360,
        duration: 80,
        ease: "none",
        repeat: -1,
      })
    })
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-bar]", { yPercent: 0 })
    })
    return () => mm.revert()
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      setAtTop(window.scrollY < 110)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div ref={root} className="overflow-x-clip bg-background text-foreground pb-[calc(76px+env(safe-area-inset-bottom))] md:pb-0">
      {/* Top Institutional Bar */}
      <div className="hidden border-b border-white/10 bg-[var(--navy-950)] text-white md:block">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2 px-5 py-2.5 text-xs sm:px-10">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[var(--blue-200)]">
              <MapPin className="size-3.5 text-[var(--blue-400)]" />
              Rua Eduardo Souto, 700 · Operária Nova, Criciúma - SC
            </span>
            <span className="hidden items-center gap-1.5 text-white/70 md:inline-flex">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Busca e entrega com frota própria
            </span>
          </div>
          <a
            href={contact}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-bold text-white hover:text-[var(--blue-200)]"
          >
            <Phone className="size-3.5 text-[var(--blue-400)]" />
            (48) 99921-6831
          </a>
        </div>
      </div>

      {/* Sticky Main Header */}
      <header
        className="pointer-events-none sticky top-0 z-50 -mb-[68px] px-3 pt-3 text-white sm:-mb-[84px] sm:px-6 sm:pt-4"
      >
        <div className={`pointer-events-auto mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-4 rounded-full border border-white/10 bg-[var(--navy-900)]/95 py-2 pl-2.5 pr-2 transition-shadow sm:h-[68px] sm:pl-4 sm:pr-3 ${
            scrolled ? "shadow-[var(--shadow-sticky)]" : ""
          }`}>
          {/* Phones: the hero already shows the big logo, so the pill shows the phone until you scroll */}
          <div className="relative flex items-center">
            <div
              className={`transition-[opacity,visibility] duration-200 ${
                atTop ? "max-sm:invisible max-sm:opacity-0" : ""
              }`}
            >
              <Logo light prominent />
            </div>
            <a
              href={phoneHref}
              aria-hidden={!atTop}
              tabIndex={atTop ? 0 : -1}
              className={`absolute left-3 flex items-center gap-2 whitespace-nowrap text-sm font-bold text-white transition-[opacity,visibility] duration-200 sm:hidden ${
                atTop ? "" : "invisible opacity-0"
              }`}
            >
              <Phone className="size-4 text-[var(--blue-400)]" />
              (48) 99921-6831
            </a>
          </div>
          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label="Navegação principal"
          >
            {nav.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="hidden md:block">
            <Whatsapp className="!rounded-full !px-5 !py-3 !text-sm">
              Solicitar orçamento
            </Whatsapp>
          </div>
          <button
            className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10 lg:hidden"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {menuOpen && (
          <div
            className="pointer-events-auto fixed inset-0 -z-10 bg-black/50 lg:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}
        {menuOpen && (
          <nav
            ref={mobileMenu}
            className="pointer-events-auto absolute inset-x-3 mt-2 rounded-3xl border border-white/15 bg-[var(--navy-900)] px-6 pb-6 pt-3 text-white shadow-2xl sm:inset-x-6 lg:hidden"
            aria-label="Navegação móvel"
          >
            {nav.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-white/10 py-4 text-base font-semibold text-white/90 hover:text-[var(--blue-400)]"
              >
                {label}
              </a>
            ))}
            <Whatsapp className="mt-5 w-full">Solicitar orçamento</Whatsapp>
          </nav>
        )}
      </header>

      <main>
        {/* Hero Section with Animated Showroom Video + High-Res Poster */}
        <section
          id="inicio"
          className="relative isolate overflow-hidden bg-[#dfe6ee] text-[var(--hero-ink)]"
        >
          {/* Background Video / Image Layer */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
            aria-hidden="true"
          >
            {isDesktop ? (
              <video
                autoPlay
                muted
                playsInline
                preload="metadata"
                poster={u("/assets/hero-poster.webp")}
                className="h-full w-full object-cover object-[72%_bottom]"
              >
                <source src={u("/assets/showroom-appliances.mp4")} type="video/mp4" />
              </video>
            ) : (
              <img
                src={u("/assets/hero-poster.webp")}
                alt=""
                className="hidden h-full w-full object-cover object-[72%_bottom] lg:block"
              />
            )}
            {/* Soft gradient overlay on desktop so left copy is 100% crisp */}
            <div className="hidden lg:absolute lg:inset-0 lg:block lg:bg-[linear-gradient(90deg,#dfe6ee_0%,#dfe6ee_40%,rgba(223,230,238,0.72)_54%,rgba(223,230,238,0)_68%)]" />
          </div>

          <div className="mx-auto max-w-[1280px]">
            <div className="relative z-10 px-5 pb-0 pt-[92px] sm:px-10 sm:pt-[124px] lg:w-[54%] lg:pb-20 lg:pt-[150px]">
              <img
                data-hero="logo"
                src={u("/assets/ab860.svg")}
                alt="Refrimax Refrigeração"
                width="693"
                height="183"
                fetchPriority="high"
                className="mb-4 h-auto w-[236px] sm:hidden"
              />
              <div data-hero="pill" className="mb-5 hidden flex-wrap items-center gap-2.5 sm:inline-flex rounded-full border border-[var(--navy-700)]/20 bg-[var(--navy-900)] px-4 py-2 text-xs font-extrabold tracking-[1.2px] text-white shadow-sm">
                <span className="size-2 rounded-full bg-[var(--blue-400)]" />
                MAIS DE 35 ANOS · CRICIÚMA E REGIÃO
              </div>

              <h1 data-hero="title" className="max-w-[600px] text-[var(--navy-950)] font-display font-bold uppercase text-[44px] leading-[0.94] tracking-[-0.01em] sm:text-[76px] xl:text-[88px]">
                Assistência Técnica{" "}
                <span className="text-[var(--blue-600)]">
                  Especializada em Eletrodomésticos
                </span>
              </h1>

              {/* Mobile-only highlight of the service promise */}
              <div
                data-hero="tagline"
                className="mt-4 flex items-center gap-3 rounded-2xl bg-[var(--blue-600)] px-4 py-3 text-white shadow-[0_10px_24px_-8px_rgba(8,121,237,0.55)] sm:hidden"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Truck className="size-5" aria-hidden="true" />
                </span>
                <p className="font-display text-[21px] font-bold uppercase leading-[1.02] tracking-[0.01em]">
                  Atendimento ágil e entrega a domicílio
                </p>
              </div>

              <p data-hero="text" className="mt-4 hidden max-w-[510px] sm:block text-base font-medium leading-[1.7] text-[#243b55] sm:text-lg">
                Consertos, reparos e manutenção preventiva e corretiva de{" "}
                <strong className="font-bold text-[var(--navy-950)]">
                  geladeiras, freezers, máquinas de lavar, micro-ondas, fornos e
                  expositores
                </strong>{" "}
                com busca e entrega própria.
              </p>

              {/* Hero CTAs */}
              <div data-hero="cta" className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-3.5">
                <Whatsapp className="w-full text-base sm:w-auto sm:px-8">
                  Orçamento no WhatsApp
                </Whatsapp>
                <a
                  href="#equipamentos"
                  className="hidden min-h-[44px] items-center justify-center gap-2 rounded-xl px-6 py-2 text-sm font-bold sm:inline-flex text-[var(--blue-600)] underline-offset-4 hover:underline sm:min-h-[54px] sm:border sm:border-[var(--navy-900)]/20 sm:bg-white/85 sm:py-3.5 sm:text-[var(--navy-900)] sm:no-underline sm:shadow-xs sm:backdrop-blur-xs sm:hover:no-underline text-[var(--navy-900)] shadow-xs backdrop-blur-xs hover:border-[var(--blue-600)] hover:bg-white hover:text-[var(--blue-600)]"
                >
                  Ver equipamentos atendidos
                  <ArrowRight className="size-4" />
                </a>
              </div>

              {/* Quick Trust Pills */}
              <div data-hero="trust" className="mt-6 hidden grid-cols-3 sm:grid gap-2 border-t border-[var(--navy-900)]/12 pt-5 text-xs font-bold leading-tight text-[var(--navy-900)] sm:mt-9 sm:gap-3 sm:pt-6 sm:text-xs">
                <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--blue-600)]/12 text-[var(--blue-600)]">
                    <Truck className="size-4" />
                  </span>
                  Busca e entrega própria
                </div>
                <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--blue-600)]/12 text-[var(--blue-600)]">
                    <ShieldCheck className="size-4" />
                  </span>
                  Peças de procedência
                </div>
                <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--blue-600)]/12 text-[var(--blue-600)]">
                    <Wrench className="size-4" />
                  </span>
                  Preventiva e corretiva
                </div>
              </div>
            </div>

            {/* Mobile/tablet stage: appliances sit under the copy, wall fades into the hero colour */}
            <div
              data-hero="media"
              className="relative mt-5 h-[330px] overflow-hidden sm:mt-0 sm:h-[500px] lg:hidden"
            >
              <img
                src={u("/assets/mobile-bg.webp")}
                alt="Geladeira, freezer, máquina de lavar, bebedouro e frigobar"
                width="768"
                height="1376"
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover object-[50%_100%]"
              />
              {playMobileVideo && (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster={u("/assets/mobile-bg.webp")}
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover object-[50%_100%]"
                >
                  <source src={u("/assets/mobile-bg.mp4")} type="video/mp4" />
                </video>
              )}
              <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#dfe6ee] to-transparent" />
            </div>
          </div>

          {/* Floating Badge on Desktop */}
          <div className="pointer-events-none hidden lg:absolute lg:right-10 lg:top-8 lg:flex lg:items-center lg:gap-2.5 lg:rounded-full lg:border lg:border-[var(--navy-900)]/15 lg:bg-white/90 lg:px-4 lg:py-2 lg:text-xs lg:font-bold lg:tracking-wider lg:text-[var(--navy-900)] lg:shadow-md lg:backdrop-blur-md">
            <Snowflake
              className="size-4 text-[var(--blue-600)]"
              aria-hidden="true"
            />
            CUIDADO TÉCNICO · RESULTADO REAL
          </div>
        </section>

        {/* Brand Authority Marquee + Trust Strip */}
        <section
          aria-label="Marcas e Diferenciais"
          className="border-y border-[var(--border)] bg-[var(--navy-950)] text-white"
        >
          <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="inline-flex items-center rounded-full border border-current/30 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[1.8px] text-[var(--blue-400)]">
                  ESPECIALISTAS MULTIMARCAS
                </p>
                <h2 className="mt-2 max-w-[640px] text-white font-display font-bold uppercase text-[30px] leading-[1] tracking-[-0.005em] sm:text-[42px]">
                  Trabalhamos com as principais marcas do mercado nacional.
                </h2>
                <p className="mt-2 max-w-[520px] text-sm leading-relaxed text-[var(--blue-200)]">
                  Diagnóstico técnico especializado para equipamentos fora da
                  garantia de fábrica ou em manutenção periódica.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMarqueePaused((p) => !p)}
                aria-label={marqueePaused ? "Retomar rolagem das marcas" : "Pausar rolagem das marcas"}
                aria-pressed={marqueePaused}
                className="press flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
              >
                {marqueePaused ? <Play className="size-4" /> : <Pause className="size-4" />}
              </button>
            </div>

            {/* Infinite logo marquee: white monochrome logos, no container, edge fade */}
            <div
              className="brand-marquee relative mx-[calc(50%-50vw)] mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
              role="img"
              aria-label="Marcas atendidas: Brastemp, Electrolux e Consul"
            >
              <div
                className="brand-marquee-track flex w-max"
                style={{ animationPlayState: marqueePaused ? "paused" : undefined }}
              >
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex shrink-0 items-center" aria-hidden="true">
                    {[0, 1, 2].flatMap((repeat) =>
                      ["brastemp", "electrolux", "consul"].map((brand) => (
                        <div
                          key={`${repeat}-${brand}`}
                          className="flex h-20 w-[150px] items-center justify-center px-5 sm:h-24 sm:w-[200px] sm:px-8"
                        >
                          <img
                            src={u(`/assets/${brand}.svg`)}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            width="160"
                            height="40"
                            className={`w-full object-contain opacity-60 brightness-0 invert ${
                              brand === "consul" ? "max-h-6 sm:max-h-8" : "max-h-8 sm:max-h-10"
                            }`}
                          />
                        </div>
                      )),
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Key Metrics / Pillars */}
            <div data-stagger className="mt-8 grid grid-cols-2 gap-5 border-t border-white/10 pt-8 sm:mt-10 md:grid-cols-4">
              {[
                [
                  Award,
                  "ANOS",
                  "Tradição e referência em Criciúma e região",
                ],
                [
                  Truck,
                  "Coleta e entrega própria",
                  "Veículo adaptado para transporte seguro",
                ],
                [
                  Wrench,
                  "Preventiva e corretiva",
                  "Soluções para residências e comércios",
                ],
                [
                  ShieldCheck,
                  "Garantia e transparência",
                  "Orçamento claro e peças de qualidade",
                ],
              ].map(([Icon, title, subtitle], idx) => {
                const PillarIcon = Icon as typeof Award
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 md:border-l md:border-white/10 md:pl-6 first:md:border-l-0 first:md:pl-0"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--blue-600)]/20 text-[var(--blue-400)]">
                      <PillarIcon className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {title === "ANOS" ? (
                          <>
                            +<span data-count="35">35</span> anos de atuação
                          </>
                        ) : (
                          (title as string)
                        )}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-[var(--blue-200)]">
                        {subtitle as string}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Unified Tradition & Real Structure Section (Carlos Moura + Fleet Photo) */}
        <section
          id="tradicao"
          aria-labelledby="tradicao-title"
          className="bg-[image:var(--gradient-section)] py-12 sm:py-24"
        >
          <div className="mx-auto max-w-[1280px] px-5 sm:px-10">
            <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
              {/* Real Photo of Carlos Moura & Refrimax Pickup */}
              <figure data-reveal className="relative">
                <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--navy-900)] shadow-[var(--shadow-card-hover)]">
                  <img
                    src={u("/assets/carlosmoura.webp")}
                    alt="Especialista da Refrimax ao lado da picape utilitária oficial da empresa carregada com eletrodomésticos em Criciúma"
                    loading="lazy"
                    decoding="async"
                    width="1400"
                    height="900"
                    data-parallax className="aspect-[16/10] w-full scale-110 object-cover object-[45%_center]"
                  />
                </div>
                <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-white px-5 py-3.5 text-xs font-semibold text-[var(--ink-strong)] shadow-sm sm:absolute sm:inset-x-6 sm:-bottom-5 sm:mt-0">
                  <span className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-[var(--blue-600)] text-white">
                      <Truck className="size-3.5" />
                    </span>
                    Estrutura própria de coleta e entrega em Criciúma e região
                  </span>
                  <span className="font-bold text-[var(--blue-600)]">
                    (48) 99921-6831
                  </span>
                </figcaption>
              </figure>

              {/* Editorial Story & Value Proposition */}
              <div data-reveal className="lg:pl-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-[var(--blue-100)] px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[var(--blue-action)]">
                  <ShieldCheck className="size-4" />
                  Tradição que gera tranquilidade
                </div>

                <h2
                  id="tradicao-title"
                  className="mt-4 text-[var(--ink-strong)] font-display font-bold uppercase text-[40px] leading-[0.96] tracking-[-0.01em] sm:text-[64px]"
                >
                  Mais de 35 anos cuidando do que é essencial na sua rotina
                  <span className="text-[var(--brand-red)]">.</span>
                </h2>

                <p className="mt-5 text-base leading-[1.75] text-[var(--ink-body)]">
                  A <strong>Refrimax Refrigeração</strong> construiu sua
                  história em Criciúma-SC unindo conhecimento técnico profundo,
                  honestidade no diagnóstico e respeito ao cliente. Sabemos que
                  uma geladeira ou máquina de lavar parada afeta toda a rotina
                  da sua casa ou empresa.
                </p>

                <ul className="mt-6 space-y-3 text-sm font-medium text-[var(--ink-strong)]">
                  {[
                    "Frota utilitária própria: buscamos e entregamos seu equipamento com segurança",
                    "Especialistas em Brastemp, Consul, Electrolux e linha comercial",
                    "Oficina completa na Rua Eduardo Souto, 700 — Bairro Operária Nova",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[var(--whatsapp-action)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Whatsapp
                    href={whatsappUrl(
                      "Olá, Refrimax! Vi o site e gostaria de falar com o técnico sobre meu equipamento.",
                    )}
                    className="w-full sm:w-auto"
                  >
                    Falar direto com o Técnico
                  </Whatsapp>
                  <div className="flex items-center gap-2 px-2 text-xs font-semibold text-[var(--ink-muted)]">
                    <MapPin className="size-4 shrink-0 text-[var(--blue-600)]" />
                    Atendimento rápido em Criciúma e região
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Equipment Grid Section */}
        <section
          id="equipamentos"
          className="mx-auto max-w-[1280px] px-5 py-14 sm:px-10 sm:py-20"
        >
          <div data-reveal className="mb-8 flex sm:mb-12 flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="inline-flex items-center rounded-full border border-current/30 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[1.8px] text-[var(--blue-600)]">
                SOLUÇÕES COMPLETAS
              </span>
              <h2 className="mt-2 max-w-[640px] text-[var(--ink-strong)] font-display font-bold uppercase text-[40px] leading-[0.96] tracking-[-0.01em] sm:text-[64px]">
                Qual equipamento precisa de atenção hoje?
              </h2>
            </div>
            <p className="max-w-[360px] text-sm leading-relaxed text-[var(--ink-muted)]">
              Toque no aparelho ou no defeito e fale com a Refrimax no WhatsApp
              com a mensagem já preenchida.
            </p>
          </div>

          <div ref={track} onScroll={onTrackScroll} tabIndex={0} role="region" aria-label="Equipamentos atendidos" data-stagger className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
            {equipment.map((item) => (
              <div
                key={item.title}
                className="group flex w-[80%] shrink-0 snap-center flex-col overflow-hidden rounded-[28px] sm:w-auto border border-[var(--border)] bg-white shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1.5 hover:border-[var(--blue-600)]/50 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="relative h-[230px] overflow-hidden bg-[var(--navy-900)] sm:h-[250px]">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    width="900"
                    height="600"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-950)] via-[var(--navy-950)]/35 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                    {item.badge}
                  </span>
                  <div className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-[var(--blue-600)] text-white shadow-md">
                    <item.icon className="size-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="absolute inset-x-5 bottom-4 font-display text-[34px] font-bold uppercase leading-[0.95] text-white">
                    {item.title}
                  </h3>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
                    {item.text}
                  </p>

                  {/* Common Symptom Tags */}
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                    Qual o defeito?
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.symptoms.map((symptom) => (
                      <a
                        key={symptom}
                        href={whatsappUrl(
                          `Olá, Refrimax! Meu(minha) ${item.title.toLowerCase()} está com o seguinte problema: ${symptom.toLowerCase()}. Podem me ajudar?`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="press inline-flex min-h-[40px] items-center rounded-full border border-[var(--blue-600)]/20 bg-[var(--surface-ice)] px-3 text-xs font-semibold text-[var(--navy-800)] hover:border-[var(--blue-600)] hover:bg-white"
                      >
                        {symptom}
                      </a>
                    ))}
                  </div>

                  <a
                    href={whatsappUrl(item.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press mt-5 flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[var(--whatsapp-action)] px-4 text-sm font-extrabold text-white hover:bg-[var(--whatsapp-action-hover)]"
                  >
                    <WhatsAppIcon className="size-4" />
                    Pedir orçamento
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel controls (mobile): dots + prev/next as non-swipe alternative */}
          <div className="mt-2 flex items-center justify-between sm:hidden">
            <div className="flex items-center gap-1" role="group" aria-label="Escolher equipamento">
              {equipment.map((item, i) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Ir para ${item.title}`}
                  aria-current={slide === i}
                  className="flex size-6 items-center justify-center"
                >
                  <span
                    className={`block h-2 rounded-full transition-all ${
                      slide === i ? "w-6 bg-[var(--blue-600)]" : "w-2 bg-[var(--blue-600)]/25"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goTo(slide - 1)}
                disabled={slide === 0}
                aria-label="Equipamento anterior"
                className="press flex size-11 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--navy-900)]"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => goTo(slide + 1)}
                disabled={slide === equipment.length - 1}
                aria-label="Próximo equipamento"
                className="press flex size-11 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--navy-900)]"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Services & Differentials Section (High-Contrast Dark Navy) */}
        <section
          id="servicos"
          className="bg-[image:radial-gradient(60%_40%_at_100%_0%,rgba(8,121,237,0.30),transparent),radial-gradient(50%_30%_at_0%_100%,rgba(230,32,44,0.14),transparent),var(--gradient-dark)] text-white"
        >
          <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-10 sm:py-20">
            <div data-reveal className="mb-10 flex sm:mb-14 flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-current/30 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[1.8px] text-[var(--blue-400)]">
                  <Sparkles className="size-4" />
                  EXCELÊNCIA TÉCNICA
                </span>
                <h2 className="mt-3 max-w-[670px] text-white font-display font-bold uppercase text-[40px] leading-[0.96] tracking-[-0.01em] sm:text-[64px]">
                  Mais do que consertar. Cuidamos para seu equipamento continuar
                  funcionando.
                </h2>
              </div>
              <p className="max-w-[320px] text-sm leading-relaxed text-[var(--blue-200)]">
                Um equipamento bem cuidado economiza energia, protege seus
                alimentos e evita imprevistos na rotina da sua família ou
                empresa.
              </p>
            </div>

            <div data-stagger className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {benefits.map(([Icon, title, text], i) => (
                <div
                  key={title}
                  className="group relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-[var(--navy-900)] p-6 transition sm:p-7 hover:border-[var(--blue-400)]/40"
                >
                  <img
                    src={benefitImages[i][0]}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    width="640"
                    height="480"
                    style={{ objectPosition: benefitImages[i][1] }}
                    className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40 grayscale transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--navy-900)]/88 via-[var(--navy-900)]/72 to-[var(--navy-950)]/90"
                    aria-hidden="true"
                  />
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-[var(--blue-600)]/20 text-[var(--blue-400)]">
                    <Icon className="size-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-display text-[26px] font-bold uppercase leading-[1.02] text-white">{title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--blue-200)] sm:text-sm">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="como-funciona"
          className="mx-auto max-w-[1280px] px-5 py-14 sm:px-10 sm:py-20"
        >
          <div data-reveal className="mx-auto max-w-[640px] text-center">
            <span className="inline-flex items-center rounded-full border border-current/30 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[1.8px] text-[var(--blue-600)]">
              PASSO A PASSO SIMPLES
            </span>
            <h2 className="mt-2 text-[var(--ink-strong)] font-display font-bold uppercase text-[40px] leading-[0.96] tracking-[-0.01em] sm:text-[64px]">
              Como funciona o atendimento?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
              Três passos simples para resolver o problema do seu equipamento
              sem burocracia.
            </p>
          </div>

          <div data-stagger className="mt-10 grid gap-5 sm:mt-14 sm:gap-8 md:grid-cols-3">
            {[
              [
                MessageCircle,
                "01",
                "Chame no WhatsApp",
                "Envie uma mensagem para (48) 99921-6831. Nosso atendimento é direto, humano e sem robôs complicados.",
              ],
              [
                ClipboardCheck,
                "02",
                "Descreva o sintoma",
                "Conte qual é o aparelho, a marca e o que está acontecendo. Se preferir, envie uma foto ou vídeo do equipamento.",
              ],
              [
                CalendarCheck,
                "03",
                "Agende a visita ou coleta",
                "Combinamos o melhor horário para avaliar seu aparelho ou buscá-lo com nossa picape utilitária em Criciúma e região.",
              ],
            ].map(([Icon, num, title, text], index) => {
              const StepIcon = Icon as typeof MessageCircle
              return (
                <div
                  key={index}
                  className="relative rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-[var(--surface-ice)] text-[var(--blue-600)]">
                      <StepIcon className="size-7" strokeWidth={1.75} />
                    </div>
                    <span className="font-display text-6xl font-bold leading-none text-[var(--blue-600)]/20">
                      {num as string}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-[28px] font-bold uppercase leading-none text-[var(--ink-strong)]">
                    {title as string}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
                    {text as string}
                  </p>
                </div>
              )
            })}
          </div>

          <div data-reveal className="mt-10 text-center sm:mt-12">
            <Whatsapp className="w-full sm:w-auto">Agendar atendimento agora</Whatsapp>
          </div>
        </section>

        {/* Direct Conversion Banner */}
        <section
          id="contato"
          className="relative overflow-hidden bg-[image:var(--gradient-hero)] text-white"
        >
          <Snowflake
            data-spin
            className="pointer-events-none absolute -right-10 -top-12 size-80 text-white opacity-10"
            strokeWidth={0.7}
            aria-hidden="true"
          />
          <div className="relative mx-auto flex max-w-[1280px] flex-col justify-between gap-8 px-5 py-12 sm:px-10 sm:py-16 lg:flex-row lg:items-center">
            <div data-reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold tracking-[1.5px] text-[var(--blue-200)]">
                VAMOS RESOLVER JUNTOS
              </span>
              <h2 className="mt-4 max-w-[620px] text-white font-display font-bold uppercase text-[40px] leading-[0.96] tracking-[-0.01em] sm:text-[64px]">
                Seu equipamento está apresentando algum problema?
              </h2>
              <p className="mt-3 max-w-[520px] text-sm leading-relaxed text-[var(--blue-200)] sm:text-base">
                Não espere o defeito agravar. Fale com a Refrimax pelo WhatsApp
                e combine a avaliação ou retirada do seu aparelho.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 sm:items-end">
              <Whatsapp className="w-full sm:w-auto">
                Solicitar orçamento pelo WhatsApp
              </Whatsapp>
              <a
                href={contact}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-bold text-white hover:text-[var(--blue-200)]"
              >
                <Phone className="size-4 text-[var(--blue-400)]" />
                (48) 99921-6831 · Atendimento em Criciúma e região
              </a>
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-bold text-[var(--blue-200)] hover:text-white"
              >
                <MapPin className="size-4 text-[var(--blue-400)]" />
                Como chegar à oficina
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="duvidas"
          className="border-t border-[var(--border)] bg-[var(--surface-subtle)]"
        >
          <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-14 sm:gap-12 sm:px-10 sm:py-20 lg:grid-cols-[0.85fr_1.15fr]">
            <div data-reveal>
              <span className="inline-flex items-center rounded-full border border-current/30 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[1.8px] text-[var(--blue-600)]">
                TIRE SUAS DÚVIDAS
              </span>
              <h2 className="mt-2 text-[var(--ink-strong)] font-display font-bold uppercase text-[40px] leading-[0.96] tracking-[-0.01em] sm:text-[64px]">
                Perguntas frequentes.
              </h2>
              <p className="mt-4 max-w-[320px] text-sm leading-relaxed text-[var(--ink-muted)]">
                Ainda tem alguma dúvida sobre marcas, coleta ou funcionamento do
                serviço? Fale diretamente com nossa equipe técnica.
              </p>
              <div className="mt-7 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  Atendimento direto
                </p>
                <p className="mt-1 text-base font-extrabold text-[var(--ink-strong)]">
                  (48) 99921-6831
                </p>
                <p className="mt-1 text-xs text-[var(--ink-muted)]">
                  Rua Eduardo Souto, 700 — Operária Nova, Criciúma - SC
                </p>
                <a
                  href={contact}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[var(--whatsapp-action)] hover:underline"
                >
                  <WhatsAppIcon className="size-4" />
                  Conversar pelo WhatsApp
                  <ArrowUpRight className="size-4" />
                </a>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-2 text-sm font-bold text-[var(--blue-600)] hover:underline"
                >
                  <MapPin className="size-4" />
                  Como chegar
                </a>
              </div>
            </div>

            <div data-reveal className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-white px-5 shadow-[var(--shadow-card)] sm:px-8">
              {questions.map(([question, answer], index) => (
                <div key={question}>
                  <h3>
                    <button
                      id={`question-${index}`}
                      aria-expanded={openFaq === index}
                      aria-controls={`answer-${index}`}
                      onClick={() =>
                        setOpenFaq(openFaq === index ? null : index)
                      }
                      className="flex min-h-[56px] w-full items-center justify-between gap-5 py-4 text-left text-base font-bold text-[var(--ink-strong)] hover:text-[var(--blue-600)]"
                    >
                      {question}
                      <ChevronDown
                        className={`size-5 shrink-0 text-[var(--blue-600)] transition-transform duration-200 ${
                          openFaq === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </h3>
                  <div
                    id={`answer-${index}`}
                    role="region"
                    aria-labelledby={`question-${index}`}
                    inert={openFaq !== index}
                    className={`grid transition-[grid-template-rows] duration-300 ${
                      openFaq === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 pr-2 text-[15px] leading-relaxed text-[var(--ink-body)] sm:pr-8 sm:text-sm">
                        {answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative isolate overflow-hidden bg-[var(--navy-900)] text-center text-white">
          <div
            className="final-cta-background pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-15"
            aria-hidden="true"
          />
          <div data-reveal className="mx-auto max-w-[900px] px-5 py-14 sm:py-20">
            <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-[var(--brand-red)]" />
            <h2 className="text-white font-display font-bold uppercase text-[40px] leading-[0.96] tracking-[-0.01em] sm:text-[64px]">
              Precisa de manutenção para seu equipamento?
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] text-base text-[var(--blue-200)]">
              Conte com mais de 35 anos de experiência em refrigeração e
              máquinas de lavar em Criciúma e região.
            </p>
            <Whatsapp className="mt-8 w-full sm:w-auto">
              Chamar a Refrimax no WhatsApp
            </Whatsapp>
            <p className="mt-5 text-xs font-medium text-[var(--blue-200)]">
              (48) 99921-6831 · Rua Eduardo Souto, 700 — Operária Nova, Criciúma
              - SC
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[var(--navy-950)] text-white">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-14 sm:grid-cols-2 sm:px-10 lg:grid-cols-[1.4fr_0.8fr_1.2fr_0.9fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-[280px] text-xs leading-relaxed text-[var(--blue-200)]">
              Assistência técnica especializada em refrigeração residencial,
              comercial e linha branca com mais de 35 anos de tradição.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-white">
              Navegação
            </h3>
            <div className="grid gap-2.5">
              {[...nav, ["Contato", "contato"]].map(([label, id]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="py-1 text-sm text-[var(--blue-200)] hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-white">
              Fale com a Refrimax
            </h3>
            <a
              href={contact}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-white hover:text-[var(--blue-400)]"
            >
              <Phone className="size-4 text-[var(--blue-400)]" />
              (48) 99921-6831
            </a>
            <p className="mt-4 flex gap-2 text-xs leading-6 text-[var(--blue-200)]">
              <MapPin className="mt-1 size-4 shrink-0 text-[var(--blue-400)]" />
              <span>
                Rua Eduardo Souto, 700
                <br />
                Operária Nova · Criciúma - SC
              </span>
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-white">
              Área de Cobertura
            </h3>
            <p className="text-xs leading-6 text-[var(--blue-200)]">
              Criciúma e toda a região sul catarinense com busca e entrega
              própria.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-[var(--blue-200)]">
              <span className="size-2 rounded-full bg-emerald-400" />
              Atendimento via WhatsApp
            </span>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="select-none overflow-hidden whitespace-nowrap text-center font-display text-[27vw] font-extrabold uppercase leading-[0.78] tracking-[-0.02em] text-white/[0.06] sm:text-[19vw] xl:text-[240px]"
        >
          Refrimax
        </div>
        <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-3 border-t border-white/10 px-5 py-6 text-xs text-[var(--blue-200)]/80 sm:flex-row sm:px-10">
          <p>© 2026 Refrimax Refrigeração. Todos os direitos reservados.</p>
          <p>Mais de 35 anos de confiança em cada serviço.</p>
        </div>
      </footer>

      {/* Mobile bottom action bar */}
      <div
        data-bar
        className="fixed inset-x-0 bottom-0 z-40 flex gap-2.5 border-t border-white/10 bg-[var(--navy-950)] px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-8px_24px_rgba(7,21,38,0.35)] md:hidden"
      >
        <a
          href={phoneHref}
          aria-label="Ligar para a Refrimax"
          className="press flex min-h-[52px] w-[30%] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 text-sm font-bold text-white"
        >
          <Phone className="size-4" />
          Ligar
        </a>
        <a
          href={contact}
          target="_blank"
          rel="noopener noreferrer"
          className="press flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-[var(--whatsapp-action)] text-sm font-extrabold text-white"
        >
          <WhatsAppIcon className="size-5" />
          Orçamento no WhatsApp
        </a>
      </div>

      {/* Floating WhatsApp CTA with Pulse (tablet/desktop) */}
      <a
        href={contact}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chamar a Refrimax no WhatsApp"
        className="whatsapp-pulse fixed bottom-5 right-5 z-40 hidden size-14 items-center justify-center rounded-full border-2 border-white bg-[var(--whatsapp-action)] text-white transition hover:scale-105 md:flex hover:bg-[var(--whatsapp-action-hover)]"
      >
        <WhatsAppIcon className="size-7" />
      </a>
    </div>
  )
}

import { gsap } from "gsap"

// Drives the static #splash overlay declared in index.html.
// Plays the Lottie logo, then fades out once the page is ready (or after a cap).
const ENTRY_MS = 1700 // entry part of the animation (first 1.6 s)
const MAX_MS = 4500 // never keep the visitor waiting longer than this
const LOOP_SEGMENT: [number, number] = [96, 144] // 1.6–2.4 s loop

let started = false

export function startSplash(onDone: () => void): () => void {
  // React StrictMode runs effects twice in dev: only ever start one animation
  if (started) return () => {}
  const root = document.getElementById("splash")
  const box = document.getElementById("splash-anim")
  if (!root || !box) {
    onDone()
    return () => {}
  }

  started = true
  let finished = false
  let anim: { destroy: () => void } | null = null
  const timers: number[] = []
  let entryDone = false
  let pageReady = document.readyState === "complete"

  const finish = () => {
    if (finished) return
    finished = true
    try {
      sessionStorage.setItem("rmx-splash", "1")
    } catch {}
    document.body.classList.remove("splashing")
    onDone()
    gsap.to(root, {
      autoAlpha: 0,
      duration: 0.35,
      ease: "power2.out",
      onComplete: () => {
        anim?.destroy()
        root.remove()
      },
    })
  }
  const tryFinish = () => entryDone && pageReady && finish()

  timers.push(window.setTimeout(finish, MAX_MS))
  if (!pageReady) {
    window.addEventListener(
      "load",
      () => {
        pageReady = true
        tryFinish()
      },
      { once: true },
    )
  }

  import("lottie-web/build/player/lottie_light")
    .then(({ default: lottie }) => {
      if (finished) return
      const a = lottie.loadAnimation({
        container: box,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: import.meta.env.BASE_URL + "assets/loading.json",
        rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      })
      anim = a
      a.addEventListener("DOMLoaded", () => {
        timers.push(
          window.setTimeout(() => {
            entryDone = true
            tryFinish()
          }, ENTRY_MS),
        )
      })
      a.addEventListener("complete", () => {
        if (!finished) a.playSegments(LOOP_SEGMENT, true)
      })
      a.addEventListener("data_failed", finish)
    })
    .catch(finish)

  // Singleton for the page lifetime: nothing to clean up on unmount
  return () => {}
}

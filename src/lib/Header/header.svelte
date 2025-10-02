<script>
  import { goto, pushState } from "$app/navigation"
  import { base } from "$app/paths"
  import { page } from "$app/stores"
  import { intro } from "$lib/constants"
  import XLg from "$lib/icones/x-lg.svelte"
  import Menu from "$lib/Header/Menu/menu.svelte"
  import { headerIsOpen, menuIsOpen } from "$lib/state.svelte"
  import { onMount } from "svelte"
  import styles from "./main.module.styl"

  import { DotLottie } from "@lottiefiles/dotlottie-web"
  import { useResize } from "$lib/useResize"

  let { sites } = $page.data
  const { isMobile } = useResize

  let scrollY = $state(null)
  let lastY = $state(0)
  let dotLottie = $state(null)
  let hasBeenScrolled = $state(false)
  let activeSubPage = $state($isMobile ? "welcome" : "index")

  const isScrolled = $derived(scrollY > 0)
  const isFullyCollapsed = $derived(!$headerIsOpen && !$menuIsOpen)

  let lastPage = $state(null)

  const handleClick = () => {
    if (!$isMobile) {
      headerIsOpen.set(!$headerIsOpen)
      menuIsOpen.set(true)
      lastY = scrollY
    } else {
      if (dotLottie) {
        if ($headerIsOpen) {
          dotLottie.setMode("reverse")
          dotLottie.play()
        } else {
          dotLottie.setMode("normal")
          dotLottie.play()
        }
      }
      headerIsOpen.set(!$headerIsOpen)
      lastY = scrollY
    }
  }

  $effect(() => {
    if ($isMobile) return
    if (lastY !== null && Math.abs(lastY - scrollY) > 100) {
      headerIsOpen.set(false)
    }
    if (isScrolled) {
      hasBeenScrolled = true
    }
  })

  const handleClickOutside = (event) => {
    if ($isMobile) return
    if (!event.target.closest(".frame")) {
      headerIsOpen.set(false)
    }
  }

  const setSubPage = (page) => {
    activeSubPage = page
    menuIsOpen.set(true)
  }

  $effect(() => {
    if (
      $page.url.searchParams.has("infobox") ||
      $page.url.searchParams.has("about")
    ) {
      headerIsOpen.set(false)
    }
  })

  const lottieSettings = {
    autoplay: false,
    loop: false,
    speed: 1.5,
    src: "/icon.lottie",
  }

  $effect(() => {
    if ($isMobile) {
      dotLottie = new DotLottie({
        ...lottieSettings,
        canvas: document.querySelector("#dotlottie-canvas"),
      })
      // dotLottie.setFrame(15)
    }
  })

  onMount(() => {
    if (typeof window === "undefined" || !$isMobile) return
    dotLottie = new DotLottie({
      ...lottieSettings,
      canvas: document.querySelector("#dotlottie-canvas"),
    })
    dotLottie.addEventListener("load", () => {
      if (headerIsOpen) {
        dotLottie.setFrame(29)
      } else {
        dotLottie.setFrame(0)
      }
    })
  })
</script>

<svelte:window bind:scrollY onclick={handleClickOutside} />
<header
  class={[
    "frame",
    styles.container,
    !$headerIsOpen ? styles.isCollapsed : "",
    isFullyCollapsed ? styles.isCollapsedFully : "",
  ].join(" ")}
>
  {#if !$isMobile}
    <img
      src="/icon.svg"
      class={[
        styles.icon,
        styles.svg,
        isFullyCollapsed ? styles.isCollapsedFully : "",
      ].join(" ")}
      alt="logo for Sammlungsdokumentation im Fokus"
      onclick={handleClick}
    />
  {:else}
    <canvas
      id="dotlottie-canvas"
      class={[
        styles.icon,
        isFullyCollapsed ? styles.isCollapsedFully : "",
      ].join(" ")}
      onclick={handleClick}
    ></canvas>
  {/if}
  {#if !$isMobile || activeSubPage == "welcome"}
    <div class={styles.weclomeText}>
      <a href="/">
        <h1 class={styles.title}>
          Sammlungs- <br /> dokumentation <br /> im Fokus
        </h1>
      </a>
      <h2>
        Ein rassismuskritisches Handbuch für die Praxis mit besonderem Fokus auf
        den Anti-Schwarzen-Rassismus
      </h2>
    </div>
  {/if}
  <div class={styles.infoContainer}>
    <Menu {sites} {setSubPage} {activeSubPage} />
  </div>
</header>

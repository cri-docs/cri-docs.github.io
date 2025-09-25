<script>
  import { goto, pushState } from "$app/navigation"
  import { base } from "$app/paths"
  import { page } from "$app/stores"
  import XLg from "$lib/icones/x-lg.svelte"
  import Menu from "$lib/Menu/menu.svelte"
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
    if (lastY !== null && Math.abs(lastY - scrollY) > 100) {
      headerIsOpen.set(false)
    }
    if (isScrolled) {
      hasBeenScrolled = true
    }
  })

  const handleClickOutside = (event) => {
    if (!event.target.closest(".frame")) {
      headerIsOpen.set(false)
    }
  }

  const openSubPage = (event, subPage) => {
    event.preventDefault()
    headerIsOpen.set(false)
    lastPage = $page.url.pathname
    pushState(`?${subPage}`, {
      [subPage]: true,
    })
  }

  const goBack = (event) => {
    event.preventDefault()
    if (lastPage) {
      if (lastPage === "/editorial") {
        headerIsOpen.set(true)
      }
      goto(lastPage, {
        noScroll: true,
        replaceState: true,
      })
    } else {
      headerIsOpen.set(true)
      window.location.href = "/editorial"
    }
    lastPage = null
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
<div
  class={[
    "frame",
    styles.container,
    !$headerIsOpen ? styles.isCollapsed : "",
    isFullyCollapsed ? styles.isCollapsedFully : "",
  ].join(" ")}
>
  <header>
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
    <a href="/">
      <h1 class={styles.title}>
        Sammlungs- <br /> dokumentation <br /> im Fokus
      </h1>
    </a>
    <h2>
      Ein rassismuskritisches Handbuch für die Praxis mit besonderem Fokus auf
      den Anti-Schwarzen-Rassismus
    </h2>
    <!-- 
    <div class={styles.infoBox}>
      {#if $page.url.pathname !== "/infobox" && $page.url.pathname !== "/about"}
        <a
          href={`${$page.url.pathname}?infobox`}
          onclick={(e) => openSubPage(e, "infobox")}>Infobox</a
        >
        <a
          href={`${$page.url.pathname}?about`}
          onclick={(e) => openSubPage(e, "about")}>About</a
        >
      {:else}
        <a href="/" onclick={goBack}><XLg /></a>
      {/if}
    </div> -->
  </header>
  <div class={styles.infoContainer}>
    <Menu {sites} />
  </div>
</div>

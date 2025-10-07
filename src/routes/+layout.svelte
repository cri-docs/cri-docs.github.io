<script>
  import { onMount } from "svelte"

  import { page } from "$app/stores"
  import { intro } from "$lib/constants"

  import Header from "$lib/Header/header.svelte"

  import { headerIsOpen, menuIsOpen } from "$lib/state.svelte"

  import "../styles/app.styl"
  import styles from "./+layout.module.styl"
  import Overlay from "$lib/Overlay/overlay.svelte"
  import Navigation from "./[slug]/Navigation/navigation.svelte"
  import { goto, pushState, replaceState } from "$app/navigation"
  import BiPrinter from "$lib/icones/BiPrinter.svelte"

  let { sites } = $page.data
  let { children } = $props()

  const activePage = $derived.by(() => {
    const slug = $page.params.slug || "home"
    if (!sites || !sites.length) return null
    if (slug === "home") return "home" // Default to the first site
    const site = sites.find((s) => s.fields.slug === slug)
    return site || null
  })
  const isColored = $derived.by(
    () => activePage?.fields?.color === "blue" || activePage === "home"
  )

  const printPDF = () => {
    window.open("http://" + $page.url.host + "/print.pdf", "_blank")
  }

  onMount(() => {
    // 240
    // let hue = Math.random() * 360 // Start near blue
    let hue = 240 // Start at blue
    let animationFrame
    const speed = 0.002 // Adjust this value for speed (higher = faster)
    function animateColor() {
      hue = hue + (speed % 360)
      document.documentElement.style.setProperty(
        "--color",
        `hsl(${hue}, 100%, 50%)`
      )
      document.documentElement.style.setProperty(
        "--color-secondary",
        `hsl(${(hue + 90) % 360}, 100%, 90%)`
      )
      animationFrame = requestAnimationFrame(animateColor)
    }

    // const printEvent = (event) => {
    //   if ($page.route.id === "/print") return
    //   goto($page.url.pathname + "?print=true", {
    //     replaceState: true,
    //   })
    // }

    // addEventListener("beforeprint", printEvent)

    return () => {
      cancelAnimationFrame(animationFrame)
      // removeEventListener("beforeprint", printEvent)
    }
  })

  // $effect(() => {
  //   if ($page.url.searchParams.get("print")) {
  //     window.open("http://" + $page.url.host + "/print.pdf", "_blank")
  //     goto($page.url.pathname, {
  //       replaceState: true,
  //       keepfocus: true,
  //       noscroll: true,
  //     })
  //   }
  // })
</script>

<div
  class={[
    styles.container,
    isColored ? styles.color : "",
    !$menuIsOpen ? styles.collapsed : "",
  ].join(" ")}
>
  {#if $page?.route?.id !== "/print"}
    <Header />
    <Navigation {sites} />
  {/if}
  <BiPrinter class={styles.print} onclick={printPDF} />
  <!-- <Overlay /> -->
  <main>
    <img
      src="/images/landing.jpg"
      alt="Sunset behind some mountains"
      class={`${
        $page?.params?.slug === intro ? styles.isHome : ""
      } ${styles.hero} ${!$headerIsOpen ? styles.headerIsCollapsed : ""}`}
    />
    <!-- {/if} -->
    <div class={styles.content}>
      {@render children()}
    </div>
  </main>
</div>

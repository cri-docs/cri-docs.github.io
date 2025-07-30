<script>
  import { page } from "$app/stores"
  import Header from "$lib/Header/header.svelte"

  import Menu from "$lib/Menu/menu.svelte"
  import { onMount } from "svelte"

  import "../styles/app.styl"
  import styles from "./+layout.module.styl"

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

  onMount(() => {
    // 240
    // let hue = Math.random() * 360 // Start near blue
    let hue = 240 // Start at blue
    let animationFrame
    const speed = 0.02 // Adjust this value for speed (higher = faster)
    function animateColor() {
      hue = hue + (speed % 360)
      document.documentElement.style.setProperty(
        "--color",
        `hsl(${hue}, 100%, 50%)`
      )
      document.documentElement.style.setProperty(
        "--color-secondary",
        `hsl(${(hue + 180) % 360}, 100%, 90%)`
      )
      animationFrame = requestAnimationFrame(animateColor)
    }
    animateColor()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  })
</script>

<div class={[styles.container, isColored ? styles.color : ""].join(" ")}>
  <Header />
  <main>
    {#if $page?.params?.slug === "Editorial"}
      <img
        src="/images/pexels-sagui-andrea-200115-618833.jpg"
        alt="Sunset behind some mountains"
        class={`${$page?.params?.slug === "Editorial" ? styles.isHome : ""} ${styles.hero}`}
      />
    {/if}
    <div class={styles.content}>
      <Menu {sites} />
      {@render children()}
    </div>
  </main>
</div>

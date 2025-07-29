<script>
  import { page } from "$app/stores"
  import Header from "$lib/Header/header.svelte"

  import Menu from "$lib/Menu/menu.svelte"

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
</script>

<div class={[styles.container, isColored ? styles.color : ""].join(" ")}>
  <Header />
  <main>
    {#if $page?.params?.slug === "Editorial"}
      <img
        src="/images/pexels-sagui-andrea-200115-618833.jpg"
        alt="Sunset behind some mountains"
        class={`$$page?.params?.slug === "Editorial" ? styles.isHome : ""} ${styles.hero}`}
      />
    {/if}
    <div class={styles.content}>
      <Menu {sites} />
      {@render children()}
    </div>
  </main>
</div>

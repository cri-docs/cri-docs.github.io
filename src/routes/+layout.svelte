<script>
  import { page } from "$app/stores"

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
  <header>
    <h1 class={styles.title}>
      <a href="/">
        Sammlungsdokumentation im Fokus<br />Ein rassismuskritisches Handbuch
        für die Praxis mit besonderem Fokus auf den Anti-Schwarzen-Rassismus
      </a>
    </h1>
    <Menu {sites} />
  </header>
  <main>
    {@render children()}
  </main>
</div>

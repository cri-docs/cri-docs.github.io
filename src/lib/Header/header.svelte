<script>
  import { base } from "$app/paths"

  import { page } from "$app/stores"
  import styles from "./main.module.styl"

  let scrollY = $state(null)
  let lastY = $state(null)
  let isOpen = $state(false)
  let hasBeenScrolled = $state(false)

  const isScrolled = $derived(scrollY > 0)

  const handleClick = () => {
    isOpen = !isOpen
    lastY = scrollY
  }

  $effect(() => {
    if (lastY !== null && Math.abs(lastY - scrollY) > 100) {
      isOpen = false
    }
    if (isScrolled) {
      hasBeenScrolled = true
    }
  })
</script>

<svelte:window bind:scrollY />

<header class={hasBeenScrolled && !isOpen ? styles.isCollapsed : ""}>
  <div class={styles.headerContent} inert={isScrolled}>
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
  <button class={styles.smallTitle} inert={!isScrolled} onclick={handleClick}>
    Sammlungsdokumentation im Fokus
  </button>
  <div class={styles.infoBox}>Infobox</div>
</header>

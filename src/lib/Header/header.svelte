<script>
  import { base } from "$app/paths"

  import { page } from "$app/stores"
  import { headerIsOpen } from "$lib/state.svelte"
  import styles from "./main.module.styl"

  let scrollY = $state(null)
  let lastY = $state(0)

  let hasBeenScrolled = $state(false)

  const isScrolled = $derived(scrollY > 0)

  const handleClick = () => {
    headerIsOpen.set(!$headerIsOpen)
    lastY = scrollY
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
    if (!event.target.closest("header")) {
      headerIsOpen.set(false)
    }
  }
</script>

<svelte:window bind:scrollY onclick={handleClickOutside} />

<header class={!$headerIsOpen ? styles.isCollapsed : ""}>
  <div class={styles.headerContent} inert={!$headerIsOpen ? true : false}>
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
  <button
    class={styles.smallTitle}
    inert={!$headerIsOpen ? false : true}
    onclick={handleClick}
  >
    Sammlungsdokumentation im Fokus
  </button>
  <div class={styles.infoBox}>Infobox</div>
</header>

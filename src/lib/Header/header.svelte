<script>
  import { goto } from "$app/navigation"
  import { base } from "$app/paths"

  import { page } from "$app/stores"
  import XLg from "$lib/icones/x-lg.svelte"
  import { headerIsOpen } from "$lib/state.svelte"
  import styles from "./main.module.styl"

  let scrollY = $state(null)
  let lastY = $state(0)

  let hasBeenScrolled = $state(false)

  const isScrolled = $derived(scrollY > 0)

  let lastPage = $state(null)

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

  const openInfobox = (event) => {
    event.preventDefault()
    headerIsOpen.set(false)
    lastPage = $page.url.pathname
    goto("/infobox", {
      noScroll: true,
      replaceState: true,
    })
  }

  const goBack = (event) => {
    event.preventDefault()
    if (lastPage) {
      if (lastPage === "/Editorial") {
        headerIsOpen.set(true)
      }
      goto(lastPage, {
        noScroll: true,
        replaceState: true,
      })
    } else {
      headerIsOpen.set(true)
      window.location.href = "/Editorial"
    }
    lastPage = null
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
  <div class={styles.infoBox}>
    {#if $page.url.pathname !== "/infobox"}
      <a href="/infobox" onclick={openInfobox}>Infobox</a>
    {:else}
      <a href="/" onclick={goBack}><XLg /></a>
    {/if}
  </div>
</header>

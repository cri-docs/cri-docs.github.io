<script>
  import styles from "./navigation.module.styl"
  import { page } from "$app/stores"
  import { headerIsOpen, menuIsOpen } from "$lib/state.svelte"
  import BiChevronLeft from "$lib/icones/BiChevronLeft.svelte"
  import BiChevronRight from "$lib/icones/BiChevronRight.svelte"

  let { sites } = $props()

  const isFullyCollapsed = $derived(!$headerIsOpen)
  const nextPost = $derived.by(() => {
    const currentIndex = sites.findIndex(
      (site) => site?.fields?.slug === $page.data?.site?.fields?.slug
    )
    return currentIndex < sites.length - 1 ? sites[currentIndex + 1] : undefined
  })

  const previousPost = $derived.by(() => {
    const currentIndex = sites.findIndex(
      (site) => site?.fields.slug === $page.data.site.fields.slug
    )
    return currentIndex > 0 ? sites[currentIndex - 1] : undefined
  })
</script>

<!-- <svelte:window bind:scrollY /> -->

<div class={[styles.navigation, isFullyCollapsed ? styles.show : ""].join(" ")}>
  <a href={previousPost?.fields?.slug} disabled={!previousPost}
    ><BiChevronLeft /></a
  >
  <a
    href={nextPost?.fields?.slug}
    class:disabled={!nextPost}
    disabled={!nextPost ? "true" : "false"}><BiChevronRight /></a
  >
</div>

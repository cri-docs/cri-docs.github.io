<script>
  import { base } from "$app/paths"
  import { page } from "$app/stores"

  import footnotesData from "|/content/text/footnotes.json"
  import { currentFootnote } from "$lib/state.svelte.js"

  import styles from "./main.module.styl"
  const props = $props()
  let y = $state(0)

  let scrollAtFootnote = $state(null)

  $effect(() => {
    if (currentFootnote && scrollAtFootnote === null) {
      scrollAtFootnote = y
    }
  })

  $effect(() => {
    if (Math.abs(y - scrollAtFootnote) > 200) {
      currentFootnote.set(null)
      scrollAtFootnote = null
    }
  })
</script>

<svelte:window bind:scrollY={y} />

<div class={styles.container}>
  {#if footnotesData[$currentFootnote]}
    <div class={styles.footnote}>
      <!-- <h2>Footnote {$currentFootnote}</h2> -->
      <p>{$currentFootnote} – {@html footnotesData[$currentFootnote]}</p>
    </div>
  {/if}
</div>

<script>
  import { base } from "$app/paths"
  import { page } from "$app/stores"

  import footnotesData from "|/content/text/footnotes.json"
  import { currentFootnote } from "$lib/state.svelte.js"

  import styles from "./main.module.styl"
</script>

<div class={styles.container}>
  {#if footnotesData[$currentFootnote]}
    <div class={styles.footnote}>
      <h2>Footnote {$currentFootnote}</h2>
      <p>{@html footnotesData[$currentFootnote]}</p>
    </div>
  {:else}
    <div class={styles.footnote}>
      <p>No footnote found for this reference.</p>
    </div>
  {/if}
</div>

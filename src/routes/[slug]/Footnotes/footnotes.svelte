<script>
  import { base } from "$app/paths"
  import { page } from "$app/stores"

  import footnotesData from "|/content/text/footnotes.json"
  import Dublication from "$lib/Dublication/dublication.svelte"
  import { currentFootnote } from "$lib/state.svelte.js"

  import styles from "./main.module.styl"
  const props = $props()
</script>

<Dublication>
  <div class={styles.container}>
    {#if footnotesData[$currentFootnote]}
      <div class={styles.footnote}>
        <h2>Footnote {$currentFootnote}</h2>
        <p>{@html footnotesData[$currentFootnote]}</p>
      </div>
    {/if}
  </div>
</Dublication>

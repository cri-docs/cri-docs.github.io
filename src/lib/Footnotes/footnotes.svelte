<script>
  import { base } from "$app/paths"
  import { page } from "$app/stores"
  import { get } from "svelte/store"

  import styles from "./main.module.styl"

  import footnotesData from "../../content/text/footnotes.json"

  let currentFootnote = $derived($page.url.hash.split("-")[1])
</script>

{console.log("Current footnote:", footnotesData[currentFootnote])}
<div class={styles.container}>
  {#if footnotesData[currentFootnote]}
    <div class={styles.footnote}>
      <h2>Footnote {currentFootnote}</h2>
      <p>{@html footnotesData[currentFootnote]}</p>
    </div>
  {:else}
    <div class={styles.footnote}>
      <p>No footnote found for this reference.</p>
    </div>
  {/if}
</div>

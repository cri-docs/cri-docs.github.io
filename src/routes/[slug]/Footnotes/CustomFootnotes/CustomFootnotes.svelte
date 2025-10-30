<script>
  import styles from "./main.module.styl"

  import {
    currentFootnote,
    currentFootnoteIsSetFixed,
  } from "$lib/state.svelte.js"

  let { content = "" } = $props()

  const setFootnote = () => {
    currentFootnoteIsSetFixed.set(false)
    currentFootnote.set(content)
  }

  const unsetFootnote = () => {
    if (!$currentFootnoteIsSetFixed) currentFootnote.set(null)
  }
</script>

<button
  class={styles.footnote}
  onclick={() => currentFootnoteIsSetFixed.set(!$currentFootnoteIsSetFixed)}
  onmouseenter={setFootnote}
  onmouseleave={unsetFootnote}
  type="button"
>
  {content}
</button>

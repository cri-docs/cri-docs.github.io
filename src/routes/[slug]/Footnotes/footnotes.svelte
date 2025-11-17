<script>
  import { base } from "$app/paths"
  import { page } from "$app/stores"

  import footnotesData from "|/content/text/footnotes.json"
  import {
    currentFootnote,
    currentFootnoteIsSetFixed,
  } from "$lib/state.svelte.js"

  import styles from "./main.module.styl"
  // import { marked } from "marked"
  import { markdown } from "$lib/markdownRenderer"
  import Note from "./note.svelte"
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
      currentFootnoteIsSetFixed.set(false)
      scrollAtFootnote = null
    }
  })
</script>

<svelte:window bind:scrollY={y} />

<div
  class={[
    styles.container,
    $currentFootnoteIsSetFixed && styles.currentFootnoteIsSetFixed,
    "footnotesContainer",
  ].join(" ")}
>
  {#if footnotesData[$currentFootnote]}
    <div class={styles.footnote}>
      <p>
        {$currentFootnote} –<br />
        <Note content={footnotesData[$currentFootnote]} id={$currentFootnote} />
        <!-- {@html marked(footnotesData[$currentFootnote])} -->
      </p>
    </div>
  {/if}
</div>

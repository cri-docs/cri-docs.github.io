<script>
  import styles from "./main.module.styl"

  import { currentFootnote } from "$lib/state.svelte.js"

  let { content = "", id = "" } = $props()

  const setFootnote = () => {
    console.log("set footnote", id, content)
    currentFootnote.set(id)
  }
</script>

<button class={styles.footnote} onclick={setFootnote} type="button">
  {content}
</button>

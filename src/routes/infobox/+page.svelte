<script>
  import { markdown } from "$lib/markdownRenderer"
  import infoboxData from "|/content/text/infobox.json"
  import styles from "./main.module.styl"
  const marked = markdown()
</script>

<div class={styles.container}>
  <h2>Infobox</h2>
  <p>{@html marked(infoboxData.infobox)}</p>
</div>

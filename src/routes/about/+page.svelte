<script>
  import { markdown } from "$lib/markdownRenderer"
  import aboutData from "|/content/text/about.json"
  import styles from "./main.module.styl"
  const marked = markdown()
</script>

<div class={styles.container}>
  <h2>Über uns</h2>
  <p>{@html marked(aboutData.about)}</p>
</div>

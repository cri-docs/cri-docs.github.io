<script>
  import { marked } from "marked"
  import styles from "./page.module.styl"
  import Footnotes from "$lib/Footnotes/footnotes.svelte"
  let { data } = $props()
</script>

<section class={styles.container}>
  <h1>{data.post.fields.title}</h1>
  <p>{data.post.fields.date}</p>
  {@html marked(data.post.content)}
</section>

<Footnotes {data} />

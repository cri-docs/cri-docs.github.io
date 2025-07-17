<script>
  import { page } from "$app/stores"
  import { base } from "$app/paths"
  import styles from "./+page.module.styl"

  let { sites } = $page.data
</script>

<div class={styles.container}>
  <img class={styles.image} src="https://picsum.photos/2000" alt="test" />
</div>

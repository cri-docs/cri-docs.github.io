<script>
  import styles from "./main.module.styl"

  let { children } = $props()

  import { page } from "$app/stores"
  let fields = $derived($page?.data?.post?.fields)
</script>

<div class={`${styles.dublicationContainer} dubli`}>
  {@render children?.()}
</div>
{#if fields?.color !== "blue" && !!fields}
  {@render children?.()}
{/if}

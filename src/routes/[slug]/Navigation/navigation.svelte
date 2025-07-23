<script>
  import styles from "./navigation.module.styl"
  import { page } from "$app/stores"
  let { data } = $props()

  const nextPost = $derived.by(() => {
    const posts = $page?.data?.sites
    const currentIndex = posts.findIndex(
      (post) => post.fields.slug === data.post.fields.slug
    )
    return currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null
  })

  const previousPost = $derived.by(() => {
    const posts = $page?.data?.sites
    const currentIndex = posts.findIndex(
      (post) => post.fields.slug === data.post.fields.slug
    )
    return currentIndex > 0 ? posts[currentIndex - 1] : null
  })
</script>

<div class={styles.navigation}>
  {#if previousPost}
    <a href={previousPost.fields.slug}>prev</a>
  {:else}
    <span>prev</span>
  {/if}
  –
  {#if nextPost}
    <a href={nextPost.fields.slug}>next</a>
  {:else}
    <span>next</span>
  {/if}
</div>

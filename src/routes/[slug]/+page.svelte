<script>
  import { onMount } from "svelte"
  import styles from "./page.module.styl"
  import Footnotes from "./Footnotes/footnotes.svelte"
  import CustomFootnotes from "./Footnotes/CustomFootnotes/CustomFootnotes.svelte"
  import Navigation from "./Navigation/navigation.svelte"
  import { writable } from "svelte/store"
  import Menu from "$lib/Menu/menu.svelte"
  import { page } from "$app/stores"

  import { markdown, mountEmbeddedComponents } from "$lib/markdownRenderer.js"
  import External from "./types/External.svelte"

  let { data } = $props()

  const marked = markdown()

  const mark = $derived.by(() => {
    if (typeof window === "undefined") {
      return undefined
    } else {
      return marked(data.post.content)
    }
  })
  const currentFootnote = writable(null)

  const componentRegistry = {
    CustomFootnotes: CustomFootnotes,
  }

  onMount(() => {
    const cleanup = mountEmbeddedComponents(componentRegistry)
    return cleanup
  })
</script>

<section class={styles.container}>
  <h1>{data.post.fields.title}</h1>
  <p>{data.post.fields.date}</p>
  {#if mark}
    {#if data.post.fields.type === "external"}
      <External {mark} />
    {:else}
      {@html mark}
    {/if}
  {:else}
    <p>Loading content...</p>
  {/if}
  <Navigation {data} />
</section>

<Footnotes {data} {currentFootnote} />

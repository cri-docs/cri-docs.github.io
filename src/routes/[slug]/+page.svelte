<script>
  import { onMount } from "svelte"
  import styles from "./page.module.styl"
  import Footnotes from "./Footnotes/footnotes.svelte"
  import CustomFootnotes from "./Footnotes/CustomFootnotes/CustomFootnotes.svelte"
  import CustomGlossary from "./Glossary/CustomGlossary.svelte"
  import Navigation from "./Navigation/navigation.svelte"
  import { writable } from "svelte/store"
  import { page } from "$app/stores"
  import { markdown, mountEmbeddedComponents } from "$lib/markdownRenderer.js"
  import { isLoading } from "$lib"
  import External from "./types/External.svelte"
  import { fly } from "svelte/transition"
  import { navigating } from "$app/state"

  let { data } = $props()

  const marked = markdown({ pageIndex: data?.site?.fields?.order / 20 - 3 })

  const mark = $derived.by(() => {
    if (typeof window === "undefined") {
      return undefined
    } else {
      return marked(data.site.content)
    }
  })
  const currentFootnote = writable(null)

  const componentRegistry = {
    CustomFootnotes: CustomFootnotes,
    CustomGlossary: CustomGlossary,
  }

  onMount(() => {
    const cleanup = mountEmbeddedComponents(componentRegistry)
    return cleanup
  })
</script>

<section class={styles.container} key={data.site.fields.slug}>
  {#if $isLoading}
    <div class={styles.loading}>
      <svg class={styles.loader} width="40" height="40" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke="currentColor"
          stroke-width="4"
          fill="none"
          stroke-linecap="round"
          stroke-dasharray="100"
          stroke-dashoffset="60"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 20 20"
            to="360 20 20"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  {:else}
    <h2>
      <div class="number">{data?.site?.fields?.order / 20 - 3}</div>
      {data.site.fields.title}
    </h2>
    {#if mark}
      {@html mark}
    {:else}
      <p>Loading content...</p>
    {/if}
  {/if}
</section>

<Footnotes {data} {currentFootnote} />

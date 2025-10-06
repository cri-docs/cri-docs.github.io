<script>
  import { mountEmbeddedComponents } from "$lib/markdownRenderer"
  import { onMount } from "svelte"
  import CustomFootnotes from "|/routes/[slug]/Footnotes/CustomFootnotes/CustomFootnotes.svelte"
  import CustomGlossary from "|/routes/[slug]/Glossary/CustomGlossary.svelte"
  import { markdown } from "$lib/markdownRenderer"
  // import aboutData from "|/content/text/about.json"
  import styles from "./main.module.styl"
  const { data } = $props()

  const componentRegistry = {
    CustomFootnotes: CustomFootnotes,
    CustomGlossary: CustomGlossary,
  }

  const marked = markdown({
    // pageIndex: data?.site?.fields?.index,
    // data: data.site.fields,
  })

  const mark = $derived.by(() => {
    if (typeof window === "undefined") {
      return undefined
    } else {
      return marked(data.content)
    }
  })

  onMount(() => {
    const cleanup = mountEmbeddedComponents(componentRegistry)
    return cleanup
  })
</script>

<div class={styles.container}>
  {#if mark}
    {@html mark}
  {/if}
</div>

<script>
  import { mountEmbeddedComponents } from "$lib/markdownRenderer"
  import { onMount } from "svelte"
  import CustomFootnotes from "|/routes/[slug]/Footnotes/CustomFootnotes/CustomFootnotes.svelte"
  import CustomGlossary from "|/routes/[slug]/Glossary/CustomGlossary.svelte"
  import { markdown } from "$lib/markdownRenderer"
  import styles from "|/routes/[slug]/page.module.styl"
  import printStyles from "./main.module.styl"
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
      const match = data.content.match(/---([\s\S]*?)---/)
      const betweenDashes = match ? match[1] : ""
      let content = data.content.replace(/---([\s\S]*?)---/, "").trim()
      // let d =
      //   "# Interne Verwendung von Daten und Aufbereitung zur Veröffentlichung [[Verwendung und Veröffentlichung von Daten]] "
      // d = "Communities, Sammlungen und Sorgfalt"
      // content = content.split(d)[0] || content
      return marked(content)
    }
  })

  onMount(() => {
    const cleanup = mountEmbeddedComponents(componentRegistry)
    return cleanup
  })
</script>

<div class={[styles.container, printStyles.container].join(" ")}>
  {#if mark}
    {@html mark}
  {/if}
</div>

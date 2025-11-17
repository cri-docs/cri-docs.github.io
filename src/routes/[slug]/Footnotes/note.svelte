<script>
  import { markdown, mountEmbeddedComponents } from "$lib/markdownRenderer"
  import { onMount } from "svelte"
  import CustomGlossary from "../Glossary/CustomGlossary.svelte"

  const { content, id } = $props()

  const marked = markdown({})

  let cleanupComponents = null

  const componentRegistry = {
    // CustomFootnotes: CustomFootnotes,
    CustomGlossary: CustomGlossary,
  }

  $effect(() => {
    if (content == null) return
    cleanupComponents = mountEmbeddedComponents(componentRegistry)
  })

  onMount(() => {
    return () => {
      if (cleanupComponents) cleanupComponents()
    }
  })

  const markFootnote = $derived.by(() => {
    if (typeof window === "undefined") {
      return undefined
    } else {
      return marked(content)
    }
  })
</script>

{@html markFootnote}

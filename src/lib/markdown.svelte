<script>
  import { mountEmbeddedComponents } from "$lib/markdownRenderer"
  import { marked } from "marked"
  import { onMount } from "svelte"
  import CustomFootnotes from "|/routes/[slug]/Footnotes/CustomFootnotes/CustomFootnotes.svelte"
  import CustomGlossary from "|/routes/[slug]/Glossary/CustomGlossary.svelte"

  const { mark, inline } = $props()

  const componentRegistry = {
    CustomFootnotes: CustomFootnotes,
    CustomGlossary: CustomGlossary,
  }

  onMount(() => {
    // const cleanup = mountEmbeddedComponents(componentRegistry)
    // return cleanup
  })
</script>

{@html inline ? marked.parseInline(mark) : marked.parse(mark)}

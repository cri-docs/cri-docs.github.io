<script>
  import { mountEmbeddedComponents } from "$lib/markdownRenderer"
  import { onMount } from "svelte"
  import { activeHeader, headerIsOpen } from "$lib/state.svelte"
  import CustomFootnotes from "./Footnotes/CustomFootnotes/CustomFootnotes.svelte"
  import CustomGlossary from "./Glossary/CustomGlossary.svelte"
  import { markdown } from "$lib/markdownRenderer.js"
  let { data } = $props()

  const marked = markdown({
    pageIndex: data?.site?.fields?.index,
    data: data?.site?.fields,
  })

  const mark = $derived.by(() => {
    return marked(data?.site?.content)
  })

  let y = $state(0)
  let prevY = $state(0)
  let scrollDirection = $state(null)

  $effect(() => {
    if (y > prevY) {
      prevY = y
      scrollDirection = "down"
    } else if (y < prevY) {
      prevY = y
      scrollDirection = "up"
    }
  })

  const componentRegistry = {
    CustomFootnotes: CustomFootnotes,
    CustomGlossary: CustomGlossary,
  }

  onMount(() => {
    const cleanupComponents = mountEmbeddedComponents(componentRegistry)
    const headers = Array.from(document.querySelectorAll("h3"))
    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollDirection === "down") {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              activeHeader.set(entry.target.id || entry.target.textContent)
            }
          })
        } else {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              activeHeader.set(entry.target.id || entry.target.textContent)
            }
            const headerIndex = headers.findIndex(
              (header) => header === entry.target
            )
            if (entry.isIntersecting === false && headerIndex === 1) {
              activeHeader.set(headers[0].id || headers[0].textContent)
            }
          })
        }
      },
      {
        rootMargin: "0px 0px -50% 0px",
        threshold: 0.2,
      }
    )
    headers.forEach((header) => {
      observer.observe(header)
    })
    return () => {
      headers.forEach((header) => observer.unobserve(header))
      observer.disconnect()
      cleanupComponents()
    }
  })
</script>

<svelte:window bind:scrollY={y} />

{@html mark}

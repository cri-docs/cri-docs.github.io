<script>
  import { goto } from "$app/navigation"
  import { useResize } from "$lib/useResize"
  import { onMount } from "svelte"
  import styles from "./main.module.styl"

  import glossaryData from "|/content/text/glossary.json"
  import XLg from "$lib/icones/x-lg.svelte"
  import { marked as markdownOriginal } from "marked"
  import { markdown } from "$lib/markdownRenderer.js"

  const { content, id } = $props()
  const { isMobile } = useResize

  const marked = markdown({
    // pageIndex: data?.site?.fields?.index,
    // data: data.site.fields,
  })

  let mousePosition = $state({ x: 0, y: 0 })
  let windowWidth = $state(0)

  // yPercentage = $derived(mousePosition.y * 100) / document.body.clientHeight
  // $: xPercentage = (mousePosition.x * 100) / document.body.clientWidth

  let showPopup = $state(false)

  const _id = id.toLowerCase()

  const glossaryTerm = $derived.by(() => {
    _id?.replace("/", "_und_")?.split("_")
    const termMatches = Object.keys(glossaryData)?.filter((term) => {
      const termParts = term.split("_")
      const idParts = _id?.replace("/", "_und_")?.split("_") || []
      const matches = termParts.filter((part) => idParts.includes(part))
      const matchingThreshold = Math.max(1, Math.floor(idParts.length - 1))
      if (matches.length >= matchingThreshold) return term
    })
    return glossaryData?.[termMatches?.[0]]
  })

  const goToLink = (e) => {
    if (!$isMobile) {
      window.open(`/glossar#${id}`, "_blank")
    } else {
      if (showPopup) {
        if (e.target.closest(`#close-popup`)) {
          showPopup = false
        }
      } else {
        showPopup = true
      }
    }
  }

  const mouseEnter = () => {
    if ($isMobile) return
    showPopup = true
  }

  const mouseLeave = () => {
    if ($isMobile) return
    showPopup = false
  }

  const mouseMove = (event) => {
    mousePosition.x =
      windowWidth - event.clientX > 500 ? event.clientX : windowWidth - 500
    mousePosition.y = event.clientY
  }

  const handleClickOutside = (event) => {
    if (!$isMobile) return
    if (!event.target.closest(`.${styles.glossary}`)) {
      showPopup = false
    }
  }
  onMount(() => {
    document.addEventListener("click", handleClickOutside)
  })
</script>

<svelte:window bind:innerWidth={windowWidth} />
<svelte:body on:mousemove={mouseMove} />

<button
  class={[styles.glossary, "glossary"].join(" ")}
  type="button"
  onclick={goToLink}
  onmouseenter={mouseEnter}
  onmouseleave={mouseLeave}
>
  <div class={[styles.content, "content"].join(" ")}>
    {@html markdownOriginal.parseInline(content)}
  </div>
</button>
{#if showPopup}
  <div
    class={styles.popup}
    style={`top: ${!$isMobile ? mousePosition.y + 20 : undefined}px; left: ${!$isMobile ? mousePosition.x : undefined}px`}
  >
    {#if $isMobile}
      <button
        id="close-popup"
        class={styles.close}
        type="button"
        aria-label="Popup schließen"
      >
        <XLg />
      </button>
    {/if}
    <span class={styles.title}>
      {glossaryTerm?.name || "Begriff nicht im Glossar gefunden."}
    </span>
    <span class={styles.text}>
      {@html marked(glossaryTerm?.content || "")
        .replace("<p>", "")
        .replace("</p>", "")}
    </span>
  </div>
{/if}

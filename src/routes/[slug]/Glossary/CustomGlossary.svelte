<script>
  import { goto } from "$app/navigation"
  import { useResize } from "$lib/useResize"
  import { onMount } from "svelte"
  import styles from "./main.module.styl"

  import glossaryData from "|/content/text/glossary.json"
  import XLg from "$lib/icones/x-lg.svelte"
  import { marked } from "marked"
  import Markdown from "$lib/markdown.svelte"

  const { content, id } = $props()
  const { isMobile } = useResize
  let showPopup = $state(false)

  const _id = id.toLowerCase()

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

<button
  class={[styles.glossary, "glossary"].join(" ")}
  type="button"
  onclick={goToLink}
  onmouseenter={mouseEnter}
  onmouseleave={mouseLeave}
>
  {content}
  {#if showPopup}
    <div class={styles.popup}>
      {glossaryData?.[_id]?.name || "Begriff nicht im Glossar gefunden."}
      <span class={styles.text}>
        {marked.parseInline(glossaryData?.[_id]?.content || "")}
        <!-- <Markdown mark={glossaryData?.[_id]?.content || ""} inline /> -->
      </span>
      {#if !$isMobile}
        <div class={styles.more}>ganzer Text</div>
      {:else}
        <div id="close-popup" class={styles.more}><XLg /></div>
      {/if}
    </div>
  {/if}
</button>

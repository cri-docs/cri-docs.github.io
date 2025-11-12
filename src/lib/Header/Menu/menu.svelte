<script>
  import { base } from "$app/paths"
  import { activeHeader, headerIsOpen, menuIsOpen } from "$lib/state.svelte"
  import aboutData from "|/content/text/about.json"
  import disclaimerData from "|/content/text/infobox.json"
  import { slugify } from "$lib/utils.js"
  import { page } from "$app/stores"
  import { goto, replaceState } from "$app/navigation"
  import { onMount } from "svelte"
  import { marked as markedOriginal } from "marked"
  import { markdown, mountEmbeddedComponents } from "$lib/markdownRenderer.js"
  import BiChevronDoubleLeft from "$lib/icones/BiChevronDoubleLeft.svelte"
  import BiChevronLeft from "$lib/icones/BiChevronLeft.svelte"
  import { useResize } from "$lib/useResize"
  import CustomFootnotes from "|/routes/[slug]/Footnotes/CustomFootnotes/CustomFootnotes.svelte"
  import CustomGlossary from "|/routes/[slug]/Glossary/CustomGlossary.svelte"

  import styles from "./main.module.styl"

  const { sites, activeSubPage, setSubPage } = $props()
  const { isMobile, isSmall } = useResize

  const componentRegistry = {
    CustomFootnotes: CustomFootnotes,
    CustomGlossary: CustomGlossary,
  }

  const marked = markdown({})

  const markDisclaimer = $derived.by(() => {
    if (typeof window === "undefined") {
      return undefined
    } else {
      return marked(disclaimerData?.infobox)
    }
  })

  const markAbout = $derived.by(() => {
    if (typeof window === "undefined") {
      return undefined
    } else {
      return marked(aboutData?.about)
    }
  })

  const handleAnchorClick = ({ link }) => {
    event.preventDefault()
    const anchor = document.getElementById(link)
    window.scrollTo({
      top: anchor.offsetTop - 50,
      behavior: "smooth",
    })
    const url = new URL(window.location.href)
    if (url.searchParams.has("sub")) {
      url.searchParams.delete("sub")
      setTimeout(() => {
        goto(url.pathname + url.search, {
          noScroll: true,
          replaceState: true,
        })
      }, 1000)
    }
  }

  const navigate = (e) => {
    if ($isMobile || $isSmall) {
      if ($headerIsOpen) headerIsOpen.set(false)
      if ($menuIsOpen) menuIsOpen.set(false)
    } else {
      if ($headerIsOpen) headerIsOpen.set(false)
    }
  }

  const toggle = () => {
    if ($headerIsOpen) {
      headerIsOpen.set(false)
      menuIsOpen.set(true)
    } else {
      menuIsOpen.update((n) => !n)
    }
  }

  let cleanupComponents = () => {}

  $effect(() => {
    if (activeSubPage !== "index")
      cleanupComponents = mountEmbeddedComponents(componentRegistry)
  })
  onMount(() => {
    const sub = $page.url.searchParams.get("sub")
    if (sub) {
      const anchor = document.getElementById(sub)
      if (anchor) {
        setTimeout(() => {
          window.scrollTo({
            top: anchor.offsetTop - 50,
            behavior: "instant",
          })
        }, 10)
      }
    }
    return () => {
      cleanupComponents()
    }
  })
</script>

<div
  class={[
    styles.container,
    !$menuIsOpen && !$isMobile ? styles.isClosed : "",
  ].join(" ")}
>
  <button class={[styles.toggle, styles.open].join(" ")} onclick={toggle}>
    {#if $headerIsOpen}
      <BiChevronDoubleLeft />
    {:else}
      <BiChevronLeft />
    {/if}
  </button>
  <nav class={styles.buttons}>
    <button
      class:active={activeSubPage === "index"}
      onclick={() => setSubPage("index")}>Inhalt</button
    >
    <button
      class:active={activeSubPage === "disclaimer"}
      onclick={() => setSubPage("disclaimer")}>Disclaimer</button
    >
    <button
      class:active={activeSubPage === "about"}
      onclick={() => setSubPage("about")}>Über uns</button
    >
  </nav>
  {#if activeSubPage === "disclaimer"}
    <div class={[styles.disclaimer, styles.otherSubContainer].join(" ")}>
      {@html markDisclaimer}
    </div>
  {:else if activeSubPage === "about"}
    <div class={[styles.imprint, styles.otherSubContainer].join(" ")}>
      {@html markAbout}
    </div>
  {:else if activeSubPage === "index"}
    <nav class={styles.menuSubContainer}>
      <ul>
        {#each sites as site, index}
          {#if site.fields.index === 1}<br />{/if}
          <li class={site.fields.index === "extra" ? styles.extra : ""}>
            <div class={styles.label}>
              <a
                href={`/${site.fields.slug}`}
                onclick={navigate}
                class:active={$page.params.slug === site.fields.slug}
              >
                <div>
                  {site.fields.index > 0 ? site.fields.index : ""}
                </div>
                <div class={styles.circle}>
                  <div
                    class:active={$page.params.slug === site.fields.slug}
                  ></div>
                </div>
                {site.fields.short_title
                  ? site.fields.short_title
                  : site.fields.title}
              </a>
            </div>
            {#if site.fields.toc && $page.params.slug === site.fields.slug && !$isMobile}
              <ul>
                {#each site.fields.toc as item, i2}
                  <li
                    class={styles.label}
                    class:active={$activeHeader ===
                      slugify(item.title.replace(/^[^ ]* /, ""))}
                  >
                    <a
                      href={`/${site.fields.slug}?sub=${slugify(item.title.replace(/^[^ ]* /, ""))}`}
                      style={`padding-left: ${(item.level - 1) * 2 + 2.4}ch;`}
                      onclick={(e) =>
                        handleAnchorClick({
                          link: `${slugify(item.title.replace(/^[^ ]* /, ""))}`,
                        })}
                    >
                      {#if site.fields.index > 0}
                        <div>
                          {site.fields.index + "." + (+i2 + 1)}
                        </div>
                      {/if}
                      {@html markedOriginal.parseInline(
                        item.title.replace(/^[^ ]* /, "")
                      )}
                    </a>
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
    </nav>
  {/if}
</div>

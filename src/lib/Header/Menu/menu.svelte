<script>
  import { base } from "$app/paths"

  import { activeHeader, headerIsOpen, menuIsOpen } from "$lib/state.svelte"
  import aboutData from "|/content/text/about.json"
  import imprintData from "|/content/text/imprint.json"
  import infoboxData from "|/content/text/infobox.json"

  import { slugify } from "$lib/utils.js"

  import styles from "./main.module.styl"

  import { page } from "$app/stores"
  import { goto, replaceState } from "$app/navigation"
  import { onMount } from "svelte"
  import { marked } from "marked"
  import BiChevronDoubleLeft from "$lib/icones/BiChevronDoubleLeft.svelte"
  import BiChevronLeft from "$lib/icones/BiChevronLeft.svelte"
  import { useResize } from "$lib/useResize"
  import Navigation from "../../../routes/[slug]/Navigation/navigation.svelte"

  const { sites, activeSubPage, setSubPage } = $props()
  const { isMobile } = useResize

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
    if (isMobile) {
      if ($headerIsOpen) headerIsOpen.set(false)
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
  })
</script>

<div class={[styles.container, !$menuIsOpen ? styles.isClosed : ""].join(" ")}>
  {#if $headerIsOpen}
    <BiChevronDoubleLeft
      class={[styles.toggle, styles.open].join(" ")}
      onclick={toggle}
    />
  {:else}
    <BiChevronLeft
      class={[styles.toggle, styles.close].join(" ")}
      onclick={toggle}
    />
  {/if}
  <div class={styles.buttons}>
    {#if $isMobile}
      <button
        class:active={activeSubPage === "welcome"}
        onclick={() => setSubPage("welcome")}>Start</button
      >
    {/if}
    <button
      class:active={activeSubPage === "index"}
      onclick={() => setSubPage("index")}>Index</button
    >
    <button
      class:active={activeSubPage === "infobox"}
      onclick={() => setSubPage("infobox")}>Infobox</button
    >
    <button
      class:active={activeSubPage === "about"}
      onclick={() => setSubPage("about")}>Über</button
    >
  </div>
  {#if activeSubPage === "infobox"}
    <div class={[styles.infoBox, styles.subContainer].join(" ")}>
      {@html marked.parse(infoboxData.infobox)}
    </div>
  {:else if activeSubPage === "about"}
    <div class={[styles.infoBox, styles.subContainer].join(" ")}>
      {@html marked.parse(aboutData.about)}
      {@html marked.parse(imprintData.imprint)}
    </div>
  {:else if activeSubPage === "index"}
    <nav class={styles.menuSubContainer}>
      <ul>
        {#each sites as site, index}
          <li>
            <div class={styles.label}>
              <div class={styles.circle}>
                <div
                  class:active={$page.params.slug === site.fields.slug}
                ></div>
              </div>
              <a
                href={`/${site.fields.slug}`}
                onclick={navigate}
                class:active={$page.params.slug === site.fields.slug}
                data-sveltekit-noscroll
              >
                {site.fields.short_title
                  ? site.fields.short_title
                  : site.fields.title}
              </a>
            </div>
            {#if site.fields.toc && $page.params.slug === site.fields.slug && !$isMobile}
              <ul>
                {#each site.fields.toc as item}
                  <li
                    class={styles.label}
                    class:active={$activeHeader ===
                      slugify(item.title.replace(/^[^ ]* /, ""))}
                  >
                    <a
                      href={`/${site.fields.slug}?sub=${slugify(item.title.replace(/^[^ ]* /, ""))}`}
                      style={`padding-left: ${(item.level - 1) * 2 + 2}ch;`}
                      onclick={(e) =>
                        handleAnchorClick({
                          link: `${slugify(item.title.replace(/^[^ ]* /, ""))}`,
                        })}
                    >
                      {@html marked.parseInline(
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

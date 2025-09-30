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

  const { sites } = $props()

  let activeSubPage = $state("index")

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

  const navigate = (e, url) => {
    e.preventDefault()
    goto(url, { noScroll: true })
  }

  const toggle = () => {
    if ($headerIsOpen) {
      headerIsOpen.set(false)
      menuIsOpen.set(true)
    } else {
      menuIsOpen.update((n) => !n)
    }
  }

  const setSubPage = (page) => {
    activeSubPage = page
    menuIsOpen.set(true)
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
  <!-- <BiChevronDoubleLeft class={styles.toggle} onclick={toggle} /> -->
  <div class={styles.buttons}>
    <button
      class:active={activeSubPage === "index"}
      onclick={() => setSubPage("index")}>index</button
    >
    <button
      class:active={activeSubPage === "infobox"}
      onclick={() => setSubPage("infobox")}>infobox</button
    >
    <button
      class:active={activeSubPage === "about"}
      onclick={() => setSubPage("about")}>about</button
    >
  </div>
  {#if activeSubPage === "infobox"}
    <div class={[styles.infoBox, styles.subContainer].join(" ")}>
      <h2>Info Box</h2>
      {@html marked.parse(infoboxData.infobox)}
    </div>
  {:else if activeSubPage === "about"}
    <div class={[styles.infoBox, styles.subContainer].join(" ")}>
      <h2>About</h2>
      {@html marked.parse(aboutData.about)}
      <h2>Imprint</h2>
      {@html marked.parse(imprintData.imprint)}
    </div>
  {:else}
    <nav class={styles.subContainer}>
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
                class:active={$page.params.slug === site.fields.slug}
              >
                <!-- data-sveltekit-noscroll -->
                <!-- onclick={(e) => navigate(e, `/${site.fields.slug}`)} -->
                {site.fields.title}
              </a>
            </div>
            {#if site.fields.toc && $page.params.slug === site.fields.slug}
              <ul>
                {#each site.fields.toc as item}
                  <li
                    class={styles.label}
                    class:active={$activeHeader === slugify(item.title)}
                  >
                    <a
                      href={`/${site.fields.slug}?sub=${slugify(item.title)}`}
                      style={`padding-left: ${(item.level - 1) * 2 + 3}ch;`}
                      onclick={(e) =>
                        handleAnchorClick({
                          link: `${slugify(item.title)}`,
                        })}
                    >
                      {@html marked.parseInline(item.title)}
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

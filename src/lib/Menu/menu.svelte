<script>
  import { base } from "$app/paths"

  import { headerIsOpen, menuIsOpen } from "$lib/state.svelte"
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
    console.log("true")
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
      <p>This is an example of an info box.</p>
      <p>You can put any content you want here.</p>
      <p>Use it to highlight important information.</p>
    </div>
  {:else if activeSubPage === "about"}
    <div class={[styles.infoBox, styles.subContainer].join(" ")}>
      <h2>About</h2>
      <p>This is a sample SvelteKit application.</p>
      <p>It demonstrates a dynamic menu and content rendering.</p>
      <p>Feel free to explore and modify the code!</p>
    </div>
  {:else}
    <nav class={styles.subContainer}>
      <ul>
        {#each sites as post, index}
          <li>
            <div class={styles.label}>
              <div class={styles.circle}>
                <div
                  class:active={$page.params.slug === post.fields.slug}
                ></div>
              </div>
              <a
                href={`/${post.fields.slug}`}
                class:active={$page.params.slug === post.fields.slug}
              >
                <!-- data-sveltekit-noscroll -->
                <!-- onclick={(e) => navigate(e, `/${post.fields.slug}`)} -->
                {post.fields.title}
              </a>
            </div>
            {#if post.fields.toc && $page.params.slug === post.fields.slug}
              <ul>
                {#each post.fields.toc as item}
                  <li>
                    <div class={styles.label}>
                      <a
                        href={`/${post.fields.slug}?sub=${slugify(item.title)}`}
                        style={`padding-left: ${(item.level - 1) * 2 + 3}ch;`}
                        onclick={(e) =>
                          handleAnchorClick({
                            link: `${slugify(item.title)}`,
                          })}
                      >
                        {@html marked.parseInline(item.title)}
                      </a>
                    </div>
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

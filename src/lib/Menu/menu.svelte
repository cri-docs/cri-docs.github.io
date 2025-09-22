<script>
  import { base } from "$app/paths"

  import { slugify } from "$lib/utils.js"

  import styles from "./main.module.styl"

  import { page } from "$app/stores"
  import { goto, replaceState } from "$app/navigation"
  import { onMount } from "svelte"
  // import { markdown } from "$lib/markdownRenderer"
  import { marked } from "marked"

  const { sites } = $props()

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

<nav>
  <ul>
    {#each sites as post, index}
      <li>
        <div class={styles.label}>
          <div class={styles.index}>
            {#if index !== 0}
              {index}
            {:else}
              <span>–</span>
            {/if}
          </div>
          <a
            href={`/${post.fields.slug}`}
            class:active={$page.params.slug === `${post.fields.slug}`}
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

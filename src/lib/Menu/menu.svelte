<script>
  import { base } from "$app/paths"

  import Dublication from "$lib/Dublication/dublication.svelte"
  import { slugify } from "$lib/utils.js"

  import styles from "./main.module.styl"

  import { page } from "$app/stores"
  import { goto, replaceState } from "$app/navigation"
  import { onMount } from "svelte"

  const { sites } = $props()

  let y = $state(0)

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
  // $effect(() => {
  //   if (y) {
  //     const url = new URL(window.location.href)
  //     url.searchParams.delete("sub")
  //     setTimeout(() => {
  //       goto(url.pathname + url.search, {
  //         noScroll: true,
  //         replaceState: true,
  //       })
  //     }, 2000)
  //   }
  // })
</script>

<svelte:window bind:scrollY={y} />

<Dublication>
  <nav>
    <ul>
      {#each sites as post, index}
        <li>
          <div class={styles.label}>
            <div>{index}</div>
            <a
              href={`/${post.fields.slug}`}
              class:active={$page.params.slug === `${post.fields.slug}`}
            >
              {post.fields.title}
            </a>
          </div>
          {#if post.fields.toc && $page.params.slug === post.fields.slug}
            <ul>
              {#each post.fields.toc as item}
                <li>
                  <a
                    href={`/${post.fields.slug}?sub=${slugify(item.title)}`}
                    style={`margin-left: ${(item.level - 1) * 1.5}em;`}
                    onclick={(e) =>
                      handleAnchorClick({
                        link: `${slugify(item.title)}`,
                      })}
                  >
                    {item.title}
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {/each}
    </ul>
  </nav>
</Dublication>

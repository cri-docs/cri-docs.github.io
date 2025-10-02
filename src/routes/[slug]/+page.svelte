<script>
  import { onMount, tick } from "svelte"
  import styles from "./page.module.styl"
  import Footnotes from "./Footnotes/footnotes.svelte"
  import Navigation from "./Navigation/navigation.svelte"
  import Text from "./Text.svelte"
  import { writable } from "svelte/store"
  import { page } from "$app/stores"
  import { markdown } from "$lib/markdownRenderer.js"
  import { isLoading } from "$lib"
  import External from "./types/External.svelte"
  import { fly } from "svelte/transition"
  import { navigating } from "$app/state"
  import { activeHeader } from "$lib/state.svelte"

  let { data } = $props()

  const marked = markdown({
    pageIndex: data?.site?.fields?.index,
    data: data.site.fields,
  })

  const mark = $derived.by(() => {
    if (typeof window === "undefined") {
      return undefined
    } else {
      return marked(data.site.content)
    }
  })
  const currentFootnote = writable(null)

  import { browser } from "$app/environment"

  if (browser) {
    onMount(() => {
      const headers = Array.from(
        document.querySelectorAll("h1, h2, h3, h4, h5, h6")
      )
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              activeHeader.set(entry.target.id || entry.target.textContent)
            }
          })
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
      }
    })
  }
</script>

<section class={styles.container} key={data.site.fields.slug}>
  {#if $isLoading}
    <div class={styles.loading}>
      <svg class={styles.loader} width="40" height="40" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke="currentColor"
          stroke-width="4"
          fill="none"
          stroke-linecap="round"
          stroke-dasharray="100"
          stroke-dashoffset="60"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 20 20"
            to="360 20 20"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  {:else}
    <h2>
      {#if data?.site?.fields?.index >= 0}
        <div class="number">
          {data?.site?.fields?.index + 1}
        </div>
      {/if}
      {data.site.fields.title}
    </h2>
    {#if mark}
      <Text {mark} />
    {:else}
      <p>Loading content...</p>
    {/if}
  {/if}
</section>

<Footnotes {data} {currentFootnote} />

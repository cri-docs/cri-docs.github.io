<script>
  import { onMount, tick } from "svelte"
  import { browser } from "$app/environment"

  import styles from "./page.module.styl"
  import Footnotes from "./Footnotes/footnotes.svelte"
  import Navigation from "./Navigation/navigation.svelte"
  import Text from "./Text.svelte"
  import { writable } from "svelte/store"
  import { page } from "$app/stores"
  import { isLoading } from "$lib"
  import External from "./types/External.svelte"
  import { fly } from "svelte/transition"
  import { navigating } from "$app/state"
  import { activeHeader, headerIsOpen } from "$lib/state.svelte"
  import BiChevronRight from "$lib/icones/BiChevronRight.svelte"
  import infoData from "|/content/text/info.json"

  let { data } = $props()
  let { sites, site } = $page.data

  const currentFootnote = writable(null)

  const nextPost = $derived.by(() => {
    const currentIndex = sites.findIndex(
      (site) => site.fields.slug === $page.data.site.fields.slug
    )
    return currentIndex < sites.length - 1 ? sites[currentIndex + 1] : undefined
  })

  $effect(() => {
    if ($page) {
      if ($page?.url.hash) {
        const hash = $page.url.hash
        tick().then(() => {
          const el = document.querySelector(hash)
          if (el) {
            el.scrollIntoView({ behavior: "instant", block: "start" })
            window.scrollBy(0, -50)
            history.replaceState(
              null,
              "",
              window.location.pathname + window.location.search
            )
          }
        })
      }
    }
  })
</script>

<svelte:head>
  <title
    >{data.site.fields.short_title || data.site.fields.title} - {infoData.title}</title
  >
  <meta
    name="description"
    content={data.site.fields.description || data.site.fields.title}
  />
  <meta
    property="og:title"
    content={`${data.site.fields.short_title || data.site.fields.title} - ${infoData.title}`}
  />
  <meta
    property="og:description"
    content={data.site.fields.description || data.site.fields.title}
  />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={$page.url.href} />
  <meta
    name="twitter:title"
    content={`${data.site.fields.short_title || data.site.fields.title} - ${infoData.title}`}
  />
  <meta
    name="twitter:description"
    content={data.site.fields.description || data.site.fields.title}
  />
  <meta property="og:image" content="/preview.png" />
  <meta name="twitter:image" content="/preview.png" />
</svelte:head>

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
      {#if data?.site?.fields?.index >= 1}
        <div class="number">
          {data?.site?.fields?.index}
        </div>
      {/if}
      {data.site.fields.title}
    </h2>
    {#if data?.site?.content}
      <Text {data} />
    {:else}
      <p>Loading content...</p>
    {/if}
  {/if}
  {#if nextPost}
    <div class={styles.navigation}>
      <a
        href={nextPost?.fields?.slug}
        class:disabled={!nextPost}
        disabled={!nextPost ? "true" : "false"}
      >
        Nächstes Kapitel<BiChevronRight />
      </a>
    </div>
  {/if}
</section>

<Footnotes {data} {currentFootnote} />

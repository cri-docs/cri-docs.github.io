<script>
  import { mountEmbeddedComponents } from "$lib/markdownRenderer"
  import { onMount } from "svelte"
  import CustomFootnotes from "|/routes/[slug]/Footnotes/CustomFootnotes/CustomFootnotes.svelte"
  import CustomGlossary from "|/routes/[slug]/Glossary/CustomGlossary.svelte"
  import { markdown } from "$lib/markdownRenderer"
  import styles from "|/routes/[slug]/page.module.styl"
  import printStyles from "./main.module.styl"
  import infoData from "|/content/text/info.json"
  import footnotes from "|/content/text/footnotes.json"

  const { data } = $props()

  const componentRegistry = {
    CustomFootnotes: CustomFootnotes,
    CustomGlossary: CustomGlossary,
  }

  const marked = markdown({
    // pageIndex: data?.site?.fields?.index,
    // data: data.site.fields,
  })

  const mark = $derived.by(() => {
    if (typeof window === "undefined") {
      return undefined
    } else {
      const match = data.content.match(/---([\s\S]*?)---/)
      const betweenDashes = match ? match[1] : ""
      let content = data.content.replace(/---([\s\S]*?)---/, "").trim()
      // Find the position after "Einleitung"
      const einleitungMatch = content.match(/# Einleitung/i)
      if (einleitungMatch) {
        const einleitungEnd = einleitungMatch.index + einleitungMatch[0].length
        const beforeEinleitung = content.substring(0, einleitungEnd)
        const afterEinleitung = content.substring(einleitungEnd)

        const modifiedAfter = afterEinleitung
          .replace(/\n# /g, (match, offset, string) => {
            const beforeMatch = string.substring(0, offset)
            const count = (beforeMatch.match(/\n# /g) || []).length + 2
            return `\n# ${count}. `
          })
          .replace(/\n## /g, (match, offset, string) => {
            const beforeMatch = string.substring(0, offset)
            const h1Count = (beforeMatch.match(/\n# /g) || []).length + 1
            const h2Count = (beforeMatch.match(/\n## /g) || []).length + 1
            return `\n## ${h1Count}.${h2Count} `
          })
        content = beforeEinleitung + modifiedAfter
      }
      return marked(content)
    }
  })

  onMount(() => {
    const cleanup = mountEmbeddedComponents(componentRegistry)
    return cleanup
  })
</script>

<div class={[styles.container, printStyles.container].join(" ")}>
  <div class={printStyles.header}>
    <h1 class={printStyles.title}>
      {infoData.title}
      <br />
      <br />
      {infoData.subtitle}
    </h1>
    <figure>
      <img src="/images/landing.jpg" alt={infoData.imageAlt} />
      <figcaption class={styles.caption}>
        {infoData.captionLanding}
      </figcaption>
    </figure>
  </div>
  <div class={printStyles.toc}>
    <h2 class={printStyles.title}>Inhalt</h2>
    {#each data.sites as site, index}
      <div class={printStyles.nav}>
        <div class={printStyles.set}>
          <div class={printStyles.number}>
            {#if site?.fields.index >= 1}{site?.fields?.index}{/if}
          </div>
          <div class={printStyles.text}>
            {site?.fields?.title}
          </div>
        </div>
        <div class={printStyles.subNav}>
          {#each site?.fields?.toc as subToc}
            {#if site?.fields.title !== "Glossar"}
              <div class={printStyles.set}>
                {#if site?.fields.index >= 1}
                  <div class={printStyles.number}>
                    {site?.fields?.index}.{subToc.title
                      .split(" ")[0]
                      .split(".")[1]}
                  </div>
                {/if}
                <div class={printStyles.text}>
                  {subToc.title.replace(subToc.title.split(" ")[0], "")}
                </div>
              </div>
            {/if}
          {/each}
        </div>
      </div>
    {/each}
  </div>
  {#if mark}
    {@html mark}
  {/if}
  <div class={printStyles.footnotes}>
    <h2 class={printStyles.title}>Fussnoten</h2>
    {console.log(footnotes)}
    {#each Object.keys(footnotes) as key}
      <div class={printStyles.footnote}>
        <span class={printStyles.number}>{key}</span>
        <span class={printStyles.text}>{footnotes[key]}</span>
      </div>
    {/each}
  </div>
</div>

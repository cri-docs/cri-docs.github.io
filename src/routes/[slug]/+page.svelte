<script>
  import { marked } from "marked"
  import { onMount } from "svelte"
  import { mount, unmount } from "svelte"
  import styles from "./page.module.styl"
  import Footnotes from "./Footnotes/footnotes.svelte"
  import CustomFootnotes from "./Footnotes/CustomFootnotes/CustomFootnotes.svelte"
  import { writable } from "svelte/store"
  let { data } = $props()

  const currentFootnote = writable(12)

  const componentRegistry = {
    CustomFootnotes: CustomFootnotes,
  }

  const renderer = {
    link({ href, title, text }) {
      const titleAttr = title ? ` title="${title}"` : ""
      const isFootnote = href.startsWith("#footnote-")

      if (isFootnote) {
        const props = JSON.stringify({
          content: text.replace("[", "").replace("]", ""),
          id: href.split("-")[1],
          currentFootnote: currentFootnote,
        })
        return `<span data-svelte-component="CustomFootnotes" data-props='${props}'></span>`
      }

      return `<a href="${href}"${titleAttr}>${text}</a>`
    },
  }

  marked.use({ renderer })

  onMount(() => {
    const placeholders = document.querySelectorAll("[data-svelte-component]")
    const mountedComponents = []

    placeholders.forEach((placeholder) => {
      const componentName = placeholder.dataset.svelteComponent
      const Component = componentRegistry[componentName]

      if (Component) {
        try {
          // Decode HTML entities in the props data
          const propsData = placeholder.dataset.props || "{}"
          const decodedProps = propsData
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")

          const props = JSON.parse(decodedProps)
          const componentInstance = mount(Component, {
            target: placeholder,
            props,
          })
          mountedComponents.push(componentInstance)
        } catch (error) {
          console.error(`Error mounting component ${componentName}:`, error)
          console.error("Props data:", placeholder.dataset.props)
        }
      } else {
        console.warn(`Component ${componentName} not found in registry`)
      }
    })

    // Cleanup
    return () => {
      mountedComponents.forEach((component) => {
        try {
          unmount(component)
        } catch (error) {
          console.error("Error unmounting component:", error)
        }
      })
    }
  })
</script>

<section class={styles.container}>
  <h1>{data.post.fields.title}</h1>
  <p>{data.post.fields.date}</p>
  {@html marked(data.post.content)}
</section>

<Footnotes {data} {currentFootnote} />

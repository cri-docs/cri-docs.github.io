import { marked } from "marked"
import { mount, unmount } from "svelte"
import { slugify } from "./utils"

export function createMarkedRenderer() {
  const renderer = {
    heading({text, depth, raw, type}) {
      const id = slugify(text)
      return `<h${depth} id="${id}">${text}</h${depth}>`
    },
    link({ href, title, text }) {
      const titleAttr = title ? ` title="${title}"` : ""
      const isFootnote = href.startsWith("#footnote-")

      if (isFootnote) {
        const props = JSON.stringify({
          content: text.replace("[", "").replace("]", ""),
          id: text.replace("[", "").replace("]", ""),
        })
        return `<span data-svelte-component="CustomFootnotes" data-props='${props}'></span>`
      }
      const baseUrl = window.location.origin
      const isExternal = /^https?:\/\//.test(href) && !href.startsWith(baseUrl)
      if (isExternal) {
        return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`
      }
      return `<a href="${href}"${titleAttr}>${text}</a>`
    },
  }

  return renderer
}

function processCustomBlocks(content) {
  return content.replace(/\[\[blockStart\]\]([\s\S]*?)\[\[blockEnd\]\]/g, (match, blockContent) => {
    return `<div class="blockQuote">\n\n${blockContent.trim()}\n\n</div>`
  })
}


export function markdown() {
  const renderer = createMarkedRenderer()
  marked.use({ renderer })
  
  return function(content) {
    const processedContent = processCustomBlocks(content)
    return marked(processedContent)
  }
}

export function mountEmbeddedComponents(componentRegistry) {
  const placeholders = document.querySelectorAll("[data-svelte-component]")
  const mountedComponents = []

  placeholders.forEach((placeholder) => {
    const componentName = placeholder.dataset.svelteComponent
    const Component = componentRegistry[componentName]

    if (Component) {
      try {
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

  // Return cleanup function
  return () => {
    mountedComponents.forEach((component) => {
      try {
        unmount(component)
      } catch (error) {
        console.error("Error unmounting component:", error)
      }
    })
  }
}

export function decodeHtmlEntities(html) {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

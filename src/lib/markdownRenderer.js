import { marked } from "marked"
import { mount, unmount } from "svelte"
import { slugify } from "./utils"

/**
 * Creates a custom marked renderer with footnote support
 * @returns {Object} Configured marked renderer
 */
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
          id: href.split("-")[1],
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

/**
 * Processes custom blocks in markdown content before marked parsing
 * @param {string} content - Raw markdown content
 * @returns {string} Processed markdown content
 */
function processCustomBlocks(content) {
  // Replace [[blockStart]]...[[blockEnd]] with a special div wrapper
  return content.replace(/\[\[blockStart\]\]([\s\S]*?)\[\[blockEnd\]\]/g, (match, blockContent) => {
    return `<div class="blockQuote">\n\n${blockContent.trim()}\n\n</div>`
  })
}

/**
 * Configures marked with custom renderer
 * @returns {Function} Configured marked parser with custom block preprocessing
 */
export function setupMarked() {
  const renderer = createMarkedRenderer()
  marked.use({ renderer })
  
  // Return a function that preprocesses content before parsing
  return function(content) {
    const processedContent = processCustomBlocks(content)
    return marked(processedContent)
  }
}

/**
 * Mounts Svelte components embedded in HTML content
 * @param {Object} componentRegistry - Registry of available Svelte components
 * @returns {Function} Cleanup function to unmount components
 */
export function mountEmbeddedComponents(componentRegistry) {
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

/**
 * Decodes HTML entities in a string
 * @param {string} html - HTML string to decode
 * @returns {string} Decoded string
 */
export function decodeHtmlEntities(html) {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

import { marked } from "marked"
import { mount, unmount } from "svelte"
import { slugify } from "./utils"

export function createMarkedRenderer(pageInfo) {
  const renderer = {
    image({ href, title, text, ...attrs }) {
      let _text = text.replaceAll("alt:", "")
      let [altText, extraText] = _text.split(", extra:")
      extraText = extraText ? extraText.split(/Abbildung\s*\d+:\s*/i)[1] || "" : ""
      return `<figure>
                <img src="${href}" alt="${altText}"/>
                ${extraText ? `<figcaption>${extraText}</figcaption>` : ""}
              </figure>`
    },
    heading({text, depth, raw, type}) {
      // const id = slugify(text)
      const _depth = depth + 1
      const headingNumberMatch = text.match(/^[\d.]+/)
      let headingNumber = headingNumberMatch ? headingNumberMatch[0] : null
      const headingText = headingNumber ? text.replace(headingNumber, "").trim() : text
      const chapter = headingNumber ? headingNumber.split(".")[0] : null
      let subChapter = headingNumber && headingNumber.split(".").length > 1 ? headingNumber.split(".")[1] : null
      if(subChapter?.startsWith("0")) subChapter = subChapter.replace(/^0+/, "") || ""
      console.log(subChapter)
      headingNumber = headingNumber ? `${+chapter-1}${subChapter ? "." + subChapter : ""}` : null
      const id = slugify(headingText)
      const plainText = headingText.replace(/(?<!\\)[#_*~`[\]()>#+\=|{}.]/g, "")
      const escapedText = plainText.replace(/[\\]/g, '')
      return `<h${_depth} id="${id}" data-number="${headingNumber || ""}">
            ${escapedText}
            </h${_depth}>`
    },
    link({ href, title, text }) {
      const titleAttr = title ? ` title="${title}"` : ""
      const isFootnote = href.startsWith("#footnote-")
      const isGlossary = href.startsWith("#_")
      if (isFootnote) {
        const props = JSON.stringify({
          content: text.replace("[", "").replace("]", ""),
        })
        return `<span data-svelte-component="CustomFootnotes" data-props='${props}'></span>`
      }
      if (isGlossary) {
        const props = JSON.stringify({
          content: text.replace("[", "").replace("]", ""),
          id: href.replace("#_", "").toLowerCase(),
        })
        return `<span data-svelte-component="CustomGlossary" data-props='${props}'></span>`
      }
      const baseUrl = window.location.origin
      const isExternal = /^https?:\/\//.test(href) && !href.startsWith(baseUrl)
      if (isExternal) {
        return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`
      }
      return `<a href="${href}"${titleAttr}>${text}</a>`
    }
  }

  return renderer
}

function processCustomBlocks(content) {
  const regex = /\[\[start:([a-zA-Z0-9_-]+)\]\]([\s\S]*?)\[\[\end:\1\]\]/g
  let prevContent
  do {
    prevContent = content
    content = content.replace(regex, (match, blockType, blockContent) => {
      if(blockType === "heading") {
        // Extract the first line as the heading, rest as content
        const lines = blockContent.trim().split("\n")
        const heading = lines[0] || ""
        const image = lines[2] || ""
        const version = lines[4] || ""
        const info = lines[6] || ""
        console.log("Heading block lines:", image)
        return `<div class="${blockType}">\n\n# ${lines[0].trim()}\n\n${image.trim()}\n\n${version.trim()}  \n${info.trim()}\n\n</div>`
      }else{
        return `<div class="${blockType}">\n\n${blockContent.trim()}\n\n</div>`
      }
    })
  } while (regex.test(content))
  return content
}


export function markdown(pageInfo = {}) {
  const renderer = createMarkedRenderer(pageInfo)
  marked.use({ renderer });

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
    // console.log("Found placeholders:", componentName, Component)

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

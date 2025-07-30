import { redirect } from "@sveltejs/kit"
import FusionCollection from "fusionable/FusionCollection"

export const prerender = true
export const ssr = true

export function load({ url }) {
  const collection = new FusionCollection()
    .loadFromDir("src/content/text")
    .orderBy("order", "asc")

  const sites = collection.getItemsArray()
  if (url.pathname === "/") {
    // Redirect to /editorial if the path is root
    // let redirectPath = sites[0].fields.slug
    // if (redirectPath) {
    //   redirect(307, `/${redirectPath}`)
    // }
  }
  return { sites }
}

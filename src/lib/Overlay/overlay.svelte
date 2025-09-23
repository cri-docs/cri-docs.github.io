<script>
  import styles from "./main.module.styl"
  import { pushState } from "$app/navigation"

  import { page } from "$app/stores"
  const about = $derived($page.url.searchParams.get("about") === "")
  const infobox = $derived($page.url.searchParams.get("infobox") === "")
  const remove = (e) => {
    e.preventDefault()
    pushState($page.url.pathname, {
      about: false,
      infobox: false,
    })
  }
</script>

<div
  class={`${styles.container} ${$page.state.about || $page.state.infobox ? styles.active : ""}`}
>
  <div>
    <a href={$page.url.pathname} onclick={(e) => remove(e)} class={styles.link}>
      Close

      {$page.state.about ? "About" : $page.state.infobox ? "Infobox" : ""}
    </a>
  </div>
</div>

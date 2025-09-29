<script>
  import { goto } from "$app/navigation"
  import styles from "./main.module.styl"

  import glossaryData from "|/content/text/glossary.json"

  const { content, id } = $props()

  let showPopup = $state(false)

  const _id = id.toLowerCase().replaceAll("_", "-")

  console.log(glossaryData, _id, "id")

  const goToLink = () => {
    window.open(`/glossar#${id}`, "_blank")
  }
</script>

<button
  class={styles.glossary}
  type="button"
  onclick={goToLink}
  onmouseenter={() => (showPopup = true)}
  onmouseleave={() => (showPopup = false)}
>
  {content}
  {#if showPopup}
    <div class={styles.popup}>
      {glossaryData?.[_id]?.name || "Begriff nicht im Glossar gefunden."}
      <span class={styles.text}>
        {glossaryData?.[_id]?.content || ""}
      </span>
    </div>
  {/if}
</button>

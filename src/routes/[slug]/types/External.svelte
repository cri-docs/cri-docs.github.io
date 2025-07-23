<script>
  import styles from "./styles.module.styl"
  const { mark } = $props()
  const convertedText = $derived.by(() => {
    let text = mark.split("<hr>")
    console.log(text)
    text[1] = `<div class=${styles.containerIntro}>${text[1]}</div>`
    return text.join("<hr>")
  })
</script>

<div class={styles.container}>
  {@html convertedText}
</div>

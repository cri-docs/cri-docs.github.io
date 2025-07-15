<script lang="ts">
  import type { PageData } from "./$types"
  let { data }: { data: PageData } = $props()
</script>

<article>
  <h1>{data.post.fields.title}</h1>
  <p>{data.post.fields.date}</p>
  {@html data.post.content}
</article>

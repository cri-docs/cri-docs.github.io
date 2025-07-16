<script>
  import { page } from "$app/stores"
  import { base } from "$app/paths"
  let { sites } = $page.data
</script>

<main>
  <h1>Blog sites</h1>
  <ul>
    {#each sites as post}
      <li>
        <a href={`${base}/${post.fields.slug}`}>{post.fields.title}</a>
        <p>{post.fields.date}</p>
      </li>
    {/each}
  </ul>
</main>

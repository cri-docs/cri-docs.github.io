<script>
  import { page } from "$app/stores"
  let { sites } = $page.data
  console.log("data:", sites)
</script>

<main>
  <h1>Blog sites</h1>
  <ul>
    {#each sites as post}
      <li>
        <a href={`/${post.fields.slug}`}>{post.fields.title}</a>
        <p>{post.fields.date}</p>
      </li>
    {/each}
  </ul>
</main>

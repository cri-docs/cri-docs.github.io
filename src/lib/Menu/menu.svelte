<script>
  import { base } from "$app/paths"

  import styles from "./main.module.styl"

  import { page } from "$app/stores"

  const { sites } = $props()

  console.log($page)
</script>

<nav>
  <ul>
    {#each sites as post, index}
      <li>
        <div class={styles.label}>
          <div>{index}</div>
          <a
            href={`/${post.fields.slug}`}
            class:active={$page.params.slug === `${post.fields.slug}`}
          >
            {post.fields.title}
          </a>
        </div>
        {#if post.fields.toc && $page.params.slug === post.fields.slug}
          <ul>
            {#each post.fields.toc as item}
              <li>
                <a
                  href={`/${post.fields.slug}#${item.title}`}
                  style={`margin-left: ${(item.level - 1) * 1.5}em;`}
                >
                  {item.title}
                </a>
              </li>
            {/each}
          </ul>
        {/if}
      </li>
    {/each}
  </ul>
</nav>

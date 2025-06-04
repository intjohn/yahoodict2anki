<script lang="ts">
</script>

<button class="link-button" on:click>
  <slot />
</button>

<style>
  .link-button {
    color: inherit;
    text-decoration: underline;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
  }
</style>

<script lang="ts">
</script>

<button class="link-button" on:click>
  <slot />
</button>

<style>
  .link-button {
    color: #096ac0;
    text-decoration: underline;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
  }
  .link-button:hover {
    color: #3b86c8;
  }
</style>

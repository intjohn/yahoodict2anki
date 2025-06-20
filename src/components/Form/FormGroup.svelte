<script lang="ts">
  let { children } = $props();
</script>

<div class="form-group">{@render children()}</div>

<style>
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>

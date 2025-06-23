<script lang="ts">
  let { children, class: className = '' } = $props();
</script>

<div class="form-group {className}">{@render children()}</div>

<style>
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>

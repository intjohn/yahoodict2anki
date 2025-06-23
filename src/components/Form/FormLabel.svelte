<script lang="ts">
  import { randomUUID } from '../../utils/random';

  let { id = randomUUID(), label = '', forId, class: className = '' } = $props();
</script>

<label class="form-label {className}" for={forId} {id}>{label}</label>

<style>
  .form-label {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-secondary);
  }
</style>

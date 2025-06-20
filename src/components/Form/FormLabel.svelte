<script lang="ts">
  import { randomUUID } from '../../utils/random';

  let { id = randomUUID(), label = '', forId } = $props();
</script>

<label class="form-label" for={forId} {id}>{label}</label>

<style>
  .form-label {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
  }
</style>

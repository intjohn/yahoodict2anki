<script lang="ts">
  let { label, checked = $bindable(false), disabled, ...rest } = $props();
</script>

<div class="checkbox-container">
  <input type="checkbox" id="allowDuplicate" bind:checked {disabled} {...rest} />
  <label for="allowDuplicate" class:disabled>{label}</label>
</div>

<style>
  .checkbox-container {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #666;
    font-size: 14px;
  }
  input[type='checkbox'] {
    margin: 0;
    cursor: pointer;
  }
  input[type='checkbox']:disabled {
    cursor: not-allowed;
  }
  label {
    cursor: pointer;
  }
  label.disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
</style>

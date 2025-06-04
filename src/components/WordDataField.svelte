<script lang="ts">
  export let label: string;
  export let value: string = '';
  export let modelFields: string[] = [];
  export let selectedField: string = '';
  export let disabled = false;
</script>

<div class="field">
  <div class="field-label">{label}</div>
  <div class="field-content">{value}</div>
  <div class="field-mapping">
    <select bind:value={selectedField} on:change {disabled}>
      <option value="">-- Map to field --</option>
      {#each modelFields as field}
        <option value={field}>{field}</option>
      {/each}
    </select>
  </div>
</div>

<style>
  .field {
    margin-bottom: 15px;
  }
  .field:last-child {
    margin-bottom: 0;
  }
  .field-label {
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
  }
  .field-content {
    color: #666;
    line-height: 1.5;
    margin-bottom: 8px;
    background: #f8f9fa;
    padding: 8px;
    border-radius: 4px;
  }
  .field-mapping {
    margin-top: 4px;
    font-size: 14px;
  }
  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.8rem;
  }
  select:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
</style>

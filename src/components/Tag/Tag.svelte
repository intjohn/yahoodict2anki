<script lang="ts">
  const { text, onClose, disabled = false } = $props();

  const displayText = $derived(text.length > 20 ? text.slice(0, 20) + '...' : text);
  const title = $derived(text.length > 20 ? text : '');
</script>

{#if text}
  <div class="tag" class:disabled>
    <span class="text" {title}>{displayText}</span>
    <button class="close-button" onclick={onClose} aria-label="Remove tag" {disabled}> × </button>
  </div>
{/if}

<style>
  .tag {
    display: inline-flex;
    align-items: center;
    background-color: #e9ecef;
    border-radius: 16px;
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
    color: #495057;
    margin: 4px;
    transition: background-color 0.2s ease;
  }

  .tag:hover {
    background-color: #dee2e6;
  }

  .tag.disabled {
    background-color: #f0f0f0;
    color: #6c757d;
    cursor: default;
  }

  .text {
    margin-right: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .close-button {
    background: none;
    border: none;
    color: #6c757d;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    padding: 0;
    margin-left: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    transition: background-color 0.2s ease;
  }

  .close-button:hover {
    background-color: #ced4da;
    color: #495057;
  }

  .close-button:disabled {
    display: none;
  }
</style>

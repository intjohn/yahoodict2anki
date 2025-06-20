<script lang="ts">
  import FormGroup from '../Form/FormGroup.svelte';
  import FormLabel from '../Form/FormLabel.svelte';
  import SuggestionInput from '../SuggestionInput/SuggestionInput.svelte';
  import Tag from '../Tag/Tag.svelte';
  import { randomUUID } from '../../utils/random';

  let {
    label = '',
    id = randomUUID(),
    inputValue = $bindable(''),
    suggestions = [],
    pickedTags = [],
    disabled = false,
    onPick = () => {},
    onInput = () => {},
    onRemove = () => {},
  } = $props();

  let highlightedTag = $state('');

  function highlightTag(tag: string) {
    highlightedTag = tag;
    setTimeout(() => {
      highlightedTag = '';
    }, 600);
  }

  function handlePick(value: string) {
    const trimmedValue = value.trim();
    if (!trimmedValue) return;

    if (pickedTags.includes(trimmedValue)) {
      highlightTag(trimmedValue);
    } else {
      onPick(trimmedValue);
    }
  }

  function handleRemove(tagName: string) {
    onRemove(tagName);
  }
</script>

{#snippet tagPicker()}
  <div class="tag-picker">
    <div class="tags-container">
      {#if !pickedTags.length}
        <div class="no-tags-message">
          No tags picked yet. Use the input field to search and add tags
        </div>
      {/if}
      {#each pickedTags as tag (tag)}
        <div class="tag-wrapper" class:highlighted={tag === highlightedTag}>
          <Tag text={tag} onClose={() => handleRemove(tag)} {disabled} />
        </div>
      {/each}
    </div>

    <SuggestionInput
      bind:value={inputValue}
      {suggestions}
      {disabled}
      onEnter={handlePick}
      {onInput}
      placeholder="Type to add tags..."
    />
  </div>
{/snippet}

{#if label}
  <FormGroup>
    <FormLabel forId={id} {label} />
    {@render tagPicker()}
  </FormGroup>
{:else}
  {@render tagPicker()}
{/if}

<style>
  .tag-picker {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    min-height: 24px;
    max-height: 120px;
    overflow-y: auto;
    padding: 4px;
    border: 1px solid #eee;
    border-radius: 4px;
    background-color: #fafafa;
  }

  .tags-container::-webkit-scrollbar {
    width: 6px;
  }

  .tags-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  .tags-container::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  .tags-container::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  .tag-wrapper {
    transition: transform 0.1s ease;
  }

  .tag-wrapper.highlighted {
    animation: vibrate 0.6s ease-in-out;
  }

  @keyframes vibrate {
    0%,
    100% {
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateX(-2px);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translateX(2px);
    }
  }

  .no-tags-message {
    color: #6c757d;
    font-size: 0.75rem;
    padding: 4px;
  }
</style>

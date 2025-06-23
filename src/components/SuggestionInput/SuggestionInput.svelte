<script lang="ts">
  import Input from '../Form/Input.svelte';
  import { randomUUID } from '../../utils/random';
  import SuggestionText from './SuggestionText.svelte';

  let {
    id = randomUUID(),
    name = '',
    value = $bindable(''),
    suggestions = [],
    placeholder = '',
    disabled = false,
    onEnter = () => {},
    onInput = () => {},
  } = $props();

  let navigateIndex = $state(-1);
  let selected = $state(false);
  let picked = $state(false);
  let focused = $state(false);
  let dismissed = $state(false);
  let inputElement: HTMLInputElement | null = $state(null);

  function handleInput() {
    navigateIndex = -1;
    selected = false;
    picked = false;
    dismissed = false;
    onInput();
  }

  function selectSuggestion() {
    const suggestion = suggestions[navigateIndex];
    value = suggestion;
    navigateIndex = -1;
    inputElement?.focus();
    selected = true;
  }

  function handleInputClick() {
    selected = false;
    picked = false;
    dismissed = false;
    if (navigateIndex !== -1) {
      navigateIndex = -1;
    }
  }

  function handleItemClick(event: MouseEvent) {
    event.preventDefault();
    selectSuggestion();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        picked = false;
        navigateIndex = Math.min(navigateIndex + 1, suggestions.length - 1);
        selected = false;
        break;
      case 'ArrowUp':
        event.preventDefault();
        navigateIndex = Math.max(navigateIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (navigateIndex >= 0) {
          selectSuggestion();
        } else if (value) {
          onEnter(value);
          selected = false;
          picked = true;
        }
        break;
      case 'Escape':
        navigateIndex = -1;
        if (dismissed) {
          inputElement?.blur();
        } else {
          dismissed = true;
        }
        break;
    }
  }

  function handleBlur() {
    selected = false;
    picked = false;
    focused = false;
  }
</script>

<div class="suggestion-input">
  <span
    class="input-wrapper"
    class:readyenter={value && navigateIndex === -1 && !disabled && focused}
  >
    <Input
      {id}
      {name}
      type="text"
      bind:bindInput={inputElement}
      bind:value
      {placeholder}
      {disabled}
      onblur={handleBlur}
      onfocus={() => (focused = true)}
      onmousedown={handleInputClick}
      onmouseenter={() => (navigateIndex = -1)}
      oninput={handleInput}
      onkeydown={handleKeydown}
      class={`suggestion-input__input ${selected ? 'selected' : ''}`}
    />
  </span>
  {#if suggestions.length > 0 && !selected && !picked && focused && !dismissed}
    <div class="suggestions" role="listbox">
      {#each suggestions as suggestion, index (suggestion)}
        <div
          class="suggestion-item"
          class:navigated={index === navigateIndex}
          onmousedown={handleItemClick}
          onmouseenter={() => (navigateIndex = index)}
          role="option"
          aria-selected={index === navigateIndex}
          tabindex={index === navigateIndex ? 0 : -1}
        >
          <SuggestionText text={suggestion} match={value} />
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .suggestion-input {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
  }

  .suggestion-input :global(.suggestion-input__input.selected) {
    background-color: #f0faff;
  }

  /* .input {
    color: #333;
    width: 15rem;
    padding: 0.375rem 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.75rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .input.selected {
    background-color: #f0faff;
  }

  .input:focus {
    border-color: #007bff;
  }

  .input:disabled {
    background-color: #f5f5f5;
    color: #9aa1a9;
    cursor: not-allowed;
  } */

  .input-wrapper {
    align-self: flex-start;
    position: relative;
  }

  .input-wrapper::after {
    content: '↵';
    right: 1rem;
    top: 1rem;
    transform: translateY(-30%);
    font-size: 0.75rem;
    color: #333;
    position: absolute;
    transition:
      opacity 0.2s,
      transform 0.2s;
    opacity: 0;
  }

  .input-wrapper.readyenter::after {
    opacity: 0.5;
  }

  .suggestions {
    position: absolute;
    top: calc(100% - 0.375rem);
    left: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-height: 200px;
    min-width: 10rem;
    overflow-y: auto;
    display: none;
    font-size: 0.75rem;
  }

  .input-wrapper:focus-within + .suggestions {
    display: flex;
    flex-direction: column;
  }

  .suggestion-item {
    padding: 0.375rem 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .suggestion-item:hover {
    background-color: #f5f5f5;
  }

  .suggestion-item.navigated {
    background-color: #e9ecef;
  }
</style>

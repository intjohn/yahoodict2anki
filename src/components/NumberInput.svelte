<script lang="ts">
  import FormGroup from './Form/FormGroup.svelte';
  import FormLabel from './Form/FormLabel.svelte';
  import Input from './Form/Input.svelte';
  import { randomUUID } from '../utils/random';

  let {
    label = '',
    value = $bindable(),
    min,
    max,
    id = randomUUID(),
    errorMessage,
    onInput = () => {},
    onChange = () => {},
    class: className = '',
    labelClass = '',
  } = $props();

  function handleInput(event: Event) {
    onInput(event);
  }

  function handleChange(event: Event) {
    onChange(event);
  }
</script>

{#snippet numberInput(inputClass = '')}
  <Input
    class="number-input__input {inputClass}"
    type="number"
    {id}
    bind:value
    {min}
    {max}
    onchange={handleChange}
    oninput={handleInput}
    {errorMessage}
  />
{/snippet}

{#if label}
  <FormGroup class={className}>
    <FormLabel forId={id} {label} class={labelClass} />
    {@render numberInput()}
  </FormGroup>
{:else}
  {@render numberInput(className)}
{/if}

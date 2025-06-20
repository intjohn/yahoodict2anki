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
  } = $props();

  function handleInput(event: Event) {
    onInput(event);
  }

  function handleChange(event: Event) {
    onChange(event);
  }
</script>

{#snippet numberInput()}
  <Input
    class="number-input__input"
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
  <FormGroup>
    <FormLabel forId={id} {label} />
    {@render numberInput()}
  </FormGroup>
{:else}
  {@render numberInput()}
{/if}

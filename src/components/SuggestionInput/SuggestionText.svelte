<script lang="ts">
  let {
    text,
    match,
  }: {
    text: string;
    match: string;
  } = $props();

  let trimmedMatch = $derived(match.trim().toLowerCase());
  let matchIndex = $derived(text.toLowerCase().indexOf(trimmedMatch));
</script>

<span class="suggestion-text">
  {#if matchIndex === -1}
    {text}
  {:else}
    {text.slice(0, matchIndex)}<span class="matchedpart"
      >{text.slice(matchIndex, matchIndex + trimmedMatch.length)}</span
    >{text.slice(matchIndex + trimmedMatch.length)}
  {/if}
</span>

<style>
  .suggestion-text {
    color: #333;
  }

  .matchedpart {
    color: #007bff;
    font-weight: 600;
  }
</style>

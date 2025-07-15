<script lang="ts">
  import LinkButton from '../components/LinkButton.svelte';
  export let port: string = '8765';
</script>

<div class="error-message">
  <h2>連線到 Anki 失敗</h2>
  <p>請確認：</p>
  <ul>
    <li>Anki 正在執行</li>
    <li>Anki 外掛程式 AnkiConnect 已安裝</li>
    <li>
      連線到 AnkiConnect 的埠號（目前為 {port}）已正確設定。您可以在擴充套件的<LinkButton on:click
        >選項</LinkButton
      >中編輯設定。
    </li>
  </ul>
</div>

<style>
  .error-message {
    padding: var(--spacing-xl) var(--spacing-lg);
    color: var(--color-text-secondary);
  }
  h2 {
    margin: 0 0 10px;
    font-size: var(--font-size-lg);
  }
  p {
    margin: 0;
    font-size: var(--font-size-sm);
  }
  ul {
    margin-top: var(--spacing-sm);
    padding-left: var(--spacing-md);
  }
  li {
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-xs);
  }
</style>

<script lang="ts">
  export let size: number = 40;
</script>

<style>
  .spinner {
    display: inline-block;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #4caf50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }
</style>

<div class="spinner-container">
  <div 
    class="spinner" 
    style="width: {size}px; height: {size}px;"
  ></div>
</div> 
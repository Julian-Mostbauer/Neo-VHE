<script lang="ts">
  import { shapeStore } from "./shapestore";
  import { supportedHtmlElements } from "./customTypes";
</script>

<div id="circleOptions" class="options">
  <label>
    left:
    <input type="number" bind:value={$shapeStore.left} placeholder="Left" />
  </label>
  <label>
    top:
    <input type="number" bind:value={$shapeStore.top} placeholder="Top" />
  </label>
  <label>
    fill:
    <input type="color" bind:value={$shapeStore.fill} placeholder="Fill" />
  </label>
  <label>
    radius:
    <input type="number" bind:value={$shapeStore.radius} placeholder="Fill" />
  </label>
  <label>
    HTML Element:
    <select bind:value={$shapeStore.htmlElement}>
      {#each supportedHtmlElements.filter(n => n != "nullElement") as htmlElement}
        <option value={htmlElement}>{htmlElement}</option>
      {/each}
    </select>
  </label>
</div>

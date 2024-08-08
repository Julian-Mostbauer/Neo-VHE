<script lang="ts">
  import { shapeStore } from "./shapestore";
  import { supportedHtmlElements } from "./customTypes";
</script>

<div id="ellipseOptions" class="options">
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
    rx:
    <input type="number" bind:value={$shapeStore.rx} placeholder="rx" />
  </label>
  <label>
    ry:
    <input type="number" bind:value={$shapeStore.ry} placeholder="ry" />
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

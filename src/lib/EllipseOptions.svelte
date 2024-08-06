<script lang="ts">
  import { shapeStore } from "./shapestore";
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
</div>

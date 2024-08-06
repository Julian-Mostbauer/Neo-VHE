<script lang="ts">
  import { shapeStore } from "./shapestore";
</script>

<div id="rectOptions" class="options">
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
    width:
    <input type="number" bind:value={$shapeStore.width} placeholder="Width" />
  </label>
  <label>
    height:
    <input type="number" bind:value={$shapeStore.height} placeholder="Height" />
  </label>
  <label>
    angle:
    <input type="number" bind:value={$shapeStore.angle} placeholder="Angle" />
  </label>
</div>

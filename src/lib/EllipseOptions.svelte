<script lang="ts">
  import { shapeStore } from "./shapestore";
  import type { ShapeData } from "./shapestore";

  let shapeData: ShapeData = {
    left: 0,
    top: 0,
    fill: "#000000",
    width: 100,
    height: 100,
    angle: 0,
    radius: 0,
    rx: 0,
    ry: 0,
    htmlElement: "button",
  };

  shapeStore.subscribe((value) => {
    shapeData = value;
  });

  let tmp_left = shapeData?.left ?? 0;
  let tmp_top = shapeData?.top ?? 0;
  let tmp_fill = shapeData?.fill ?? "#000000";
  let tmp_rx = shapeData?.rx ?? 100;
  let tmp_ry = shapeData?.ry ?? 0;

  $: {
    shapeStore.update((value) => {
      value.left = tmp_left;
      value.top = tmp_top;
      value.fill = tmp_fill;
      value.rx = tmp_rx;
      value.ry = tmp_ry;
      return value;
    });
  }
</script>

<div id="ellipseOptions" class="options">
  <label>
    left:
    <input type="number" bind:value={tmp_left} placeholder="Left" />
  </label>
  <label>
    top:
    <input type="number" bind:value={tmp_top} placeholder="Top" />
  </label>
  <label>
    fill:
    <input type="color" bind:value={tmp_fill} placeholder="Fill" />
  </label>
  <label>
    rx:
    <input type="number" bind:value={tmp_rx} placeholder="rx" />
  </label>
  <label>
    ry:
    <input type="number" bind:value={tmp_ry} placeholder="ry" />
  </label>
</div>
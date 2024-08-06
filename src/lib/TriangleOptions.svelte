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
  let tmp_width = shapeData?.width ?? 100;
  let tmp_height = shapeData?.height ?? 100;
  let tmp_angle = shapeData?.angle ?? 0;

  $: {
    shapeStore.update((value) => {
      value.left = tmp_left;
      value.top = tmp_top;
      value.fill = tmp_fill;
      value.width = tmp_width;
      value.height = tmp_height;
      value.angle = tmp_angle;
      return value;
    });
  }
</script>

<div id="triangleOptions" class="options">
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
    width:
    <input type="number" bind:value={tmp_width} placeholder="Width" />
  </label>
  <label>
    height:
    <input type="number" bind:value={tmp_height} placeholder="Height" />
  </label>
</div>
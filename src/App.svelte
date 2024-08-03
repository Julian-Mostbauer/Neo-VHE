<script>
  import { onMount } from "svelte";

  function drawSquare() {
    const canvas = new fabric.Canvas("c");
    let rect = new fabric.Rect({
      left: 120,
      top: 10,
      fill: "blue",
      width: 150,
      height: 150,
      angle: 45,
    });
    canvas.add(rect);
  }
</script>

<svelte:head>
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/500/fabric.min.js"
  ></script>
</svelte:head>

<div>
  <canvas class="main-canvas" id="c" on:click={drawSquare}></canvas>
</div>

<style>
  .main-canvas {
    width: 250px;
    height: 250px;
    border: 1px solid #000000;
  }
</style>

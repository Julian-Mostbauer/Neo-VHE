<script lang="ts">
  import { onMount } from "svelte";
  import { tick } from "svelte";

  let selectedOption: string = "rect";

  const canvasDimensions = {
    width: 1500,
    height: 800,
  };
  
  let canvas: fabric.Canvas;

  let left: number = 120;
  let top: number = 10;
  let fill: string = "black";
  let width: number = 150;
  let height: number = 150;
  let angle: number = 45;
  let radius: number = 50;
  let rx: number = 50;
  let ry: number = 100;

  function initializeCanvas() {
    const canvasElement = document.getElementById("c") as HTMLCanvasElement;
    if (canvasElement) {
      canvasElement.width = canvasDimensions.width;
      canvasElement.height = canvasDimensions.height;
      canvas = new fabric.Canvas(canvasElement);
    }
  }

  onMount(async () => {
    await tick();
    if (typeof fabric !== "undefined") {
      initializeCanvas();
    } else {
      window.addEventListener("load", () => {
        initializeCanvas();
      });
    }
  });

  function addRectangle() {
    if (canvas) {
      const rect = new fabric.Rect({
        left: left,
        top: top,
        fill: fill,
        width: width,
        height: height,
        angle: angle,
      });
      canvas.add(rect);
    }
  }

  function addCircle() {
    if (canvas) {
      const circle = new fabric.Circle({
        radius: radius,
        fill: fill,
        left: left,
        top: top,
      });
      canvas.add(circle);
    }
  }

  function addEllipse() {
    if (canvas) {
      const ellipse = new fabric.Ellipse({
        rx: rx,
        ry: ry,
        fill: fill,
        left: left,
        top: top,
      });
      canvas.add(ellipse);
    }
  }

  function addTriangle() {
    if (canvas) {
      const triangle = new fabric.Triangle({
        width: width,
        height: height,
        fill: fill,
        left: left,
        top: top,
      });
      canvas.add(triangle);
    }
  }

  function addRandomPolygon(){
    if (canvas) {
      let points = []
      for (let i = 0; i < (2.5 + Math.random() * 10); i++) {
        points.push({
          x: Math.random() * canvasDimensions.width,
          y: Math.random() * canvasDimensions.height,
        });
      }      
      const polygon = new fabric.Polygon(points, {
        left: Math.random() * canvasDimensions.width,
        top: Math.random() * canvasDimensions.height,
        fill: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},${Math.random()})`,
        angle: Math.random() * 360,
      });
      canvas.add(polygon);
    }
  }

  function clearCanvas() {
    if (canvas) {
      canvas.clear();
    }
  }
</script>

<svelte:head>
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.2.4/fabric.min.js"
  ></script>
</svelte:head>

<main>
  <div id="allOptions" class="control-panel">
    <select bind:value={selectedOption}>
      <option value="rect">Rectangle</option>
      <option value="circle">Circle</option>
      <option value="ellipse">Ellipse</option>
      <option value="triangle">Triangle</option>
      <option value="polygon">Polygon</option>
    </select>

    <button on:click={clearCanvas}>Clear Canvas</button>

    {#if selectedOption === "rect"}
      <div id="rectOptions" class="options">
        <label>
          left:
          <input type="number" bind:value={left} placeholder="Left" />
        </label>
        <label>
          top:
          <input type="number" bind:value={top} placeholder="Top" />
        </label>
        <label>
          fill:
          <input type="color" bind:value={fill} placeholder="Fill" />
        </label>
        <label>
          width:
          <input type="number" bind:value={width} placeholder="Width" />
        </label>
        <label>
          height:
          <input type="number" bind:value={height} placeholder="Height" />
        </label>
        <label>
          angle:
          <input type="number" bind:value={angle} placeholder="Angle" />
        </label>
        <button on:click={addRectangle}>Add Rectangle</button>
      </div>
    {/if}

    {#if selectedOption === "circle"}
      <div id="circleOptions" class="options">
        <label>
          left:
          <input type="number" bind:value={left} placeholder="Left" />
        </label>
        <label>
          top:
          <input type="number" bind:value={top} placeholder="Top" />
        </label>
        <label>
          fill:
          <input type="color" bind:value={fill} placeholder="Fill" />
        </label>
        <label>
          radius:
          <input type="number" bind:value={radius} placeholder="Fill" />
        </label>

        <button on:click={addCircle}>Add Circle</button>
      </div>
    {/if}

    {#if selectedOption === "ellipse"}
      <div id="ellipseOptions" class="options">
        <label>
          left:
          <input type="number" bind:value={left} placeholder="Left" />
        </label>
        <label>
          top:
          <input type="number" bind:value={top} placeholder="Top" />
        </label>
        <label>
          fill:
          <input type="color" bind:value={fill} placeholder="Fill" />
        </label>
        <label>
          rx:
          <input type="number" bind:value={rx} placeholder="rx" />
        </label>
        <label>
          ry:
          <input type="number" bind:value={ry} placeholder="ry" />
        </label>
        <button on:click={addEllipse}>Add Ellipse</button>
      </div>
    {/if}

    {#if selectedOption === "triangle"}
      <div id="triangleOptions" class="options">
        <label>
          left:
          <input type="number" bind:value={left} placeholder="Left" />
        </label>
        <label>
          top:
          <input type="number" bind:value={top} placeholder="Top" />
        </label>
        <label>
          fill:
          <input type="color" bind:value={fill} placeholder="Fill" />
        </label>
        <label>
          width:
          <input type="number" bind:value={width} placeholder="Width" />
        </label>
        <label>
          height:
          <input type="number" bind:value={height} placeholder="Height" />
        </label>
        <button on:click={addTriangle}>Add Triangle</button>
      </div>
    {/if}
      
      {#if selectedOption === "polygon"}
        <div id="polygonOptions" class="options">
          <button on:click={addRandomPolygon}>Add Random Polygon</button>
        </div>
      {/if}
  </div>

  <canvas class="main-canvas" id="c"></canvas>
</main>

<style>
  input {
    margin: 0.5rem;
    padding: 0.5rem;
  }

  .main-canvas {
    border: 2px solid #000000;
    border-radius: 0.5rem;
    position: absolute;
  }
  .options {
    display: flex;
    flex-direction: column;
    align-items: right;
    padding: 1rem;
    margin: 1rem;
  }

  .control-panel {
    display: flex;
    flex-direction: column;
    align-items: right;
    padding: 1rem;
    border: solid 2px #000000;
    border-radius: 1rem;
    min-width: 20rem;
    margin: 1rem;
  }

  main {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-family: "Courier New", Courier, monospace;
    font-weight: 700;
  }

  button {
    margin: 0.5rem;
    padding: 0.5rem;
    font-family: inherit;
    font-weight: inherit;
  }

  select {
    margin: 0.5rem;
    padding: 0.5rem;
    font-family: inherit;
    font-weight: inherit;
  }

  input {
    margin: 0.5rem;
    padding: 0.5rem;
    font-family: inherit;
    font-weight: inherit;
    width: 6rem;
  }
</style>

<script lang="ts">
  import { onMount } from "svelte";
  import { tick } from "svelte";
  import { shapeStore } from "./lib/shapestore";
  import type { ShapeData } from "./lib/shapestore";
  import { get } from "svelte/store";

  import type { HtmlElement, Shape } from "./lib/customTypes.ts";

  import RectOptions from "./lib/RectOptions.svelte";
  import CircleOptions from "./lib/CircleOptions.svelte";
  import EllipseOptions from "./lib/EllipseOptions.svelte";
  import TriangleOptions from "./lib/TriangleOptions.svelte";

  let selectedOption: Shape = "rect";
  let notification = {
    text: "This is a notification!",
    isVisible: false,
  };

  const canvasDimensions = {
    width: 1500,
    height: 800,
  };

  let canvas: fabric.Canvas;

  let shapeData: ShapeData;
  shapeStore.subscribe((value) => {
    shapeData = value;
  });

  function initializeCanvas() {
    const canvasElement = document.getElementById("c") as HTMLCanvasElement;
    if (canvasElement) {
      canvasElement.width = canvasDimensions.width;
      canvasElement.height = canvasDimensions.height;
      // @ts-ignore
      canvas = new fabric.Canvas(canvasElement);
    }
  }

  onMount(async () => {
    await tick();
    // @ts-ignore
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
      // @ts-ignore
      const rect = new fabric.Rect({
        left: shapeData.left,
        top: shapeData.top,
        fill: shapeData.fill,
        width: shapeData.width,
        height: shapeData.height,
        angle: shapeData.angle,
      });

      rect.strokeLineCap = shapeData.htmlElement;
      canvas.add(rect);
    }
  }

  function addCircle() {
    if (canvas) {
      // @ts-ignore
      const circle = new fabric.Circle({
        radius: shapeData.radius,
        fill: shapeData.fill,
        left: shapeData.left,
        top: shapeData.top,
      });
      canvas.add(circle);
    }
  }

  function addEllipse() {
    if (canvas) {
      // @ts-ignore
      const ellipse = new fabric.Ellipse({
        rx: shapeData.rx,
        ry: shapeData.ry,
        fill: shapeData.fill,
        left: shapeData.left,
        top: shapeData.top,
      });
      canvas.add(ellipse);
    }
  }

  function addTriangle() {
    if (canvas) {
      // @ts-ignore
      const triangle = new fabric.Triangle({
        width: shapeData.width,
        height: shapeData.height,
        fill: shapeData.fill,
        left: shapeData.left,
        top: shapeData.top,
      });
      canvas.add(triangle);
    }
  }

  function addRandomPolygon() {
    if (canvas) {
      let points = [];
      for (let i = 0; i < 2.5 + Math.random() * 10; i++) {
        points.push({
          x: Math.random() * canvasDimensions.width,
          y: Math.random() * canvasDimensions.height,
        });
      }
      // @ts-ignore
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

  function showNotification(text: string, duration: number = 3000) {
    notification.isVisible = true;
    notification.text = text;
    setTimeout(() => {
      notification.isVisible = false;
    }, duration); // Hide after 3 seconds
  }

  function exportToClipboard() {
    if (canvas) {
      const data = canvas.toJSON().objects.map((obj): string => {
        function isHtmlElement(value: string): value is HtmlElement {
          return (
            value === "button" ||
            value === "div" ||
            value === "span" ||
            value === "input" ||
            value === "select" ||
            value === "option" ||
            value === "label"
          );
        }
        // @ts-ignore
        if (!isHtmlElement(obj.strokeLineCap)) {
          obj.strokeLineCap = "nullElement";
        }

        return JSON.stringify(obj);
      });

      if (data) {
        navigator.clipboard.writeText(data.join("\n"));
        showNotification("Canvas data copied to clipboard!");
      } else {
        showNotification("No data to copy!");
      }
    }
  }
</script>

<svelte:head>
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.2.4/fabric.min.js"
  ></script>
</svelte:head>

<main>
  {#if notification.isVisible}
    <div class="notification">{notification.text}</div>
  {/if}

  <div id="allOptions" class="control-panel">
    <select bind:value={selectedOption}>
      <option value="rect">Rectangle</option>
      <option value="circle">Circle</option>
      <option value="ellipse">Ellipse</option>
      <option value="triangle">Triangle</option>
      <option value="polygon">Polygon</option>
    </select>

    <button on:click={clearCanvas}>Clear Canvas</button>
    <button on:click={exportToClipboard}>Export</button>

    {#if selectedOption === "rect"}
      <RectOptions />
      <button on:click={addRectangle}>Add Rectangle</button>
    {/if}

    {#if selectedOption === "circle"}
      <CircleOptions />
      <button on:click={addCircle}>Add Circle</button>
    {/if}

    {#if selectedOption === "ellipse"}
      <EllipseOptions />
      <button on:click={addEllipse}>Add Ellipse</button>
    {/if}

    {#if selectedOption === "triangle"}
      <TriangleOptions />
      <button on:click={addTriangle}>Add Triangle</button>
    {/if}

    {#if selectedOption === "polygon"}
      <div id="polygonOptions" class="options">
        <button on:click={addRandomPolygon}>Add Random Polygon</button>
      </div>
    {/if}
  </div>

  <canvas class="main-canvas" id="c"></canvas>
</main>
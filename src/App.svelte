<script lang="ts">
  import { onMount } from "svelte";
  import { tick } from "svelte";

  import type { HtmlElement, Shape } from "./lib/customTypes.ts";

  import { shapeStore } from "./lib/shapestore";
  import {
    isHtmlElement,
    supportedShapes,
    supportedHtmlElements,
  } from "./lib/customTypes";

  import RectOptions from "./lib/RectOptions.svelte";
  import CircleOptions from "./lib/CircleOptions.svelte";
  import EllipseOptions from "./lib/EllipseOptions.svelte";
  import TriangleOptions from "./lib/TriangleOptions.svelte";
  import PolygonOptions from "./lib/PolygonOptions.svelte";

  const optionsMap: Record<string, { component: any; label: string }> = {
    rect: { component: RectOptions, label: "Rectangle" },
    circle: { component: CircleOptions, label: "Circle" },
    ellipse: { component: EllipseOptions, label: "Ellipse" },
    triangle: { component: TriangleOptions, label: "Triangle" },
    polygon: { component: PolygonOptions, label: "Polygon" },
  };

  const canvasDimensions = {
    width: 1500,
    height: 800,
  };

  let selectedOption: Shape = "rect";
  let notification = {
    text: "This is a notification!",
    isVisible: false,
  };

  let canvas: fabric.Canvas;

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

  function addShape() {
    if (canvas) {
      let shape;
      switch (selectedOption) {
        case "rect":
          // @ts-ignore
          shape = new fabric.Rect({
            left: $shapeStore.left,
            top: $shapeStore.top,
            fill: $shapeStore.fill,
            width: $shapeStore.width,
            height: $shapeStore.height,
            angle: $shapeStore.angle,
          });
          break;
        case "circle":
          // @ts-ignore
          shape = new fabric.Circle({
            radius: $shapeStore.radius,
            fill: $shapeStore.fill,
            left: $shapeStore.left,
            top: $shapeStore.top,
          });
          break;
        case "ellipse":
          // @ts-ignore
          shape = new fabric.Ellipse({
            rx: $shapeStore.rx,
            ry: $shapeStore.ry,
            fill: $shapeStore.fill,
            left: $shapeStore.left,
            top: $shapeStore.top,
          });
          break;
        case "triangle":
          // @ts-ignore
          shape = new fabric.Triangle({
            width: $shapeStore.width,
            height: $shapeStore.height,
            fill: $shapeStore.fill,
            left: $shapeStore.left,
            top: $shapeStore.top,
            angle: $shapeStore.angle,
          });
          break;
        case "polygon":
          // @ts-ignore
          shape = new fabric.Polygon($shapeStore.points, {
            fill: $shapeStore.fill,
            left: $shapeStore.left,
            top: $shapeStore.top,
          });
          break;
        default:
          break;
      }
      if (shape) {
        // the htmlElement is saved within the strokeLineCap property
        shape.strokeLineCap = $shapeStore.htmlElement;
        canvas.add(shape);
      }
    }
  }

  function randomizeData() {
    let points = [];
    for (let i = 0; i < 2.5 + Math.random() * 10; i++) {
      points.push({
        x: Math.random() * canvasDimensions.width,
        y: Math.random() * canvasDimensions.height,
      });
    }
    $shapeStore.points = points;
    $shapeStore.left = Math.random() * canvasDimensions.width;
    $shapeStore.top = Math.random() * canvasDimensions.height;
    $shapeStore.fill = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    $shapeStore.angle = Math.random() * 360;
    $shapeStore.width = Math.random() * canvasDimensions.width;
    $shapeStore.height = Math.random() * canvasDimensions.height;
    $shapeStore.rx = Math.random() * canvasDimensions.width;
    $shapeStore.ry = Math.random() * canvasDimensions.height;
    $shapeStore.htmlElement = supportedHtmlElements[
      Math.floor(Math.random() * supportedHtmlElements.length)
    ] as HtmlElement;
    $shapeStore.radius =
      (Math.random() *
        Math.min(canvasDimensions.height, canvasDimensions.width)) /
      2;
    shapeStore.set($shapeStore);
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
    }, duration);
  }

  function exportToClipboard() {
    if (canvas) {
      let nullElementFlag = false;
      const data = canvas.toJSON().objects.map((obj): string => {
        // @ts-ignore
        // the htmlElement is saved within the strokeLineCap property
        if (!isHtmlElement(obj.strokeLineCap)) {
          nullElementFlag = true;
          obj.strokeLineCap = "nullElement";
        }
        return JSON.stringify(obj);
      });

      if (data.length === 0) {
        showNotification("No data to copy!");
        return;
      }

      navigator.clipboard.writeText(data.join("\n"));

      showNotification(
        !nullElementFlag
          ? "Canvas data copied to clipboard!"
          : "Canvas data copied to clipboard! Some objects had null elements."
      );
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
      {#each supportedShapes as shape}
        <option value={shape}>{shape}</option>
      {/each}
    </select>

    <button on:click={clearCanvas}>Clear Canvas</button>
    <button on:click={exportToClipboard}>Export</button>
    <button on:click={randomizeData}>Randomize Values</button>

    {#if optionsMap[selectedOption]}
      <svelte:component this={optionsMap[selectedOption].component} />
      <button on:click={addShape}>Add {optionsMap[selectedOption].label}</button
      >
    {/if}
  </div>

  <canvas class="main-canvas" id="c"></canvas>
</main>

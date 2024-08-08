<script lang="ts">
  import { onMount } from "svelte";
  import { tick } from "svelte";
  import { get } from "svelte/store";

  import type { ShapeData } from "./lib/shapestore";
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

  function addShape() {
    if (canvas) {
      let shape;
      switch (selectedOption) {
        case "rect":
          // @ts-ignore
          shape = new fabric.Rect({
            left: shapeData.left,
            top: shapeData.top,
            fill: shapeData.fill,
            width: shapeData.width,
            height: shapeData.height,
            angle: shapeData.angle,
          });
          shape.strokeLineCap = shapeData.htmlElement;
          break;
        case "circle":
          // @ts-ignore
          shape = new fabric.Circle({
            radius: shapeData.radius,
            fill: shapeData.fill,
            left: shapeData.left,
            top: shapeData.top,
          });
          break;
        case "ellipse":
          // @ts-ignore
          shape = new fabric.Ellipse({
            rx: shapeData.rx,
            ry: shapeData.ry,
            fill: shapeData.fill,
            left: shapeData.left,
            top: shapeData.top,
          });
          break;
        case "triangle":
          // @ts-ignore
          shape = new fabric.Triangle({
            width: shapeData.width,
            height: shapeData.height,
            fill: shapeData.fill,
            left: shapeData.left,
            top: shapeData.top,
            angle: shapeData.angle,
          });
          break;
        case "polygon":
          // @ts-ignore
          shape = new fabric.Polygon(shapeData.points, {
            fill: shapeData.fill,
            left: shapeData.left,
            top: shapeData.top,
          });
          break;
        default:
          break;
      }
      if (shape) {
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
    shapeData.points = points;
    shapeData.left = Math.random() * canvasDimensions.width;
    shapeData.top = Math.random() * canvasDimensions.height;
    shapeData.fill = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    shapeData.angle = Math.random() * 360;
    shapeData.width = Math.random() * canvasDimensions.width;
    shapeData.height = Math.random() * canvasDimensions.height;
    shapeData.rx = Math.random() * canvasDimensions.width;
    shapeData.ry = Math.random() * canvasDimensions.height;
    shapeData.htmlElement = supportedHtmlElements[
      Math.floor(Math.random() * supportedHtmlElements.length)
    ] as HtmlElement;
    shapeData.radius =
      (Math.random() *
        Math.min(canvasDimensions.height, canvasDimensions.width)) /
      2;
    shapeStore.set(shapeData);
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

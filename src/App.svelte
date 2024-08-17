<script lang="ts">
  import { onMount } from "svelte";
  import { tick } from "svelte";

  import { endpoint } from "./lib/internals";
  import { shapeStore } from "./lib/shapestore";

  import { notifications, addNotification } from "./lib/notificationStore";

  function showNotification(text: string, liveTime = 5000) {
    addNotification(text, liveTime);
  }

  import type {
    canvasOutputData,
    headerData,
    HtmlElement,
    exportDataFlags,
    Shape,
  } from "./lib/customTypes.ts";

  import {
    isHtmlElement,
    supportedShapes,
    supportedHtmlElements,
    getDataFlags,
    generateWarnings,
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

  let headerData: headerData = {
    title: "Default-Title",
    icon: "https://cdn.oaistatic.com/_next/static/media/favicon-32x32.630a2b99.png",
  };

  let selectedOption: Shape = "rect";

  let generatedHtml = {
    content: "Default generated HTML! This should not be visible!",
    visible: false,
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

  function getCanvasData(): [canvasOutputData, exportDataFlags] {
    let outputdata: canvasOutputData = {
      headerData: headerData,
      shapes: canvas.toJSON().objects,
    };

    return [outputdata, getDataFlags(outputdata.shapes)];
  }

  function exportToClipboard() {
    if (canvas) {
      const [data, dataFlags] = getCanvasData();

      navigator.clipboard.writeText(JSON.stringify(data));

      let msg =
        "Canvas data copied to clipboard! " + generateWarnings(dataFlags);
      showNotification(msg, dataFlags.noIssues ? 3000 : 5000);
    }
  }

  function generateHtml() {
    if (canvas) {
      const [data, dataFlags] = getCanvasData();

      let msg = "Html generation started! " + generateWarnings(dataFlags);
      showNotification(msg, dataFlags.noIssues ? 3000 : 5000);

      const canvasData: string = JSON.stringify(data);
      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: canvasData,
      })
        .then((response) => response.text())
        .then((responseText) => {
          generatedHtml.visible = true;
          generatedHtml.content = responseText;
          console.log("Response:", responseText);
          navigator.clipboard.writeText(responseText);
          showNotification("Response copied to clipboard!");
        })
        .catch((error) => {
          console.error("Error:", error);
          showNotification("Error occurred while making the request! " + error);
        });
    }
  }

  function closeGeneratedHtml() {
    generatedHtml.visible = false;
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
    <button on:click={generateHtml}>Generate HTML</button>
  </div>

  <div class="browser-window">
    <div class="tab-bar">
      <div class="tab">
        <img
          src="https://cdn.oaistatic.com/_next/static/media/favicon-32x32.630a2b99.png"
          alt="icon"
        />
        <input
          type="text"
          class="tab-input"
          placeholder="name"
          bind:value={headerData.title}
        />
      </div>
      <div class="tab">
        <img src="/github-mark-white.png" alt="icon" />
        <a class="tab-text" href="https://github.com/Julian-Mostbauer/Neo-VHE"
          >Neo-VHE</a
        >
      </div>
    </div>
    <canvas class="main-canvas" id="c"></canvas>
  </div>

  {#if generatedHtml.visible}
    <div class="notification">
      <textarea
        name="code"
        id="code"
        class="code-area"
        rows="20"
        cols="80"
        readonly>{generatedHtml.content}</textarea
      >
      <button class="close-button" on:click={closeGeneratedHtml}>X</button>
    </div>
  {/if}

  <div class="notification-area">
    {#each $notifications as { id, text, lifetime, initialLifetime }}
      <div
        class="notification"
        style="opacity: {/*int out smove*/
        Math.cos(Math.PI * (lifetime / initialLifetime - 1 / 2))};"
      >
        {text}
      </div>
    {/each}
  </div>
</main>

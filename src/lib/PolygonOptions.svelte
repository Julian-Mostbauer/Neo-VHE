<script lang="ts">
  import { shapeStore } from "./shapestore";
  import { supportedHtmlElements } from "./customTypes";

  let newPoint = { x: 0, y: 0 };
  let points: { x: number; y: number }[] = $shapeStore.points;

  function addPoint() {
    points = [...points, { ...newPoint }];
    shapeStore.update((store) => {
      store.points = points;
      return store;
    });
  }

  function removePoint(index: number) {
    points = points.filter((_, i) => i !== index);
    shapeStore.update((store) => {
      store.points = points;
      return store;
    });
  }

  $: points = $shapeStore.points;
</script>

<div id="polygonOptions" class="options">
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
    points:
    <div class="point-table-container">
      <table class="point-table">
        <thead>
          <tr>
            <th>X</th>
            <th>Y</th>
          </tr>
        </thead>
        <tbody>
          {#each points as point, index}
            <tr>
              <td>
                <input
                  type="number"
                  bind:value={points[index].x}
                  placeholder="X"
                />
              </td>
              <td>
                <input
                  type="number"
                  bind:value={points[index].y}
                  placeholder="Y"
                />
              </td>
              <td>
                <button on:click={() => removePoint(index)}> Remove </button>
              </td>
            </tr>
          {/each}
          <tr>
            <td>
              <input type="number" bind:value={newPoint.x} placeholder="X" />
            </td>
            <td>
              <input type="number" bind:value={newPoint.y} placeholder="Y" />
            </td>
            <td>
              <button on:click={addPoint}> Add </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </label>

  <label>
    HTML Element:
    <select bind:value={$shapeStore.htmlElement}>
      {#each supportedHtmlElements as htmlElement}
        <option value={htmlElement}>{htmlElement}</option>
      {/each}
    </select>
  </label>
</div>

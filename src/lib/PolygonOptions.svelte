<script lang="ts">
  import { shapeStore } from "./shapestore";
  import { supportedHtmlElements } from "./customTypes";
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
          {#each $shapeStore.points as point, index}
            <tr>
              <td>
                <input
                  type="number"
                  bind:value={$shapeStore.points[index].x}
                  placeholder="X"
                />
              </td>
              <td>
                <input
                  type="number"
                  bind:value={$shapeStore.points[index].y}
                  placeholder="Y"
                />
              </td>
            </tr>
          {/each}
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

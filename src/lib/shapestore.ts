import { writable } from "svelte/store";
import type { HtmlElement } from "./customTypes.ts";

export interface ShapeData {
  left: number;
  top: number;
  fill: string;
  width: number;
  height: number;
  angle: number;
  radius: number;
  rx: number;
  ry: number;
  points: { x: number; y: number }[];
  htmlElement: HtmlElement;
}

export const shapeStore = writable<ShapeData>({
  left: 120,
  top: 10,
  fill: "black",
  width: 150,
  height: 150,
  angle: 45,
  radius: 50,
  rx: 50,
  ry: 100,
  points: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }],
  htmlElement: "button",
});

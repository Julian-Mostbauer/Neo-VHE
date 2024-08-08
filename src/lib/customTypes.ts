export const supportedHtmlElements= [
  "button",
  "div",
  "span",
  "input",
  "select",
  "option",
  "label",
] as const;

export type HtmlElement = (typeof supportedHtmlElements)[number];

export const supportedShapes = [
  "rect",
  "circle",
  "ellipse",
  "triangle",
  "polygon",
] as const;

export type Shape = (typeof supportedShapes)[number];

export function isHtmlElement(value: string): value is HtmlElement {
  return supportedHtmlElements.includes(value as HtmlElement);
}
export function isShape(value: string): value is Shape {
  return supportedShapes.includes(value as Shape);
}

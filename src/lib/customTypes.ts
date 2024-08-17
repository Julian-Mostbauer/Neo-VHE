export const supportedHtmlElements = [
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

export type headerData = {
  title: string;
  icon: string;
};

export type canvasOutputData = {
  headerData: headerData;
  shapes: fabric.Object[];
};

export type exportDataFlags = {
  noIssues: boolean;
  nullEllement: boolean;
  emptyCanvas: boolean;
};

export function getDataFlags(shapes: fabric.Object[]): exportDataFlags {
  const nullEllement =
    shapes.some((shape) => !isHtmlElement(shape.strokeLineCap ?? " ")) ||
    shapes.some((shape) => !isShape(shape.type ?? " "));
  const emptyCanvas = shapes.length === 0;
  const noIssues = !nullEllement && !emptyCanvas;

  return {
    noIssues,
    nullEllement,
    emptyCanvas,
  };
}

export function generateWarnings(dataFlags: exportDataFlags): string {
  let msg = dataFlags.noIssues ? "Export successful." : "Export with issues.";

  if (dataFlags.nullEllement) {
    msg += " Warnging: Some objects had inproper html tags.";
  }

  if (dataFlags.emptyCanvas) {
    msg += " Warning: Canvas is empty.";
  }
  return msg;
}

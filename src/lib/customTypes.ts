export type HtmlElement =
  | "button"
  | "div"
  | "span"
  | "input"
  | "select"
  | "option"
  | "label";

export type Shape = "rect" | "circle" | "ellipse" | "triangle" | "polygon";

export function isHtmlElement(value: string): value is HtmlElement {
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
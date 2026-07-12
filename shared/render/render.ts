import { marked } from "marked";
import DOMPurify from "dompurify";

export function render(text: string): string {
  const preprocessed = text
    .replace(
      /:::slideshow\s*([\s\S]*?)\s*:::/g,
      (_, block) => {
        const images = block
          .split("\n")
          .map(s => s.trim())
          .filter(Boolean);

        return `<div class="slideshow" data-images="${images.join("|")}"></div>`;
      }
    );

  return DOMPurify.sanitize(marked.parse(preprocessed));
}
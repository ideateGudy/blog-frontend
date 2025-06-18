import DOMPurify from "dompurify";
import { useMemo, useEffect } from "react";

const SanitizedHtml = ({ content }) => {
  useEffect(() => {
    DOMPurify.addHook("afterSanitizeAttributes", (node) => {
      if (node.tagName === "A") {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
      }
    });
  }, []);

  const safeHtml = useMemo(() => {
    return content
      ? DOMPurify.sanitize(content, {
          ALLOWED_TAGS: [
            "b",
            "i",
            "em",
            "strong",
            "a",
            "p",
            "ul",
            "ol",
            "li",
            "br",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
          ],
          ALLOWED_ATTR: ["href", "target", "rel"],
        })
      : "";
  }, [content]);

  return (
    <div
      className="prose lg:prose-lg text-justify w-full"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
};

export default SanitizedHtml;

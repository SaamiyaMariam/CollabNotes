import "@tiptap/core";
import { Highlight } from "@tiptap/extension-highlight";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    highlight: {
      toggleHighlight: (attributes?: { color?: string }) => ReturnType;
      setHighlight: (attributes?: { color?: string }) => ReturnType;
      unsetHighlight: () => ReturnType;
    };
  }
}

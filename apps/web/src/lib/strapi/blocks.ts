import { asArray, asRecord, asString, unwrapMedia } from "./normalize";
import { getMediaUrl } from "./media";

export type ContentBlock =
  | {
      type: "rich-text";
      body: string;
    }
  | {
      type: "quote";
      title: string;
      body: string;
    }
  | {
      type: "media";
      image?: {
        url: string;
        alternativeText?: string;
      };
    }
  | {
      type: "slider";
      images: {
        url: string;
        alternativeText?: string;
      }[];
    };

function normalizeMedia(value: unknown) {
  const media = unwrapMedia(value);
  const url = getMediaUrl(asString(media?.url));
  if (!url) return undefined;

  return {
    url,
    alternativeText: asString(media?.alternativeText),
  };
}

export function normalizeBlocks(value: unknown): ContentBlock[] {
  const blocks = asArray(value).map((block): ContentBlock | null => {
      const record = asRecord(block);
      const component = asString(record.__component);

      if (component === "shared.rich-text") {
        const body = asString(record.body);
        return body ? ({ type: "rich-text", body } satisfies ContentBlock) : null;
      }

      if (component === "shared.quote") {
        const title = asString(record.title);
        const body = asString(record.body);
        return title || body
          ? ({ type: "quote", title, body } satisfies ContentBlock)
          : null;
      }

      if (component === "shared.media") {
        return { type: "media", image: normalizeMedia(record.file) } satisfies ContentBlock;
      }

      if (component === "shared.slider") {
        const images = asArray(record.files)
          .map((item) => normalizeMedia(item))
          .filter((image): image is { url: string; alternativeText: string } =>
            Boolean(image)
          );
        return { type: "slider", images } satisfies ContentBlock;
      }

      return null;
    });

  return blocks.filter((block): block is ContentBlock => Boolean(block));
}

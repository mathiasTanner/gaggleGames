import Image from "next/image";
import type { ContentBlock } from "@/lib/strapi/blocks";

type ContentBlocksProps = {
  blocks: ContentBlock[];
};

function RichText({ body }: { body: string }) {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4 text-base leading-8 text-muted-foreground">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="whitespace-pre-line">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default function ContentBlocks({ blocks }: ContentBlocksProps) {
  if (blocks.length === 0) return null;

  return (
    <div className="space-y-8">
      {blocks.map((block, index) => {
        if (block.type === "rich-text") {
          return <RichText key={`${block.type}-${index}`} body={block.body} />;
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={`${block.type}-${index}`}
              className="border-l-4 border-accent bg-secondary px-6 py-5 text-secondary-foreground"
            >
              {block.title ? (
                <p className="text-lg font-semibold tracking-tight">{block.title}</p>
              ) : null}
              {block.body ? (
                <p className="mt-2 text-base leading-7 text-muted-foreground">
                  {block.body}
                </p>
              ) : null}
            </blockquote>
          );
        }

        if (block.type === "media" && block.image) {
          return (
            <div
              key={`${block.type}-${index}`}
              className="relative aspect-[16/9] overflow-hidden rounded border border-border bg-secondary"
            >
              <Image
                src={block.image.url}
                alt={block.image.alternativeText ?? ""}
                fill
                sizes="(min-width: 1024px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          );
        }

        if (block.type === "slider" && block.images.length > 0) {
          return (
            <div
              key={`${block.type}-${index}`}
              className="grid gap-4 sm:grid-cols-2"
            >
              {block.images.map((image) => (
                <div
                  key={image.url}
                  className="relative aspect-[4/3] overflow-hidden rounded border border-border bg-secondary"
                >
                  <Image
                    src={image.url}
                    alt={image.alternativeText ?? ""}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

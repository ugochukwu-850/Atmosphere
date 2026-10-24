type Block =
  { type: "p" | "h"; text: string } | { type: "ul" | "ol"; items: string[] };

const BULLET = /^(?:[-*•]|(\d+)[.)])\s+(.*)$/;

/** Drop the markdown emphasis an LLM reply may carry; we render plain text. */
const plain = (line: string) =>
  line
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1");

/** Paragraphs, headings and lists from the planner's plain-text reply. */
function parse(reply: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length)
      blocks.push({ type: "p", text: paragraph.join("\n") });
    paragraph = [];
  };

  for (const raw of reply.split("\n")) {
    const line = plain(raw.trim());
    if (!line) {
      flush();
      continue;
    }
    // "# Kit" or a line that is all bold ("**Kit:**") reads as a heading.
    if (/^#{1,6}\s/.test(line) || /^\*\*[^*]+\*\*:?$/.test(raw.trim())) {
      flush();
      blocks.push({ type: "h", text: line.replace(/^#+\s*/, "") });
      continue;
    }
    const bullet = line.match(BULLET);
    if (bullet) {
      flush();
      const type = bullet[1] ? "ol" : "ul";
      const last = blocks.at(-1);
      if (last?.type === type) last.items.push(bullet[2]!);
      else blocks.push({ type, items: [bullet[2]!] });
      continue;
    }
    paragraph.push(line);
  }
  flush();
  return blocks;
}

export function PlanReply({ reply }: { reply: string }) {
  return (
    <div className="flex flex-col gap-3 text-[15px] leading-relaxed">
      {parse(reply).map((block, i) => {
        switch (block.type) {
          case "h":
            return (
              <p key={i} className="font-semibold">
                {block.text}
              </p>
            );
          case "ul":
          case "ol": {
            const List = block.type;
            return (
              <List
                key={i}
                className={
                  block.type === "ol"
                    ? "list-decimal space-y-1.5 pl-5 marker:text-primary"
                    : "list-disc space-y-1.5 pl-5 marker:text-primary"
                }
              >
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </List>
            );
          }
          default:
            return (
              <p key={i} className="whitespace-pre-line">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}

import { StyleSheet, Text, View } from "react-native";

// Renderiza Markdown simples sem dependência externa.
// Suporta: ## headings, **bold**, *italic*, - listas, 1. numeradas, linhas em branco.

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const raw = match[0];
    if (raw.startsWith("**")) {
      parts.push(
        <Text key={match.index} style={{ fontWeight: "700", color: "#fff" }}>
          {raw.slice(2, -2)}
        </Text>,
      );
    } else {
      parts.push(
        <Text key={match.index} style={{ fontStyle: "italic", color: "#ccc" }}>
          {raw.slice(1, -1)}
        </Text>,
      );
    }
    last = match.index + raw.length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts;
}

export function MarkdownText({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <View>
      {lines.map((line, i) => {
        if (/^#{1,2}\s/.test(line)) {
          const content = line.replace(/^#+\s*/, "");
          return (
            <Text key={i} style={md.heading}>
              {renderInline(content)}
            </Text>
          );
        }

        if (/^###\s/.test(line)) {
          const content = line.replace(/^###\s*/, "");
          return (
            <Text key={i} style={md.subheading}>
              {renderInline(content)}
            </Text>
          );
        }

        if (/^[-*]\s/.test(line)) {
          const content = line.replace(/^[-*]\s*/, "");
          return (
            <View key={i} style={md.listRow}>
              <Text style={md.bullet}>•</Text>
              <Text style={md.listText}>{renderInline(content)}</Text>
            </View>
          );
        }

        if (/^\d+\.\s/.test(line)) {
          const match = line.match(/^(\d+)\.\s(.*)/);
          const num = match?.[1] ?? "";
          const content = match?.[2] ?? line;
          return (
            <View key={i} style={md.listRow}>
              <Text style={md.bullet}>{num}.</Text>
              <Text style={md.listText}>{renderInline(content)}</Text>
            </View>
          );
        }

        if (line.trim() === "") {
          return <View key={i} style={{ height: 8 }} />;
        }

        return (
          <Text key={i} style={md.paragraph}>
            {renderInline(line)}
          </Text>
        );
      })}
    </View>
  );
}

const md = StyleSheet.create({
  heading: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 6,
    lineHeight: 24,
  },
  subheading: {
    color: "#ccc",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  paragraph: {
    color: "#ddd",
    fontSize: 15,
    lineHeight: 24,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
    gap: 6,
  },
  bullet: {
    color: "#4CAF50",
    fontSize: 15,
    lineHeight: 24,
    minWidth: 18,
  },
  listText: {
    color: "#ddd",
    fontSize: 15,
    lineHeight: 24,
    flex: 1,
  },
});

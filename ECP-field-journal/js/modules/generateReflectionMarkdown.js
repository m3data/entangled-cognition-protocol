/**
 * Generate Markdown with frontmatter for a reflection entry.
 * This is used for structured journaling of insights, tensions, and symbols.
 *
 * @param {Object} options - Configuration and content of the reflection.
 * @param {string} options.title - Title of the reflection.
 * @param {string} options.layout - Defaults to 'reflection'.
 * @param {string} options.author - Name or alias of the author.
 * @param {string} options.timestamp - ISO timestamp of the entry.
 * @param {string[]} options.themes - Array of high-level themes.
 * @param {string[]} options.tensions - Key tensions or questions held.
 * @param {string[]} options.symbols - Metaphors or symbols that emerged.
 * @param {string} options.body - The freeform journaled text.
 * @param {string} options.visibility - 'public', 'private', or 'both'
 * @returns {Promise<Object[]>} Promise resolving to array of save targets.
 */
export function generateReflectionMarkdown({
  title,
  layout = "reflection",
  author,
  timestamp,
  themes = [],
  tensions = [],
  symbols = [],
  body = "",
  visibility = "public"
}) {
  const frontmatter = [
    '---',
    `title: "${title}"`,
    `layout: "${layout}"`,
    `type: "reflection"`,
    `author: "${author}"`,
    `timestamp: "${timestamp}"`,
    `themes: [${themes.map(t => `"${t}"`).join(", ")}]`,
    `tensions: [${tensions.map(t => `"${t}"`).join(", ")}]`,
    `symbols: [${symbols.map(s => `"${s}"`).join(", ")}]`,
    '---'
  ].join('\n');

  const markdownContent = `${frontmatter}\n\n${body}`;

  const hashString = str =>
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(str))
      .then(buffer => Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 6));

  const fileNamePromise = hashString(author).then(hash => 
    `reflection-${timestamp.replace(/[:.]/g, "-")}-${hash}.md`
  );

  return fileNamePromise.then(fileName => {
    const paths = [];

    if (visibility === "private" || visibility === "both") {
      paths.push({ path: `entries/reflections/_private/${fileName}`, content: markdownContent });
    }

    if (visibility === "public" || visibility === "both") {
      const scrubbedContent = markdownContent.replace(`author: "${author}"`, `author: "anonymous"`);
      paths.push({ path: `entries/reflections/public/${fileName}`, content: scrubbedContent });
    }

    return paths;
  });
}

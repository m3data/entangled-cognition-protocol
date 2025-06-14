/**
 * Generate Markdown with frontmatter for a reflection entry.
 * This is used for structured journaling of insights, tensions, and symbols.
 *
 * @param {Object} options - Configuration and content of the reflection.
 * @param {string} options.title - Title of the reflection.
 * @param {string} options.author - Name or alias of the author.
 * @param {string} options.timestamp - ISO timestamp of the entry.
 * @param {string[]} options.themes - Array of high-level themes.
 * @param {string[]} options.tensions - Key tensions or questions held.
 * @param {string[]} options.symbols - Metaphors or symbols that emerged.
 * @param {string} options.body - The freeform journaled text.
 * @param {string} options.visibility - 'public', 'private', or 'both'
 * @returns {Object[]} Array of save targets with path and content.
 */
export function generateReflectionMarkdown({
  title,
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
    `author: "${author}"`,
    `timestamp: "${timestamp}"`,
    `themes: [${themes.map(t => `"${t}"`).join(", ")}]`,
    `tensions: [${tensions.map(t => `"${t}"`).join(", ")}]`,
    `symbols: [${symbols.map(s => `"${s}"`).join(", ")}]`,
    '---'
  ].join('\n');

  const markdownContent = `${frontmatter}\n\n${body}`;
  const fileName = `reflection-${timestamp}.md`;
  const paths = [];

  if (visibility === "private" || visibility === "both") {
    paths.push({ path: `entries/reflections/_private/${fileName}`, content: markdownContent });
  }

  if (visibility === "public" || visibility === "both") {
    const scrubbedContent = markdownContent.replace(`author: "${author}"`, `author: "anonymous"`);
    paths.push({ path: `entries/reflections/public/${fileName}`, content: scrubbedContent });
  }

  return paths;
}

export const MarkdownRenderer = ({ content }: { content: string }) => {
  if (!content) return null;

  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string) => {
    // Handle headings
    text = text.replace(
      /^### (.*$)/gm,
      '<h3 class="text-xl font-semibold mb-4 mt-6">$1</h3>'
    );
    text = text.replace(
      /^## (.*$)/gm,
      '<h2 class="text-2xl font-semibold mb-4 mt-8">$1</h2>'
    );
    text = text.replace(
      /^# (.*$)/gm,
      '<h1 class="text-3xl font-bold mb-6 mt-8">$1</h1>'
    );

    // Handle bold and italic
    text = text.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold">$1</strong>'
    );
    text = text.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Handle code blocks
    text = text.replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">$1</code></pre>'
    );

    // Handle inline code
    text = text.replace(
      /`(.*?)`/g,
      '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>'
    );

    // Handle links
    text = text.replace(
      /\[([^\]]+)\]\(([^\)]+)\)/g,
      '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Handle line breaks and paragraphs
    text = text.replace(/\n\n/g, '</p><p class="mb-4">');
    text = text.replace(/\n/g, "<br>");

    // Handle lists
    text = text.replace(/^\* (.*$)/gm, '<li class="mb-2">$1</li>');
    text = text.replace(/^- (.*$)/gm, '<li class="mb-2">$1</li>');
    text = text.replace(
      /(<li class="mb-2">.*<\/li>)/s,
      '<ul class="list-disc pl-6 mb-4">$1</ul>'
    );

    // Handle numbered lists
    text = text.replace(/^\d+\. (.*$)/gm, '<li class="mb-2">$1</li>');

    // Handle blockquotes
    text = text.replace(
      /^> (.*$)/gm,
      '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4">$1</blockquote>'
    );

    return text;
  };

  const processedContent = parseMarkdown(content);

  return (
    <div
      className="markdown-content prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none"
      dangerouslySetInnerHTML={{
        __html: `<p class="mb-4">${processedContent}</p>`,
      }}
    />
  );
};

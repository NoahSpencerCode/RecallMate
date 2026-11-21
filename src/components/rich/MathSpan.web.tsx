import katex from 'katex';
import 'katex/contrib/mhchem';
import { createElement } from 'react';

const cache = new Map<string, string>();

/** KaTeX HTML for a formula, cached: lists render the same cards over and over. */
function render(tex: string, display: boolean): string {
  const key = `${display ? 'D' : 'I'}:${tex}`;
  let html = cache.get(key);
  if (html === undefined) {
    // trust stays off (the default), so cards people write can't inject links or HTML.
    html = katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: 'ignore' });
    if (cache.size > 3000) cache.clear();
    cache.set(key, html);
  }
  return html;
}

/** Typeset math (textbook style) on the web. Inline math sits inside a <Text>; display math in a block. */
export function MathSpan({ tex, display = false }: { tex: string; display?: boolean }) {
  return createElement(display ? 'div' : 'span', {
    className: 'rm-math',
    dangerouslySetInnerHTML: { __html: render(tex, display) },
  });
}

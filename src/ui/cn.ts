import { extendTailwindMerge } from 'tailwind-merge';

export const cn = extendTailwindMerge({
  extend: {theme: {text: ['caption', 'label', 'code', 'body', 'title', 'heading']}},
});

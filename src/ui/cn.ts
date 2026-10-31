import { extendTailwindMerge } from 'tailwind-merge';

export const cn = extendTailwindMerge({extend: {theme: {text: ['caption', 'body', 'title']}}});

"use strict";

const path = require('path');
const { isPathRelative } = require('../helpers');

const layers = {
  'entities': 'entities',
  'features': 'features',
  'pages': 'pages',
  'widgets': 'widgets',
  'shared': 'shared',
}

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "path checker for fsd structure",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`

    // Add a schema if the rule has options
    schema: [{
      type: 'object',
      properties: {
        alias: {
          type: 'string'
        }
      }
    }],
    messages: {}, // Add messageId and message
  },

  create(context) {
    const alias = context.options[0]?.alias ?? '';
    return {
      ImportDeclaration(node) {
        // 'entites/Article' || '@/entites/Article'
        const importFrom = node.source.value;
        const noAliasImport = alias ? importFrom.replace(`${alias}/`, '') : importFrom;

        // the file where the import happens
        const toFilename = context.getFilename();

        
        if (shouldPathBeRelative(noAliasImport, toFilename)) {
          context.report({ node, message: 'Paths should be relative within the same layer.' });
        }
      }
    };
  },
};

/**
 * Helper to determine whether the path should be relative
 * @param {string} from
 * @param {string} to
 */
function shouldPathBeRelative(from, to) {
  if (isPathRelative(from)) return false;


  // 'entities/Article'
  const fromArr = from.split('/')
  const fromLayer = fromArr[0] // 'entities'
  const fromSlice = fromArr[1] // 'Article'

  if (!fromLayer || !fromSlice || !layers[fromLayer]) return false;

  // 'C:\\Users\\User\\Desktop\\eslint-plugin-front-course\\src\\entites\\Article'
  const toNormalized = path.toNamespacedPath(to); // \\?\C:\Users\User\Desktop\eslint-plugin-front-course\src\entites\Article
  const toSplitted = toNormalized.split('src')[1]; // \entites\Article
  const toArr = toSplitted.split(path.sep) // ['', 'entites', 'Article']

  const toLayer = toArr[1] // 'entites'
  const toSlice = toArr[2] // 'Article'

  if (!toLayer || !toSlice || !layers[toLayer]) return false;

  const shouldBeRelative = (fromLayer === toLayer) && (fromSlice === toSlice); 
  return shouldBeRelative;
}

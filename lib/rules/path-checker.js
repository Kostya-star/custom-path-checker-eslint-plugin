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
    fixable: 'code', // Or `code` or `whitespace`

    // Add a schema if the rule has options
    schema: [{
      type: 'object',
      properties: {
        alias: {
          type: 'string'
        }
      }
    }],
    messages: {
      relativePath: 'Paths should be relative within the same layer'
    }, // Add messageId and message
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
          context.report({ 
            node, 
            messageId: 'relativePath',
            fix: (fixer) => {
              const normPath = getNormalizedCurrentFilePath(toFilename)
                .split('/')
                .slice(0, -1)
                .join('/')

                let relativePath = path.relative(normPath, `/${noAliasImport}`)
                  .split('\\')
                  .join('/')

                  if (!relativePath.startsWith('.')) {
                    relativePath = './' + relativePath
                  }
              return fixer.replaceText(node.source, `'${relativePath}'`) 
            }
          });
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
  // const toNormalized = path.toNamespacedPath(to); // \\?\C:\Users\User\Desktop\eslint-plugin-front-course\src\entites\Article
  // const toSplitted = toNormalized.split('src')[1]; // \entites\Article

  const toSplitted = getNormalizedCurrentFilePath(to)
  const toArr = toSplitted.split('/') // ['', 'entites', 'Article']

  const toLayer = toArr[1] // 'entites'
  const toSlice = toArr[2] // 'Article'

  if (!toLayer || !toSlice || !layers[toLayer]) return false;

  const shouldBeRelative = (fromLayer === toLayer) && (fromSlice === toSlice); 
  return shouldBeRelative;
}

function getNormalizedCurrentFilePath(currentPath) {
  const toNormalized = path.toNamespacedPath(currentPath); // \\?\C:\Users\User\Desktop\eslint-plugin-front-course\src\entites\Article
  const toSplitted = toNormalized.split('src')[1]; // \entites\Article
  return toSplitted.split('\\').join('/')
}
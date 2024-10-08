"use strict";

const path = require("path");
const { isPathRelative } = require('../helpers');
const micromatch = require('micromatch');

const layers = {
  'entities': 'entities',
  'features': 'features',
  'pages': 'pages',
  'widgets': 'widgets',
}

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "the plugin that controls that everything is imported from 'index' files(public api) in fsd structure",
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
      },
      testFilesPatterns: {
        type: 'array'
      }
    }
  }],
  // messageId and message
    messages: {
      publicApi: "Should be exported from public API (index.ts) only",
      testingApi: "Testing data should be used only in tests files",
    },
  },

  create(context) {
    const { alias = '', testFilesPatterns = [] } = context.options[0] ?? {};
    return {
      ImportDeclaration(node) {
        // 'entites/Article' || 'entites/Article/testing' || 'redux/toolkit'....
        const importFrom = node.source.value;
        const noAliasImport = alias ? importFrom.replace(`${alias}/`, '') : importFrom;

        const importFromIsRelative = isPathRelative(noAliasImport);

        if (importFromIsRelative) return;

        // ['entites', 'Article'] || ['entites', 'Article', 'testing'] || ['redux', 'toolkit']....
        const importParts = noAliasImport.split('/')
        const layer = importParts[0];
        const slice = importParts[1];

        const isImportedNotFromPublicApi = importParts.length > 2;
        // ['entites', 'Article', 'testing']
        const isImportFromTestingPublicApi = importParts[2] === 'testing' && importParts.length < 4; 

        const isFsdLayer = layers[importParts[0]];

        if (isFsdLayer && isImportedNotFromPublicApi && !isImportFromTestingPublicApi) {
          context.report({ 
            node, 
            messageId: 'publicApi', 
            fix: (fixer) => fixer.replaceText(node.source, `'${alias}/${layer}/${slice}'`)
          });
        }
        
        if (isImportFromTestingPublicApi) {
          // the file where the import happens
          const currentFilePath = context.getFilename();
          const normalizedPath = path.toNamespacedPath(currentFilePath);

          
          const isFileForTesting = testFilesPatterns.some(pattern => {
            return micromatch.isMatch(normalizedPath, pattern);
          })
          
          if (!isFileForTesting) {
            context.report({ node, messageId: 'testingApi' });
          }
        }
      }
    };
  },
};



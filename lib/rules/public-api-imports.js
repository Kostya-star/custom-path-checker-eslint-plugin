"use strict";

const { isPathRelative } = require('../helpers');

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
    messages: {
      publicApi: "Should be exported from public API (index.ts) only",
    }, // Add messageId and message
  },

  create(context) {
    const alias = context.options[0]?.alias ?? '';
    return {
      ImportDeclaration(node) {
        // 'entites/Article' || '@/entites/Article' || 'redux/toolkit'....
        const importFrom = node.source.value;
        const noAliasImport = alias ? importFrom.replace(`${alias}/`, '') : importFrom;

        // the file where the import happens
        // const toFilename = context.getFilename();

        const importFromIsRelative = isPathRelative(noAliasImport);

        if (importFromIsRelative) return;

        const importParts = noAliasImport.split('/')

        const isImportedNotFromPublicApi = importParts.length > 2;

        const isFsdLayer = layers[importParts[0]];

        if (isFsdLayer && isImportedNotFromPublicApi) {
          context.report({ node, messageId: 'publicApi' });
        }
      }
    };
  },
};

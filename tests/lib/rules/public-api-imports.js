/**
 * @fileoverview the plugin that controls that everything is imported from &#39;index&#39; files(public api) in fsd structure
 * @author Constantin
 */
"use strict";

const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester();
ruleTester.run("public-api-imports", rule, {
  valid: [
    {
      name: 'VALID: imported from public API with absolute path',
      code: "import { something } from '@/entities/Article'",
      options: [
        {
          alias: '@'
        }
      ],
      errors: [],
    },
    {
      name: 'VALID: relative paths within a module',
      code: "import { something } from '../../smth/smth'",
      errors: [],
    },
    {
      name: 'VALID: import from some library',
      code: "import { useSelector } from 'react-redux'",
      errors: [],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\file.test.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
      }],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
      }],
    }
  ],

  invalid: [
    {
      name: 'INVALID: imported with ABSOLUTE path NOT from public api',
      // the file name the import happens to
      code: "import { something } from '@/entities/Article/something/andSomethingElse'",
      errors: [{ messageId: 'publicApi' }],
      options: [{ alias: '@' }],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing/file.tsx'",
      errors: [{messageId: 'publicApi'}],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
      }],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\forbidden.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [{messageId: 'testingApi'}],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
      }],
    }
  ],
});


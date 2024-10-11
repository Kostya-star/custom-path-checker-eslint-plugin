/**
 * @fileoverview path checker for fsd structure
 * @author Constantin
 */
"use strict";

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester();
ruleTester.run("path-checker", rule, {
  valid: [
    {
      name: 'VALID: with RELATIVE path within the module',
      // the file name the import happens from
      filename: 'C:\\Users\\User\\Desktop\\project_name\\src\\entities\\Article',
      // the file name the import happens to
      code: "import { something } from '../../something/andSomethingElse'",
      errors: [],
    },
    {
      name: 'VALID: with ABSOLUTE path across different layers',
      filename: 'C:\\Users\\User\\Desktop\\project_name\\src\\features\\UserFeature\\index.js',
      code: "import { Article } from 'entities/Article'",
      errors: [],
    },
    {
      name: 'VALID: cross-layer import with alias',
      filename: 'C:\\Users\\User\\Desktop\\project_name\\src\\features\\UserFeature\\index.js',
      code: "import { Article } from '@/entities/Article'",
      errors: [],
      options: [
        {
          alias: '@'
        }
      ]
    }
  ],

  invalid: [
    // {
    //   name: 'INVALID: with ABSOLUTE path within the module. withOUT alias',
    //   // the file name the import happens from
    //   filename: 'C:\\Users\\User\\Desktop\\project_name\\src\\entities\\Article',
    //   // the file name the import happens to
    //   code: "import { something } from 'entities/Article/something/andSomethingElse'",
    //   errors: [{ messageId: 'relativePath' }],
    // },
    // {
    //   name: 'INVALID: with ABSOLUTE path within the module. with alias',
    //   filename: 'C:\\Users\\User\\Desktop\\project_name\\src\\entities\\Article',
    //   code: "import { something } from '@/entities/Article/something/andSomethingElse'",
    //   errors: [{ messageId: 'relativePath' }],
    //   options: [
    //     {
    //       alias: '@'
    //     }
    //   ],
    // }

    // {
    //   name: 'TEST',
    //   filename: 'C:\\Users\\User\\Desktop\\project_name\\src\\entities\\Article\\ArticlesListItem\\ArticlesListItem',
    //   code: "import { ArticlesListItem } from '@/entities/Article/ArticlesListItem/ArticlesListItem'",
    //   errors: [{ messageId: 'relativePath' }],
    //   output: "import { ArticlesListItem } from '../ArticlesListItem/ArticlesListItem'",
    //   options: [
    //     {
    //       alias: '@'
    //     }
    //   ],
    // }
    {
      name: 'INVALID: with ABSOLUTE path within the module without alias',
      filename: 'C:\\Users\\User\\Desktop\\project_name\\src\\entities\\Article\\index.js',
      code: "import { something } from 'entities/Article/something/andSomethingElse'",
      errors: [{ messageId: 'relativePath' }],
      output: "import { something } from './something/andSomethingElse'",
    },
    {
      name: 'INVALID: with ABSOLUTE path within the module with alias',
      filename: 'C:\\Users\\User\\Desktop\\project_name\\src\\entities\\Article\\index.js',
      code: "import { something } from '@/entities/Article/something/andSomethingElse'",
      errors: [{ messageId: 'relativePath' }],
      output: "import { something } from './something/andSomethingElse'",
      options: [
        {
          alias: '@'
        }
      ]
    }
  ],
});

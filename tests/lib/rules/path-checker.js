/**
 * @fileoverview path checker for fsd structure
 * @author Constantin
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

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
  ],

  invalid: [
    {
      name: 'INVALID: with ABSOLUTE path within the module. withOUT alias',
      // the file name the import happens from
      filename: 'C:\\Users\\User\\Desktop\\project_name\\src\\entities\\Article',
      // the file name the import happens to
      code: "import { something } from 'entities/Article/something/andSomethingElse'",
      errors: [{ message: "Paths should be relative within the same layer." }],
    },
    {
      name: 'INVALID: with ABSOLUTE path within the module. with alias',
      filename: 'C:\\Users\\User\\Desktop\\project_name\\src\\entities\\Article',
      code: "import { something } from '@/entities/Article/something/andSomethingElse'",
      errors: [{ message: "Paths should be relative within the same layer." }],
      options: [
        {
          alias: '@'
        }
      ],
    }
  ],
});

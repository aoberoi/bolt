//
// SlackAPI JavaScript and TypeScript style
// ---
// This style helps maintainers enforce safe and consistent programming practices in this project. It is not meant to be
// comprehensive on its own or vastly different from existing styles. The goal is to inherit and aggregate as many of
// the communities' recommended styles for the technologies used as we can. When, and only when, we have a stated need
// to differentiate, we add more rules (or modify options). Therefore, the fewer rules directly defined in this file,
// the better.
//

module.exports = {
  // This is a root of the project, ESLint should not look through parent directories to find more config
  root: true,

  ignorePatterns: [
    // Ignore all build outputs and artifacts (node_modules, dotfiles, and dot directories are implicitly ignored)
    '/dist',
    '/coverage',
  ],

  // These environments contain lists of global variables which are allowed to be accessed
  env: {
    // According to https://node.green, the target node version (v10) supports all important ES2018 features. But es2018
    // is not an option since it presumably doesn't introduce any new globals over ES2017.
    es2017: true,
    node: true,
  },

  extends: [
    // ESLint's recommended built-in rules: https://eslint.org/docs/rules/
    'eslint:recommended',

    // Node plugin's recommended rules: https://github.com/mysticatea/eslint-plugin-node
    'plugin:node/recommended',

    // AirBnB style guide (without React) rules: https://github.com/airbnb/javascript.
    'airbnb-base',

    // JSDoc plugin's recommended rules
    'plugin:jsdoc/recommended',
  ],

  rules: {
    // JavaScript rules
    // ---
    // The top level of this configuration contains rules which apply to JavaScript (and will also be inherited for
    // TypeScript). This section does not contain rules meant to override options or disable rules in the base
    // configurations (ESLint, Node, AirBnb). Those rules are added in the final override.

    // Eliminate tabs to standardize on spaces for indentation. If you want to use tabs for something other than
    // indentation, you may need to turn this rule off using an inline config comments.
    'no-tabs': 'error',

    // Bans use of comma as an operator because it can obscure side effects and is often an accident.
    'no-sequences': 'error',
  },

  overrides: [
    {
      files: ['**/*.ts'],
      // Allow ESLint to understand TypeScript syntax
      parser: '@typescript-eslint/parser',
      parserOptions: {
        // The following option makes it possible to use rules that require type information
        project: './tsconfig.eslint.json',
      },
      // Allow ESLint to load rules from the TypeScript plugin
      plugins: ['@typescript-eslint'],
      extends: [
        // TypeScript plugin's recommended rules
        'plugin:@typescript-eslint/recommended',

        // AirBnB style guide (without React), modified for TypeScript rules: https://github.com/iamturns/eslint-config-airbnb-typescript.
        'airbnb-typescript/base',
      ],

      rules: {
        // TypeScript rules
        // ---
        // This level of this configuration contains rules which apply only to TypeScript. It also contains rules that
        // are meant to override options or disable rules in the base configurations (there are no more base
        // configurations in the subsequent overrides).

        // Disallow invocations of require(). This will help make imports more consistent and ensures a smoother
        // transition to the best future syntax. And since this rule affects TypeScript, which is compiled, there's
        // no reason we cannot adopt this syntax now.
        // NOTE: The `@typescript-eslint/no-require-imports` rule can also achieve the same effect, but it is less
        // configurable and only built to provide a migration path from TSLint.
        'import/no-common-js': ['error', {
          allowConditionalRequire: false,
        }],

        // Don't verify that all named imports are part of the set of named exports for the referenced module. The
        // TypeScript compiler will already perform this check, so it is redundant.
        // NOTE: Consider contributing this to the `airbnb-typescript` config.
        'import/named': 'off',

        // Prevent using non-boolean types as conditions. This ensures we're not relying on implicit type coercions in
        // conditionals, which can lead to unintended behavior.
        // NOTE: Consider contributing this to the `airbnb-typescript` config. https://github.com/airbnb/javascript#comparison--shortcuts
        '@typescript-eslint/strict-boolean-expressions': ['error', {
          allowString: false,
          allowNumber: false,
          allowNullableObject: false,
        }],

        // Prefer an interface declaration over a type alias because interfaces can be extended, implemented, and merged
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

        // Require class properties and methods to explicitly use accessibility modifiers (public, private, protected)
        '@typescript-eslint/explicit-member-accessibility': 'error',

        // Forbids an object literal to appear in a type assertion expression unless its used as a parameter. This
        // allows the typechecker to perform validation on the value as an assignment, instead of allowing the type
        // assertion to always win.
        // Requires use of `as Type` instead of `<Type>` for type assertion. Consistency.
        '@typescript-eslint/consistent-type-assertions': ['error', {
          assertionStyle: 'as',
          objectLiteralTypeAssertions: 'allow-as-parameter',
        }],

        // Ensure that the values returned from a module are of the expected type
        '@typescript-eslint/explicit-module-boundary-types': ['error', {
          allowArgumentsExplicitlyTypedAsAny: true,
        }],

        // No types in JSDoc for @param or @returns. TypeScript will provide this type information, so it would be
        // redundant, and possibly conflicting.
        'jsdoc/no-types': 'error',
      },
    },
    {
      files: ['**/*.js', '**/*.ts'],
      rules: {
        // Override rules
        // ---
        // This level of this configuration contains rules which override options or disable rules in the base
        // configurations in both JavaScript and TypeScript.

        // Increase the max line length to 120. The rest of this setting is copied from the AirBnB config.
        'max-len': ['error', 120, 2, {
          ignoreUrls: true,
          ignoreComments: false,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        }],

        // Restrict the use of backticks to declare a normal string. Template literals should only be used when the
        // template string contains placeholders. The rest of this setting is copied from the AirBnb config.
        quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],

        // TODO: not sure if this will work because of plugin loading on .js files
        // Allow leading underscores for parameter names, which is used to acknowledge unused variables in TypeScript.
        // Also, enforce camelCase naming for variables. Ideally, the leading underscore could be restricted to only
        // unused parameter names, but this rule isn't capable of knowing when a variable is unused. The camelcase and
        // no-underscore-dangle rules are replaced with the naming-convention rule because this single rule can serve
        // both purposes, and it works fine on non-TypeScript code.
        camelcase: 'off',
        'no-underscore-dangle': 'off',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'default',
            format: ['camelCase'],
          },
          {
            selector: 'variable',
            // PascalCase for variables is added to allow exporting a singleton, function library, or bare object as in
            // section 23.8 of the AirBnB style guide
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          },
          {
            selector: 'parameter',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
        ],

        // Allow cyclical imports. Turning this rule on is mainly a way to manage the performance concern for linting
        // time. Our projects are not large enough to warrant this. Overrides AirBnB styles.
        'import/no-cycle': 'off',

        // Prevent importing submodules of other modules. Using the internal structure of a module exposes
        // implementation details that can potentially change in breaking ways. Overrides AirBnB styles.
        'import/no-internal-modules': ['error', {
          // If necessary, use this option to set a list of allowable globs in this project.
          allow: [],
        }],
      },
    },
  ],
};

// Test files globs
// '**/*.spec.ts',
// 'src/test-helpers.ts'

/* Below are some of the  new 'airbnb-typescript' rules that the project currently does not follow.
       They've been disabled here since they raise errors in a few files. The best course
       of action is likely to adopt these rules and make the quick (and mostly automated) fixes
       needed in the repo to conform to these. ESLint and the airbnb-typescript config is more strict
       than the original TSLint configuration that this project had. */
// 'import/first': ['off'],
// 'import/prefer-default-export': ['off'],
// 'max-classes-per-file': ['off', 1],
// 'import/no-cycle': ['off'],
// '@typescript-eslint/no-use-before-define': 'off',
// 'no-nested-ternary': 'off',
// 'consistent-return': 'off',
// 'import/order': ['off'],
// 'import/newline-after-import': ['off'],
// 'import/no-useless-path-segments': ['off'],
// '@typescript-eslint/lines-between-class-members': 'off',
// 'no-restricted-globals': 'off',
// 'no-lonely-if': 'off',
// 'no-undef-init': 'off',
// 'no-multi-assign': 'off',
// 'prefer-object-spread': 'off',
// 'no-restricted-syntax': 'off',
// 'prefer-destructuring': 'off',

/* Some currently-enabled additional rules. Uncomment to disable. The project currently conforms to them
     so there it's best to just keep these commented or delete them entirely */
// '@typescript-eslint/ban-types': 'off',
// '@typescript-eslint/no-empty-interface': 'off',
// '@typescript-eslint/no-unsafe-assign': 'off',
// '@typescript-eslint/no-explicit-any': 'off',
// '@typescript-eslint/no-unsafe-member-access': 'off',
// '@typescript-eslint/no-unsafe-return': 'off',
// '@typescript-eslint/no-unnecessary-type-assertion': 'off',
// '@typescript-eslint/no-non-null-assertion': 'off',
// '@typescript-eslint/no-unsafe-assignment': 'off',
// '@typescript-eslint/no-unsafe-call': 'off',
// '@typescript-eslint/restrict-template-expressions': 'off',
// '@typescript-eslint/unbound-method': 'off',
// '@typescript-eslint/explicit-module-boundary-types': 'off',
// '@typescript-eslint/require-await': 'off',

// Rules that were enforced by TSLint, do have an equivalent, but are neither important in the recommended styles nor
// important to our maintainers
// ---
// bans usage of the delete operator with computed key expressions
// equivalent: '@typescript-eslint/no-dynamic-delete': 'error',
// "no-dynamic-delete": true,

// Rules that were enforced by TSLint and do not currently have an equivalent rule in ESLint:
// ---
// adds statements, members, and elements to the base config
// "align": [true, "parameters", "arguments", "statements", "members", "elements"],
//
// adds number of spaces so auto-fixing will work
// NOTE: while an equivalent rule does exist, the author has advised against using it, and advocates for the
// use of Prettier instead
// "indent": [true, "spaces", 2],
//
// adds check-module, check-type, check-rest-spread, check-typecast, check-type-operator
// NOTE: it's not clear whether check-type is covered by the @typescript-eslint/type-annotation-spacing rule or not
// "whitespace": [true,
//   "check-type",
//   "check-module",
//   "check-rest-spread",
//   "check-typecast",
//   "check-type-operator"
// ],

import resolve from 'rollup-plugin-node-resolve';

export default [
  {
    input: './release/index.js',
    output: {
      file: './release/bundles/cookies.umd.js',
      format: 'umd',
      sourcemap: false,
      name: '@bittlerr/universal-cookies',
      globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        'rxjs/Observable': 'Rx'
      },
    },
    plugins: [
      resolve(),
    ],
  },
]

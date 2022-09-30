import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import ts from 'rollup-plugin-typescript2';
import { eslint } from 'rollup-plugin-eslint';
import packageJSON from './package.json';
import { terser } from 'rollup-plugin-terser';

const getPath = (_path) => path.resolve(__dirname, _path);

const isDev = process.env.ROLLUP_WATCH || false;

const extensions = ['.js', '.ts', '.tsx'];

// ts
const tsPlugin = ts({
  tsconfig: getPath('./tsconfig.json'),
  extensions,
});

// eslint
const esPlugin = eslint({
  throwOnError: true,
  include: ['src/**/*.ts'],
  exclude: ['node_modules/**', 'lib/**', 'dist/**'],
});

// 基础配置
const commonConf = {
  input: getPath('./src/index.ts'),
  plugins: [
    resolve({ browser: true }, extensions),
    commonjs({
      namedExports: {
        'web3-mq': [ 'Client' ]
      }
    }),
    esPlugin,
    tsPlugin,
    !isDev && terser(),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'],
      exclude: '**/node_modules/**',
    }),
  ]
};

// 需要导出的模块类型
const outputMap = [
  {
    file: packageJSON.main,
    format: 'umd',
    globals: {
      axios: 'axios',
      '@noble/ed25519': 'ed',
      '@protobuf-ts/plugin': 'pb',
      'js-sha3': 'js-sha3',
    },
  },
  // {
  //   file: packageJSON.module,
  //   format: 'es',
  //   globals: {
  //     axios: 'Axios',
  //     mqtt: 'mqtt',
  //   },
  // },
];

const buildConf = (options) => Object.assign({}, commonConf, options);

export default outputMap.map((output) =>
  buildConf({ output: { name: packageJSON.name, ...output } }),
);

/**
 * ═══════════════════════════════════════════════════════════════
 * Optimized Craco Configuration
 * ═══════════════════════════════════════════════════════════════
 *
 * Optimized webpack configuration for production builds
 * - Code splitting
 * - Tree shaking
 * - Compression
 * - Bundle analysis
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Production optimizations
      if (env === 'production') {
        // Optimization settings
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              // React core
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
                name: 'react',
                priority: 30,
                enforce: true
              },
              // UI libraries
              ui: {
                test: /[\\/]node_modules[\\/](@radix-ui|framer-motion|lucide-react)[\\/]/,
                name: 'ui',
                priority: 20
              },
              // Utilities
              utils: {
                test: /[\\/]node_modules[\\/](axios|date-fns|clsx|tailwind-merge)[\\/]/,
                name: 'utils',
                priority: 15
              },
              // Vendor
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor',
                priority: 10
              },
              // Common chunks
              common: {
                minChunks: 2,
                priority: 5,
                reuseExistingChunk: true
              }
            }
          },
          runtimeChunk: {
            name: 'runtime'
          },
          minimize: true,
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                parse: {
                  ecma: 8
                },
                compress: {
                  ecma: 5,
                  warnings: false,
                  comparisons: false,
                  inline: 2,
                  drop_console: true,
                  drop_debugger: true,
                  pure_funcs: ['console.log', 'console.info']
                },
                mangle: {
                  safari10: true
                },
                output: {
                  ecma: 5,
                  comments: false,
                  ascii_only: true
                }
              }
            }),
            new CssMinimizerPlugin({
              minimizerOptions: {
                preset: [
                  'default',
                  {
                    discardComments: { removeAll: true }
                  }
                ]
              }
            })
          ]
        };

        // Performance hints
        webpackConfig.performance = {
          hints: 'warning',
          maxEntrypointSize: 512000,
          maxAssetSize: 512000
        };

        // Compression plugin
        webpackConfig.plugins.push(
          new CompressionPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 8192,
            minRatio: 0.8
          })
        );

        // Bundle analyzer (only when ANALYZE env is set)
        if (process.env.ANALYZE === 'true') {
          webpackConfig.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              openAnalyzer: true,
              reportFilename: 'bundle-report.html'
            })
          );
        }
      }

      // Development configuration
      if (env === 'development') {
        webpackConfig.devtool = 'eval-source-map';
      }

      // Resolve optimizations
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        extensions: ['.js', '.jsx', '.json'],
        alias: {
          ...webpackConfig.resolve.alias,
          '@': paths.appSrc
        }
      };

      // Module rules optimizations
      webpackConfig.module.rules.push({
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false
          }
        }
      });

      return webpackConfig;
    }
  },

  // Jest configuration
  jest: {
    configure: {
      coverageThreshold: {
        global: {
          statements: 70,
          branches: 70,
          functions: 70,
          lines: 70
        }
      }
    }
  },

  // Dev server configuration
  devServer: (devServerConfig, { env, paths }) => {
    // Enable gzip compression
    devServerConfig.compress = true;

    // Hot module replacement
    devServerConfig.hot = true;

    // Port configuration
    devServerConfig.port = 3000;

    return devServerConfig;
  }
};

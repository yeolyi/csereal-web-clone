import {
  layout,
  prefix,
  type RouteConfig,
  route,
} from '@react-router/dev/routes';

export default [
  ...prefix('/:locale?', [
    layout('routes/[locale]/layout.tsx', [
      route('/', 'routes/[locale]/index.tsx'),
      ...prefix('/about', [
        route('/overview', 'routes/[locale]/about/overview.tsx'),
      ]),
    ]),
  ]),
] satisfies RouteConfig;

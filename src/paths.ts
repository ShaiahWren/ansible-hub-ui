import { t } from '@lingui/macro';
import { Constants } from 'src/constants';
import { ParamHelper } from 'src/utilities';

export function formatPath(
  path: Paths,
  data = {},
  params?: Record<string, string | boolean>,
) {
  // insights router has basename="/" or "/beta/", with hub under a nested "ansible/automation-hub" route - our urls are relative to that
  let url =
    DEPLOYMENT_MODE === Constants.INSIGHTS_DEPLOYMENT_MODE
      ? UI_BASE_PATH.replace('/beta/', '/').replace(/\/$/, '')
      : '';
  url += (path as string) + '/';

  for (const k of Object.keys(data)) {
    url = url.replace(':' + k, encodeURIComponent(data[k]));
  }

  if (params) {
    const path = `${url}?${ParamHelper.getQueryString(params)}`;
    return path;
  } else {
    return url;
  }
}

// handle long/short EE routes:
// (path, container: 'namespaced/name') -> (pathWithNamespace, { namespace: 'namespaced', container: 'name' })
// (path, container: 'simple') -> (path, { container: 'simple' })
// see also withContainerParamFix
export function formatEEPath(path, data, params?) {
  const pathsWithNamespace = {
    [Paths.executionEnvironmentDetail]:
      Paths.executionEnvironmentDetailWithNamespace,
    [Paths.executionEnvironmentDetailActivities]:
      Paths.executionEnvironmentDetailActivitiesWithNamespace,
    [Paths.executionEnvironmentDetailImages]:
      Paths.executionEnvironmentDetailImagesWithNamespace,
    [Paths.executionEnvironmentDetailOwners]:
      Paths.executionEnvironmentDetailOwnersWithNamespace,
    [Paths.executionEnvironmentManifest]:
      Paths.executionEnvironmentManifestWithNamespace,
  };

  if (data.container?.includes('/')) {
    const [namespace, container] = data.container.split('/');
    const pathWithNamespace = pathsWithNamespace[path];
    return formatPath(
      pathWithNamespace,
      { ...data, namespace, container },
      params,
    );
  }

  return formatPath(path, data, params);
}

export enum Paths {
  executionEnvironmentDetail = '/containers/:container',
  executionEnvironmentDetailWithNamespace = '/containers/:namespace/:container',
  executionEnvironmentDetailActivities = '/containers/:container/_content/activity',
  executionEnvironmentDetailActivitiesWithNamespace = '/containers/:namespace/:container/_content/activity',
  executionEnvironmentDetailImages = '/containers/:container/_content/images',
  executionEnvironmentDetailImagesWithNamespace = '/containers/:namespace/:container/_content/images',
  executionEnvironmentDetailOwners = '/containers/:container/_content/owners',
  executionEnvironmentDetailOwnersWithNamespace = '/containers/:namespace/:container/_content/owners',
  executionEnvironmentManifest = '/containers/:container/_content/images/:digest',
  executionEnvironmentManifestWithNamespace = '/containers/:namespace/:container/_content/images/:digest',
  executionEnvironments = '/containers',
  executionEnvironmentsRegistries = '/registries',
  roleEdit = '/role/:role',
  roleList = '/roles',
  createRole = '/roles/create',
  groupList = '/group-list',
  groupDetail = '/group/:group',
  taskDetail = '/task/:task',
  myCollections = '/my-namespaces/:namespace',
  myNamespaces = '/my-namespaces',
  editNamespace = '/my-namespaces/edit/:namespace',
  myImports = '/my-imports',
  login = '/login',
  logout = '/logout',
  search = '/',
  legacyRole = '/legacy/roles/:username/:name',
  legacyRoles = '/legacy/roles/',
  legacyNamespace = '/legacy/namespaces/:namespaceid',
  legacyNamespaces = '/legacy/namespaces/',
  searchByRepo = '/repo/:repo',
  myCollectionsByRepo = '/repo/:repo/my-namespaces/:namespace',
  collectionByRepo = '/repo/:repo/:namespace/:collection',
  collectionDocsPage = '/:namespace/:collection/docs/:page',
  collectionDocsIndex = '/:namespace/:collection/docs',
  collectionContentDocs = '/:namespace/:collection/content/:type/:name',
  collectionContentList = '/:namespace/:collection/content',
  collectionImportLog = '/:namespace/:collection/import-log',
  collectionDocsPageByRepo = '/repo/:repo/:namespace/:collection/docs/:page',
  collectionDocsIndexByRepo = '/repo/:repo/:namespace/:collection/docs',
  collectionContentDocsByRepo = '/repo/:repo/:namespace/:collection/content/:type/:name',
  collectionContentListByRepo = '/repo/:repo/:namespace/:collection/content',
  collectionImportLogByRepo = '/repo/:repo/:namespace/:collection/import-log',
  collectionDependenciesByRepo = '/repo/:repo/:namespace/:collection/dependencies',
  namespaceByRepo = '/repo/:repo/:namespace',
  collection = '/:namespace/:collection',
  namespace = '/:namespace',
  partners = '/partners',
  namespaces = '/namespaces',
  notFound = '/not-found',
  token = '/token',
  approvalDashboard = '/approval-dashboard',
  userList = '/users',
  createUser = '/users/create',
  editUser = '/users/:userID/edit',
  userDetail = '/users/:userID',
  userProfileSettings = '/settings/user-profile',
  repositories = '/repositories',
  taskList = '/tasks',
  signatureKeys = '/signature-keys',
}

export const namespaceBreadcrumb = {
  name: {
    namespaces: t`Namespaces`,
    partners: t`Partners`,
  }[NAMESPACE_TERM],
  url: formatPath(Paths[NAMESPACE_TERM]),
};

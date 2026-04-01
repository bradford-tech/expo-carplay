import { type ConfigPlugin, withInfoPlist } from 'expo/config-plugins';

export const withCarPlayInfoPlist: ConfigPlugin = config => {
  return withInfoPlist(config, config => {
    const sceneManifest: any =
      config.modResults.UIApplicationSceneManifest ?? {};

    const sceneConfigs: any = sceneManifest.UISceneConfigurations ?? {};

    // Add CarPlay scene configuration
    sceneConfigs.CPTemplateApplicationSceneSessionRoleApplication = [
      {
        UISceneClassName: 'CPTemplateApplicationScene',
        UISceneConfigurationName: 'CarPlay',
        UISceneDelegateClassName: 'ExpoCarPlay.CarPlaySceneDelegate',
      },
    ];

    sceneManifest.UISceneConfigurations = sceneConfigs;
    sceneManifest.UIApplicationSupportsMultipleScenes = true;
    config.modResults.UIApplicationSceneManifest = sceneManifest;

    return config;
  });
};

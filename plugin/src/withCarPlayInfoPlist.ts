import {
  type ConfigPlugin,
  withDangerousMod,
  withInfoPlist,
  withXcodeProject,
} from 'expo/config-plugins';
import fs from 'fs';
import path from 'path';

/**
 * CarPlay requires UIApplicationSceneManifest in Info.plist, which forces iOS
 * to adopt scene lifecycle for the entire app. Expo's AppDelegate creates its
 * window in didFinishLaunchingWithOptions using UIWindow(frame:), which isn't
 * associated with a scene — so the phone screen goes black.
 *
 * We fix this by:
 * 1. Declaring both a phone scene and CarPlay scene in Info.plist
 * 2. Writing a PhoneSceneDelegate.swift that takes AppDelegate's existing
 *    window and assigns it to the window scene
 * 3. Adding the file to the Xcode project so it gets compiled
 */
export const withCarPlayInfoPlist: ConfigPlugin = config => {
  config = withSceneManifest(config);
  config = withPhoneSceneDelegateFile(config);
  config = withPhoneSceneDelegateXcodeRef(config);
  return config;
};

/**
 * Apply the scene manifest to an Info.plist object. Pure, so it can be tested
 * without running prebuild.
 *
 * The phone-scene role REPLACES whatever the template declared (SDK 58 ships
 * `$(PRODUCT_MODULE_NAME).SceneDelegate` under the same configuration name),
 * so plugin order does not matter. `UIApplicationSupportsMultipleScenes` is
 * left exactly as found: the template sets `false`, and CarPlay's template
 * scene is a separate role that does not need it.
 */
export function applySceneManifest(
  infoPlist: Record<string, any>
): Record<string, any> {
  const manifest: any = infoPlist.UIApplicationSceneManifest ?? {};
  const configs: any = manifest.UISceneConfigurations ?? {};

  configs.UIWindowSceneSessionRoleApplication = [
    {
      UISceneClassName: 'UIWindowScene',
      UISceneConfigurationName: 'Default Configuration',
      UISceneDelegateClassName: 'PhoneSceneDelegate',
    },
  ];
  configs.CPTemplateApplicationSceneSessionRoleApplication = [
    {
      UISceneClassName: 'CPTemplateApplicationScene',
      UISceneConfigurationName: 'CarPlay',
      UISceneDelegateClassName: 'ExpoCarPlay.CarPlaySceneDelegate',
    },
  ];

  manifest.UISceneConfigurations = configs;
  infoPlist.UIApplicationSceneManifest = manifest;
  return infoPlist;
}

const MIN_EXPO_MAJOR = 58;

/**
 * Fail prebuild early, with a clear message, when the project cannot host the
 * generated PhoneSceneDelegate: it subclasses Expo's `ExpoAppSceneDelegate`
 * (SDK 58+) and relies on the AppDelegate exposing the React Native factory
 * through `ExpoReactNativeFactoryProvider`. Without either, the phone window is
 * never created and the app launches to a black screen — a runtime failure
 * that compiles fine.
 */
export function assertSceneLifecycleSupport(
  expoVersion: string,
  appDelegateSource: string
): void {
  const major = parseInt(expoVersion.split('.')[0] ?? '', 10);
  if (Number.isNaN(major) || major < MIN_EXPO_MAJOR) {
    throw new Error(
      `expo-carplay: requires Expo SDK ${MIN_EXPO_MAJOR} or newer (found expo ${expoVersion}). ` +
        'Use @bradford-tech/expo-carplay 0.4.x for earlier SDKs.'
    );
  }
  if (!appDelegateSource.includes('ExpoReactNativeFactoryProvider')) {
    throw new Error(
      'expo-carplay: AppDelegate.swift does not adopt ExpoReactNativeFactoryProvider. ' +
        'The generated PhoneSceneDelegate needs it to start or adopt the React Native window; ' +
        'regenerate the iOS project with `npx expo prebuild --clean` on Expo SDK 58.'
    );
  }
}

// 1. Add both phone and CarPlay scenes to Info.plist
const withSceneManifest: ConfigPlugin = config => {
  return withInfoPlist(config, config => {
    config.modResults = applySceneManifest(
      config.modResults
    ) as typeof config.modResults;
    return config;
  });
};

// 2. Write PhoneSceneDelegate.swift into the app's ios source directory
const withPhoneSceneDelegateFile: ConfigPlugin = config => {
  return withDangerousMod(config, [
    'ios',
    config => {
      const appDir = findAppSourceDir(config.modRequest.platformProjectRoot);
      if (!appDir) {
        throw new Error(
          'expo-carplay: Could not find app source directory in ios/'
        );
      }

      const expoPackageJsonPath = require.resolve('expo/package.json', {
        paths: [config.modRequest.projectRoot],
      });
      const expoPackageJson = JSON.parse(
        fs.readFileSync(expoPackageJsonPath, 'utf8')
      ) as { version: string };
      assertSceneLifecycleSupport(
        expoPackageJson.version,
        fs.readFileSync(path.join(appDir, 'AppDelegate.swift'), 'utf8')
      );

      const filePath = path.join(appDir, 'PhoneSceneDelegate.swift');

      fs.writeFileSync(filePath, PHONE_SCENE_DELEGATE_SOURCE, 'utf8');

      return config;
    },
  ]);
};

// 3. Add PhoneSceneDelegate.swift to the Xcode project's compile sources
const withPhoneSceneDelegateXcodeRef: ConfigPlugin = config => {
  return withXcodeProject(config, config => {
    const project = config.modResults;
    const projectName = config.modRequest.projectName;
    if (!projectName) {
      throw new Error('expo-carplay: Could not determine Xcode project name');
    }

    const filePath = `${projectName}/PhoneSceneDelegate.swift`;

    if (!project.hasFile(filePath)) {
      const groupKey = project.findPBXGroupKey({ name: projectName });
      if (!groupKey) {
        throw new Error(
          `expo-carplay: Could not find PBXGroup "${projectName}" in Xcode project`
        );
      }
      project.addSourceFile(filePath, {}, groupKey);
    }

    return config;
  });
};

/**
 * Find the app source directory (the one containing AppDelegate.swift).
 */
function findAppSourceDir(platformProjectRoot: string): string | null {
  const entries = fs.readdirSync(platformProjectRoot, {
    withFileTypes: true,
  });
  for (const entry of entries) {
    if (
      entry.isDirectory() &&
      !entry.name.startsWith('.') &&
      entry.name !== 'Pods' &&
      entry.name !== 'build'
    ) {
      const candidate = path.join(
        platformProjectRoot,
        entry.name,
        'AppDelegate.swift'
      );
      if (fs.existsSync(candidate)) {
        return path.join(platformProjectRoot, entry.name);
      }
    }
  }
  return null;
}

export const PHONE_SCENE_DELEGATE_SOURCE = `import UIKit

// Auto-generated by expo-carplay.
// Bridges Expo's AppDelegate-based window to iOS scene lifecycle,
// which is required when UIApplicationSceneManifest is present for CarPlay.
@objc(PhoneSceneDelegate)
class PhoneSceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene,
          let appDelegate = UIApplication.shared.delegate,
          let optWindow = appDelegate.window,
          let window = optWindow
    else { return }
    window.windowScene = windowScene
    self.window = window
  }
}
`;

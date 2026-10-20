import {
  type ConfigPlugin,
  withDangerousMod,
  withInfoPlist,
  withXcodeProject,
} from 'expo/config-plugins';
import fs from 'fs';
import path from 'path';

/**
 * CarPlay needs its own scene role in UIApplicationSceneManifest. Expo SDK 58
 * already runs apps under the scene-based life cycle: prebuild generates a
 * `SceneDelegate: ExpoAppSceneDelegate` that creates the UIWindow and starts
 * React Native when the phone scene connects.
 *
 * This plugin:
 * 1. Writes both roles into Info.plist. The phone role REPLACES the template's
 *    entry (same configuration name) so plugin order does not matter; the
 *    template's SceneDelegate.swift still compiles but is never instantiated,
 *    so other plugins' edits to that "extension point" do not run.
 * 2. Generates PhoneSceneDelegate.swift, a subclass of ExpoAppSceneDelegate.
 *    Phone-first launch defers to Expo. On a CarPlay-first cold launch only
 *    the CarPlay scene connects, so CarPlaySceneDelegate has already started
 *    React Native into a scene-less placeholder window stored on the app
 *    delegate; the subclass adopts that window instead of starting a second
 *    React root.
 * 3. Adds the generated file to the Xcode project's compile sources.
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
internal import Expo

// Auto-generated by expo-carplay on every prebuild. Do not edit.
//
// Expo's ExpoAppSceneDelegate creates the UIWindow and starts React Native when
// the phone scene connects. On a CarPlay-first cold launch the CarPlay scene
// connects first and CarPlaySceneDelegate starts React Native into a scene-less
// placeholder window stored on the app delegate; this subclass adopts that
// window instead of starting React Native a second time.
@objc(PhoneSceneDelegate)
class PhoneSceneDelegate: ExpoAppSceneDelegate {
  override func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene,
          let provider = UIApplication.shared.delegate as? ExpoReactNativeFactoryProvider,
          let existing = provider.window
    else {
      // Phone-first launch: Expo creates the window and starts React Native.
      super.scene(scene, willConnectTo: session, options: connectionOptions)
      return
    }

    // CarPlay-first launch: React Native is already running in the placeholder
    // window. Re-parent it onto this scene; never call super here, which would
    // mount a second React root.
    existing.windowScene = windowScene
    window = existing
    existing.makeKeyAndVisible()

    // Cold-start URLs and activities arrive in connectionOptions. React Native
    // is already up, so replay them through the warm-link scene APIs (which
    // ExpoAppSceneDelegate forwards to subscribers and RCTLinkingManager).
    self.scene(scene, openURLContexts: connectionOptions.urlContexts)
    connectionOptions.userActivities.forEach { self.scene(scene, continue: $0) }
    if let shortcutItem = connectionOptions.shortcutItem {
      windowScene(windowScene, performActionFor: shortcutItem) { _ in }
    }
  }
}
`;

import {
  applySceneManifest,
  assertSceneLifecycleSupport,
  PHONE_SCENE_DELEGATE_SOURCE,
} from '../withCarPlayInfoPlist';

// The manifest SDK 58's `expo-template-bare-minimum` ships in Info.plist.
const sdk58Template = () => ({
  UIApplicationSceneManifest: {
    UIApplicationSupportsMultipleScenes: false,
    UISceneConfigurations: {
      UIWindowSceneSessionRoleApplication: [
        {
          UISceneConfigurationName: 'Default Configuration',
          UISceneDelegateClassName: '$(PRODUCT_MODULE_NAME).SceneDelegate',
        },
      ],
    },
  },
});

describe('applySceneManifest', () => {
  it('replaces the template phone scene entry with PhoneSceneDelegate', () => {
    const plist = applySceneManifest(sdk58Template());
    expect(
      plist.UIApplicationSceneManifest.UISceneConfigurations
        .UIWindowSceneSessionRoleApplication
    ).toEqual([
      {
        UISceneClassName: 'UIWindowScene',
        UISceneConfigurationName: 'Default Configuration',
        UISceneDelegateClassName: 'PhoneSceneDelegate',
      },
    ]);
  });

  it('adds the CarPlay scene role', () => {
    const plist = applySceneManifest(sdk58Template());
    expect(
      plist.UIApplicationSceneManifest.UISceneConfigurations
        .CPTemplateApplicationSceneSessionRoleApplication
    ).toEqual([
      {
        UISceneClassName: 'CPTemplateApplicationScene',
        UISceneConfigurationName: 'CarPlay',
        UISceneDelegateClassName: 'ExpoCarPlay.CarPlaySceneDelegate',
      },
    ]);
  });

  it('preserves UIApplicationSupportsMultipleScenes when present', () => {
    const plist = applySceneManifest(sdk58Template());
    expect(
      plist.UIApplicationSceneManifest.UIApplicationSupportsMultipleScenes
    ).toBe(false);
  });

  it('does not introduce UIApplicationSupportsMultipleScenes when absent', () => {
    const plist = applySceneManifest({});
    expect(
      plist.UIApplicationSceneManifest.UIApplicationSupportsMultipleScenes
    ).toBeUndefined();
  });
});

describe('assertSceneLifecycleSupport', () => {
  const providerAppDelegate =
    'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {';

  it('rejects Expo SDK 57', () => {
    expect(() =>
      assertSceneLifecycleSupport('57.0.28', providerAppDelegate)
    ).toThrow(/Expo SDK 58/);
  });

  it('rejects an AppDelegate without ExpoReactNativeFactoryProvider', () => {
    expect(() =>
      assertSceneLifecycleSupport(
        '58.0.16',
        'class AppDelegate: ExpoAppDelegate {'
      )
    ).toThrow(/ExpoReactNativeFactoryProvider/);
  });

  it('accepts SDK 58 with a provider AppDelegate', () => {
    expect(() =>
      assertSceneLifecycleSupport('58.0.16', providerAppDelegate)
    ).not.toThrow();
  });
});

describe('PHONE_SCENE_DELEGATE_SOURCE', () => {
  it('subclasses ExpoAppSceneDelegate from the Expo module', () => {
    expect(PHONE_SCENE_DELEGATE_SOURCE).toContain('internal import Expo');
    expect(PHONE_SCENE_DELEGATE_SOURCE).toContain('@objc(PhoneSceneDelegate)');
    expect(PHONE_SCENE_DELEGATE_SOURCE).toContain(
      'class PhoneSceneDelegate: ExpoAppSceneDelegate'
    );
  });

  it('defers to super on a phone-first launch and never starts React Native itself', () => {
    expect(PHONE_SCENE_DELEGATE_SOURCE).toContain(
      'super.scene(scene, willConnectTo: session, options: connectionOptions)'
    );
    expect(PHONE_SCENE_DELEGATE_SOURCE).not.toContain('startReactNative');
  });

  it('adopts an existing window on a CarPlay-first launch', () => {
    expect(PHONE_SCENE_DELEGATE_SOURCE).toContain(
      'as? ExpoReactNativeFactoryProvider'
    );
    expect(PHONE_SCENE_DELEGATE_SOURCE).toContain(
      'existing.windowScene = windowScene'
    );
    expect(PHONE_SCENE_DELEGATE_SOURCE).toContain(
      'existing.makeKeyAndVisible()'
    );
  });

  it('forwards cold-start URLs and user activities on the adopt path', () => {
    expect(PHONE_SCENE_DELEGATE_SOURCE).toContain(
      'connectionOptions.urlContexts'
    );
    expect(PHONE_SCENE_DELEGATE_SOURCE).toContain(
      'connectionOptions.userActivities'
    );
  });
});

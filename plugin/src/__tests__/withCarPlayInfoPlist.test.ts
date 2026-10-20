import {
  applySceneManifest,
  assertSceneLifecycleSupport,
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

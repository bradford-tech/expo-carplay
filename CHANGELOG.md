# Changelog

## [0.1.5](https://github.com/bradford-tech/expo-carplay/compare/expo-carplay-v0.1.4...expo-carplay-v0.1.5) (2026-04-07)


### Features

* **map:** add configurable bar and map buttons ([2b4edae](https://github.com/bradford-tech/expo-carplay/commit/2b4edae44066c6e65f8552b14387032a2ab967aa))

## [0.1.4](https://github.com/bradford-tech/expo-carplay/compare/expo-carplay-v0.1.3...expo-carplay-v0.1.4) (2026-04-07)


### Features

* **search:** add CPSearchTemplate with request ID pattern ([2f9d969](https://github.com/bradford-tech/expo-carplay/commit/2f9d96943da77e067aa3cebe4da39585516542d3))

## [0.1.3](https://github.com/bradford-tech/expo-carplay/compare/expo-carplay-v0.1.2...expo-carplay-v0.1.3) (2026-04-06)


### Bug Fixes

* move dev scripts from postinstall to prepare ([c36d0fb](https://github.com/bradford-tech/expo-carplay/commit/c36d0fb87e4f72df954a98d496468f3de14ff33e))

## [0.1.2](https://github.com/bradford-tech/expo-carplay/compare/expo-carplay-v0.1.1...expo-carplay-v0.1.2) (2026-04-06)


### Bug Fixes

* trigger 0.1.2 release ([53205fc](https://github.com/bradford-tech/expo-carplay/commit/53205fccccc494b80bd993deff67ee17c6136232))

## [0.1.1](https://github.com/bradford-tech/expo-carplay/compare/expo-carplay-v0.1.0...expo-carplay-v0.1.1) (2026-04-06)


### Features

* add config plugin for CarPlay scene manifest and entitlement ([087976c](https://github.com/bradford-tech/expo-carplay/commit/087976c5d2d0037be467355bb8cfdf28049cfe95))
* add createMapTemplate and setRootTemplate module functions ([130c264](https://github.com/bradford-tech/expo-carplay/commit/130c2643c4294bd1d349b5daed8a19137dbd8a41))
* add createMapTemplate and setRootTemplate TypeScript APIs ([ff6a34a](https://github.com/bradford-tech/expo-carplay/commit/ff6a34aafee414ef9de218d2b1a896e141d33c53))
* add map control forwarding to MapTemplateHandler ([2ecaa73](https://github.com/bradford-tech/expo-carplay/commit/2ecaa7389bd12c3e96505051490d2a042441354d))
* add MapTemplateHandler with bare template creation ([93ffcef](https://github.com/bradford-tech/expo-carplay/commit/93ffcefb2f10869a7bcf5aef2914d9aab029b439))
* add navigation camera and route display to CarPlay map ([d317978](https://github.com/bradford-tech/expo-carplay/commit/d3179787c1656518925b8c8694530eecd7ad4260))
* add navigation simulation buttons to example app ([3a23b1f](https://github.com/bradford-tech/expo-carplay/commit/3a23b1f9b47fbe12fbd53ef149350a4cb6f794fd))
* add SceneSessionManager for interface controller DI ([8db4044](https://github.com/bradford-tech/expo-carplay/commit/8db404443ff131872cf2784806e56b29471e4222))
* add typed scene lifecycle API with connection state ([ba57cf4](https://github.com/bradford-tech/expo-carplay/commit/ba57cf42a2d3eef2c29f94907439108c3495e689))
* add TypeScript API for CarPlay map control ([3faa292](https://github.com/bradford-tech/expo-carplay/commit/3faa2925b1e055935fc19fadb57de82440462bd9))
* add updateCarPlayLocation, setCarPlayRoute, clearCarPlayRoute ([56718c5](https://github.com/bradford-tech/expo-carplay/commit/56718c54e21681c3f52fd9ffd32507460a3b799d))
* add useCarPlay hook for connection state ([1946cb3](https://github.com/bradford-tech/expo-carplay/commit/1946cb36a52620f6ae656ff36d2a6688d9108d02))
* create map template on CarPlay connect in example app ([024befd](https://github.com/bradford-tech/expo-carplay/commit/024befdffc4a271c01dc0e1bdbfeeeff0702d451))
* declare onConnect/onDisconnect events in ExpoCarPlayModule ([ff061dd](https://github.com/bradford-tech/expo-carplay/commit/ff061dd6d3d830871043f1021050c101d5206c25))
* implement CarPlaySceneDelegate with connect/disconnect events ([0c1b889](https://github.com/bradford-tech/expo-carplay/commit/0c1b88942a5c61568f78b8a21bb0b052a9f5de53))
* implement TemplateStore for JS↔native template ID mapping ([e710965](https://github.com/bradford-tech/expo-carplay/commit/e71096562d1a2392a136a61385c04dcbbb4ef9f7))
* make SceneSessionManager shared, clear TemplateStore on disconnect ([bbbb9d9](https://github.com/bradford-tech/expo-carplay/commit/bbbb9d9ad76bfa2b785e36f2c84278a970620ca3))
* **map:** native CLLocationManager for smooth camera tracking ([d79ae9b](https://github.com/bradford-tech/expo-carplay/commit/d79ae9b18614507056e2acc77c0e4a7d4b162c10))
* **map:** support colored route segments ([7cc2cef](https://github.com/bradford-tech/expo-carplay/commit/7cc2cefc49732734f24cce81aabb23d40e335771))
* **navigation:** add turn-by-turn guidance session ([93df573](https://github.com/bradford-tech/expo-carplay/commit/93df57316da0ee62269fd3dc8be848349ca34fa0))
* render MKMapView in CarPlay window ([d79f81b](https://github.com/bradford-tech/expo-carplay/commit/d79f81b5f801195101fa29d8d0d1419f3cb345c7))


### Bug Fixes

* add mapDelegate and rootViewController for visible map template ([47ef18f](https://github.com/bradford-tech/expo-carplay/commit/47ef18f1a0dac97f63017a1f1ad56b01d43212b1))
* **ci:** remove --provenance flag from npm publish ([7d4a89d](https://github.com/bradford-tech/expo-carplay/commit/7d4a89db028368b452cd06bcefaa7f37af4ffe67))
* **ci:** upgrade actions to v6 for npm OIDC publish ([1a8ba1b](https://github.com/bradford-tech/expo-carplay/commit/1a8ba1b8b52bff0dd05b4bc0b52eef81cc24feae))
* **ci:** use node 24 and normalize repo URL for OIDC ([3d9234e](https://github.com/bradford-tech/expo-carplay/commit/3d9234e41b1bbeec9d3fb91c2d2ae0168e1dec53))
* correct EventEmitter typing for Expo SDK 55+ ([6938877](https://github.com/bradford-tech/expo-carplay/commit/6938877969c5888269dcdbd21838ed48194b2c20))
* **navigation:** finish existing trip before starting new session ([375a01d](https://github.com/bradford-tech/expo-carplay/commit/375a01db8cab5bbd7eb55fcc9bce66068fb4f566))
* **plugin:** bridge Expo to scene lifecycle for CarPlay ([5cf269b](https://github.com/bradford-tech/expo-carplay/commit/5cf269b1e034a4e845ce44172379f79829c7a5df))
* regenerate lockfile ([3b00fed](https://github.com/bradford-tech/expo-carplay/commit/3b00fed06eb9885f981f8b7afedbcf7024f05701))
* reset version for clean OIDC publish test ([ed8d7d2](https://github.com/bradford-tech/expo-carplay/commit/ed8d7d2bff92241f4d74eac1ae7157ea967851d0))
* reset version for OIDC publish ([9e0253a](https://github.com/bradford-tech/expo-carplay/commit/9e0253a87940a7fb18ec491db4c739cbf836b5b5))
* restore generic type parameters stripped by linter ([067a504](https://github.com/bradford-tech/expo-carplay/commit/067a504d15d60794affdafd8b26a803f8d6afc89))
* whitelist published files and reset version ([45d957a](https://github.com/bradford-tech/expo-carplay/commit/45d957ae26f34ada97a417d73df7c659927120b6))

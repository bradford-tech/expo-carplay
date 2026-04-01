# CarPlay Framework — Complete API Surface

> Auto-generated from Apple Developer Documentation (CarPlay framework, iOS 12.0 – iOS 26.4).
> Each section describes a feature area. Tables list every bindable member.

**Column key**

| Column | Values |
|--------|--------|
| **Kind** | `JS→Native` = call from JS · `Native→JS` = event/callback to JS · `Config` = property or data object · `Enum` = enumeration/option-set value |
| **Nav?** | `Yes` = needed for navigation apps · `No` = not relevant · `Opt` = optional/useful but not required |
| **Status** | Blank initially — fill in during implementation (`v1`, `v2`, `skip`, `—`) |

---

## 1. Scene Lifecycle & Interface Controller

Manages the CarPlay connection lifecycle. When CarPlay connects, you receive a `CPInterfaceController` (and for navigation apps, a `CPWindow` for your map). The interface controller manages the template stack — pushing, popping, and presenting templates.

### CPTemplateApplicationScene

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `delegate` | CPTemplateApplicationScene | Config | Yes | |
| `interfaceController` | CPTemplateApplicationScene | Config | Yes | |
| `carWindow` | CPTemplateApplicationScene | Config | Yes | |
| `contentStyle` | CPTemplateApplicationScene | Config | Yes | |

### CPTemplateApplicationSceneDelegate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `templateApplicationScene(_:didConnect:)` | CPTemplateApplicationSceneDelegate | Native→JS | No | |
| `templateApplicationScene(_:didConnect:to:)` | CPTemplateApplicationSceneDelegate | Native→JS | Yes | |
| `templateApplicationScene(_:didDisconnectInterfaceController:)` | CPTemplateApplicationSceneDelegate | Native→JS | No | |
| `templateApplicationScene(_:didDisconnect:from:)` | CPTemplateApplicationSceneDelegate | Native→JS | Yes | |
| `templateApplicationScene(_:didSelect:)` (maneuver) | CPTemplateApplicationSceneDelegate | Native→JS | Yes | |
| `templateApplicationScene(_:didSelect:)` (nav alert) | CPTemplateApplicationSceneDelegate | Native→JS | Yes | |
| `contentStyleDidChange(_:)` | CPTemplateApplicationSceneDelegate | Native→JS | Yes | |

### CPInterfaceController

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `delegate` | CPInterfaceController | Config | Yes | |
| `prefersDarkUserInterfaceStyle` | CPInterfaceController | Config | Opt | |
| `carTraitCollection` | CPInterfaceController | Config | Opt | |
| `rootTemplate` | CPInterfaceController | Config | Yes | |
| `topTemplate` | CPInterfaceController | Config | Yes | |
| `templates` | CPInterfaceController | Config | Yes | |
| `presentedTemplate` | CPInterfaceController | Config | Opt | |
| `setRootTemplate(_:animated:completion:)` | CPInterfaceController | JS→Native | Yes | |
| `pushTemplate(_:animated:completion:)` | CPInterfaceController | JS→Native | Yes | |
| `popTemplate(animated:completion:)` | CPInterfaceController | JS→Native | Yes | |
| `popToRootTemplate(animated:completion:)` | CPInterfaceController | JS→Native | Yes | |
| `pop(to:animated:completion:)` | CPInterfaceController | JS→Native | Yes | |
| `presentTemplate(_:animated:completion:)` | CPInterfaceController | JS→Native | Yes | |
| `dismissTemplate(animated:completion:)` | CPInterfaceController | JS→Native | Yes | |

### CPInterfaceControllerDelegate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `templateWillAppear(_:animated:)` | CPInterfaceControllerDelegate | Native→JS | Yes | |
| `templateDidAppear(_:animated:)` | CPInterfaceControllerDelegate | Native→JS | Yes | |
| `templateWillDisappear(_:animated:)` | CPInterfaceControllerDelegate | Native→JS | Yes | |
| `templateDidDisappear(_:animated:)` | CPInterfaceControllerDelegate | Native→JS | Yes | |

### CPWindow

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `templateApplicationScene` | CPWindow | Config | Yes | |
| `mapButtonSafeAreaLayoutGuide` | CPWindow | Config | Yes | |

### CPTemplate (base class)

All templates inherit these properties.

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `userInfo` | CPTemplate | Config | Yes | |
| `tabTitle` | CPTemplate | Config | Opt | |
| `tabImage` | CPTemplate | Config | Opt | |
| `tabSystemItem` | CPTemplate | Config | Opt | |
| `showsTabBadge` | CPTemplate | Config | Opt | |

### CPContentStyle (OptionSet)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.dark` | CPContentStyle | Enum | Yes | |
| `.light` | CPContentStyle | Enum | Yes | |

### CPApplicationDelegate (deprecated — pre-scene lifecycle)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `application(_:didConnectCarInterfaceController:to:)` | CPApplicationDelegate | Native→JS | Yes | |
| `application(_:didDisconnectCarInterfaceController:from:)` | CPApplicationDelegate | Native→JS | Yes | |
| `application(_:didSelect:)` (maneuver) | CPApplicationDelegate | Native→JS | Yes | |
| `application(_:didSelect:)` (nav alert) | CPApplicationDelegate | Native→JS | Yes | |

---

## 2. Map Template & Map Buttons

The map template is a control overlay for navigation apps' base map view. It provides a navigation bar (leading/trailing buttons), up to 4 map buttons, and panning mode. The `CPBarButtonProviding` protocol is shared by most templates.

### CPMapTemplate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `mapDelegate` | CPMapTemplate | Config | Yes | |
| `mapButtons` | CPMapTemplate | Config | Yes | |
| `automaticallyHidesNavigationBar` | CPMapTemplate | Config | Yes | |
| `hidesButtonsWithNavigationBar` | CPMapTemplate | Config | Yes | |
| `guidanceBackgroundColor` | CPMapTemplate | Config | Yes | |
| `tripEstimateStyle` | CPMapTemplate | Config | Yes | |
| `currentNavigationAlert` | CPMapTemplate | Config | Yes | |
| `isPanningInterfaceVisible` | CPMapTemplate | Config | Yes | |
| `showPanningInterface(animated:)` | CPMapTemplate | JS→Native | Yes | |
| `dismissPanningInterface(animated:)` | CPMapTemplate | JS→Native | Yes | |

### CPMapTemplateDelegate — Panning

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `mapTemplateDidShowPanningInterface(_:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplateWillDismissPanningInterface(_:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplateDidDismissPanningInterface(_:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplateDidBeginPanGesture(_:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:panBeganWith:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:panWith:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:panEndedWith:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:didEndPanGestureWithVelocity:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:didUpdatePanGestureWithTranslation:velocity:)` | CPMapTemplateDelegate | Native→JS | Yes | |

### CPMapTemplate.PanDirection (OptionSet)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.up` | CPMapTemplate.PanDirection | Enum | Yes | |
| `.down` | CPMapTemplate.PanDirection | Enum | Yes | |
| `.left` | CPMapTemplate.PanDirection | Enum | Yes | |
| `.right` | CPMapTemplate.PanDirection | Enum | Yes | |

### CPMapButton

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(handler:)` | CPMapButton | JS→Native | Yes | |
| `image` | CPMapButton | Config | Yes | |
| `focusedImage` | CPMapButton | Config | Opt | |
| `isEnabled` | CPMapButton | Config | Yes | |
| `isHidden` | CPMapButton | Config | Yes | |

### CPBarButton

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(image:handler:)` | CPBarButton | JS→Native | Yes | |
| `init(title:handler:)` | CPBarButton | JS→Native | Yes | |
| `isEnabled` | CPBarButton | Config | Yes | |
| `image` | CPBarButton | Config | Yes | |
| `title` | CPBarButton | Config | Yes | |
| `buttonType` | CPBarButton | Config | Yes | |
| `buttonStyle` | CPBarButton | Config | Opt | |

### CPBarButtonProviding (protocol)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `backButton` | CPBarButtonProviding | Config | Yes | |
| `leadingNavigationBarButtons` | CPBarButtonProviding | Config | Yes | |
| `trailingNavigationBarButtons` | CPBarButtonProviding | Config | Yes | |

### CPBarButtonStyle (Enum)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.none` | CPBarButtonStyle | Enum | Yes | |
| `.rounded` | CPBarButtonStyle | Enum | Yes | |

---

## 3. Navigation Session & Route Guidance

Manages the lifecycle of active navigation — from previewing trips to active turn-by-turn guidance to completion. A navigation session is obtained from `CPMapTemplate.startNavigationSession(for:)`.

### CPMapTemplate — Trip & Navigation Methods

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `showTripPreviews(_:textConfiguration:)` | CPMapTemplate | JS→Native | Yes | |
| `showTripPreviews(_:selectedTrip:textConfiguration:)` | CPMapTemplate | JS→Native | Yes | |
| `hideTripPreviews()` | CPMapTemplate | JS→Native | Yes | |
| `showRouteChoicesPreview(for:textConfiguration:)` | CPMapTemplate | JS→Native | Yes | |
| `startNavigationSession(for:)` | CPMapTemplate | JS→Native | Yes | |
| `updateEstimates(_:for:)` | CPMapTemplate | JS→Native | Yes | |
| `update(_:for:with:)` | CPMapTemplate | JS→Native | Yes | |

### CPMapTemplateDelegate — Navigation Events

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `mapTemplate(_:selectedPreviewFor:using:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:startedTrip:using:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplateDidCancelNavigation(_:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplateShouldProvideNavigationMetadata(_:)` | CPMapTemplateDelegate | Native→JS | Yes | |

### CPMapTemplateDelegate — Notifications

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `mapTemplate(_:shouldShowNotificationFor:)` (maneuver) | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:shouldUpdateNotificationFor:with:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:shouldShowNotificationFor:)` (nav alert) | CPMapTemplateDelegate | Native→JS | Yes | |

### CPMapTemplateDelegate — Navigation Alerts

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `mapTemplate(_:willShow:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:didShow:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:willDismiss:dismissalContext:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:didDismiss:dismissalContext:)` | CPMapTemplateDelegate | Native→JS | Yes | |

### CPMapTemplateDelegate — Route Sharing (iOS 26.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `mapTemplateShouldProvideRouteSharing(_:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:willShareDestinationFor:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:didShareDestinationFor:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:didFailToShareDestinationFor:error:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:didReceiveUpdatedRouteSource:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:didReceiveRequestForDestination:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:didRequestToInsert:into:completion:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:waypoint:accepted:forSegment:)` | CPMapTemplateDelegate | Native→JS | Yes | |

### CPNavigationSession

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `trip` | CPNavigationSession | Config | Yes | |
| `upcomingManeuvers` | CPNavigationSession | Config | Yes | |
| `maneuverState` | CPNavigationSession | Config | Yes | |
| `currentRoadNameVariants` | CPNavigationSession | Config | Yes | |
| `currentLaneGuidance` | CPNavigationSession | Config | Yes | |
| `currentSegment` | CPNavigationSession | Config | Yes | |
| `routeSegments` | CPNavigationSession | Config | Yes | |
| `cancelTrip()` | CPNavigationSession | JS→Native | Yes | |
| `finishTrip()` | CPNavigationSession | JS→Native | Yes | |
| `pauseTrip(for:description:)` | CPNavigationSession | JS→Native | Yes | |
| `pauseTrip(for:description:turnCardColor:)` | CPNavigationSession | JS→Native | Yes | |
| `resumeTrip(updatedRouteInformation:)` | CPNavigationSession | JS→Native | Yes | |
| `resumeTrip(updatedRouteSegments:currentSegment:rerouteReason:)` | CPNavigationSession | JS→Native | Yes | |
| `updateEstimates(_:for:)` | CPNavigationSession | JS→Native | Yes | |
| `add(_:)` (maneuvers) | CPNavigationSession | JS→Native | Yes | |
| `add(_:)` (lane guidances) | CPNavigationSession | JS→Native | Yes | |
| `addRouteSegments(_:)` | CPNavigationSession | JS→Native | Yes | |

### CPNavigationSession.PauseReason (Enum)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.arrived` | PauseReason | Enum | Yes | |
| `.loading` | PauseReason | Enum | Yes | |
| `.locating` | PauseReason | Enum | Yes | |
| `.proceedToRoute` | PauseReason | Enum | Yes | |
| `.rerouting` | PauseReason | Enum | Yes | |

### CPTrip

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(origin:destination:routeChoices:)` | CPTrip | Config | Yes | |
| `init(originWaypoint:destinationWaypoint:routeChoices:)` | CPTrip | Config | Yes | |
| `origin` | CPTrip | Config | Yes | |
| `destination` | CPTrip | Config | Yes | |
| `routeChoices` | CPTrip | Config | Yes | |
| `destinationNameVariants` | CPTrip | Config | Yes | |
| `userInfo` | CPTrip | Config | Yes | |
| `originWaypoint` | CPTrip | Config | Yes | |
| `destinationWaypoint` | CPTrip | Config | Yes | |
| `hasShareableDestination` | CPTrip | Config | Opt | |
| `routeSegmentsAvailableForRegion` | CPTrip | Config | Opt | |

### CPRouteChoice

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(summaryVariants:additionalInformationVariants:selectionSummaryVariants:)` | CPRouteChoice | Config | Yes | |
| `summaryVariants` | CPRouteChoice | Config | Yes | |
| `additionalInformationVariants` | CPRouteChoice | Config | Yes | |
| `selectionSummaryVariants` | CPRouteChoice | Config | Yes | |
| `userInfo` | CPRouteChoice | Config | Yes | |

### CPTravelEstimates

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(distanceRemaining:timeRemaining:)` | CPTravelEstimates | Config | Yes | |
| `init(distanceRemaining:distanceRemainingToDisplay:timeRemaining:)` | CPTravelEstimates | Config | Yes | |
| `distanceRemaining` | CPTravelEstimates | Config | Yes | |
| `distanceRemainingToDisplay` | CPTravelEstimates | Config | Yes | |
| `timeRemaining` | CPTravelEstimates | Config | Yes | |

### CPRouteInformation (iOS 17.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(maneuvers:laneGuidances:currentManeuvers:currentLaneGuidance:trip:maneuverTravelEstimates:)` | CPRouteInformation | Config | Yes | |
| `maneuvers` | CPRouteInformation | Config | Yes | |
| `laneGuidances` | CPRouteInformation | Config | Yes | |
| `currentManeuvers` | CPRouteInformation | Config | Yes | |
| `currentLaneGuidance` | CPRouteInformation | Config | Yes | |
| `maneuverTravelEstimates` | CPRouteInformation | Config | Yes | |
| `tripTravelEstimates` | CPRouteInformation | Config | Yes | |

### CPRouteSegment (iOS 26.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(origin:destination:maneuvers:laneGuidances:currentManeuvers:currentLaneGuidance:tripTravelEstimates:maneuverTravelEstimates:coordinates:)` | CPRouteSegment | Config | Yes | |
| `identifier` | CPRouteSegment | Config | Yes | |
| `origin` | CPRouteSegment | Config | Yes | |
| `destination` | CPRouteSegment | Config | Yes | |
| `maneuvers` | CPRouteSegment | Config | Yes | |
| `laneGuidances` | CPRouteSegment | Config | Yes | |
| `currentManeuvers` | CPRouteSegment | Config | Yes | |
| `currentLaneGuidance` | CPRouteSegment | Config | Yes | |
| `tripTravelEstimates` | CPRouteSegment | Config | Yes | |
| `maneuverTravelEstimates` | CPRouteSegment | Config | Yes | |
| `coordinates` | CPRouteSegment | Config | Yes | |

### CPNavigationWaypoint (iOS 26.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(centerPoint:locationThreshold:name:address:entryPoints:timeZone:)` | CPNavigationWaypoint | Config | Yes | |
| `init(mapItem:locationThreshold:entryPoints:)` | CPNavigationWaypoint | Config | Yes | |
| `centerPoint` | CPNavigationWaypoint | Config | Yes | |
| `locationThreshold` | CPNavigationWaypoint | Config | Yes | |
| `name` | CPNavigationWaypoint | Config | Yes | |
| `address` | CPNavigationWaypoint | Config | Yes | |
| `entryPoints` | CPNavigationWaypoint | Config | Yes | |
| `timeZone` | CPNavigationWaypoint | Config | Yes | |

### CPMapTemplateWaypoint (iOS 26.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(waypoint:travelEstimates:)` | CPMapTemplateWaypoint | Config | Yes | |
| `waypoint` | CPMapTemplateWaypoint | Config | Yes | |
| `travelEstimates` | CPMapTemplateWaypoint | Config | Yes | |

### CPTripPreviewTextConfiguration

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(startButtonTitle:additionalRoutesButtonTitle:overviewButtonTitle:)` | CPTripPreviewTextConfiguration | Config | Yes | |
| `startButtonTitle` | CPTripPreviewTextConfiguration | Config | Yes | |
| `additionalRoutesButtonTitle` | CPTripPreviewTextConfiguration | Config | Yes | |
| `overviewButtonTitle` | CPTripPreviewTextConfiguration | Config | Yes | |

### CPTripEstimateStyle (Enum)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.light` | CPTripEstimateStyle | Enum | Yes | |
| `.dark` | CPTripEstimateStyle | Enum | Yes | |

### CPTimeRemainingColor (Enum)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.default` | CPTimeRemainingColor | Enum | Yes | |
| `.green` | CPTimeRemainingColor | Enum | Yes | |
| `.orange` | CPTimeRemainingColor | Enum | Yes | |
| `.red` | CPTimeRemainingColor | Enum | Yes | |

### CPRouteSource (Enum, iOS 26.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.sourceInactive` | CPRouteSource | Enum | Yes | |
| `.sourceVehicle` | CPRouteSource | Enum | Yes | |
| `.sourceiOSDestinationsOnly` | CPRouteSource | Enum | Yes | |
| `.sourceiOSRouteDestinationsModified` | CPRouteSource | Enum | Yes | |
| `.sourceiOSRouteModified` | CPRouteSource | Enum | Yes | |
| `.sourceiOSUnchanged` | CPRouteSource | Enum | Yes | |

### CPRerouteReason (Enum, iOS 26.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.alternateRoute` | CPRerouteReason | Enum | Yes | |
| `.missedTurn` | CPRerouteReason | Enum | Yes | |
| `.offline` | CPRerouteReason | Enum | Yes | |
| `.mandated` | CPRerouteReason | Enum | Yes | |
| `.unknown` | CPRerouteReason | Enum | Yes | |
| `.waypointModified` | CPRerouteReason | Enum | Yes | |

---

## 4. Maneuvers & Lane Guidance

Represents turn-by-turn instructions. Each `CPManeuver` includes symbols, instruction text, and metadata for the CarPlay screen, Dashboard, instrument cluster, and notifications. Lane guidance provides structured lane data for instrument cluster/HUD display.

### CPManeuver

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `instructionVariants` | CPManeuver | Config | Yes | |
| `attributedInstructionVariants` | CPManeuver | Config | Yes | |
| `symbolImage` | CPManeuver | Config | Yes | |
| `symbolSet` | CPManeuver | Config | Yes | |
| `junctionImage` | CPManeuver | Config | Yes | |
| `initialTravelEstimates` | CPManeuver | Config | Yes | |
| `userInfo` | CPManeuver | Config | Yes | |
| `cardBackgroundColor` | CPManeuver | Config | Opt | |
| `dashboardSymbolImage` | CPManeuver | Config | Yes | |
| `dashboardJunctionImage` | CPManeuver | Config | Opt | |
| `dashboardInstructionVariants` | CPManeuver | Config | Yes | |
| `dashboardAttributedInstructionVariants` | CPManeuver | Config | Opt | |
| `notificationSymbolImage` | CPManeuver | Config | Yes | |
| `notificationInstructionVariants` | CPManeuver | Config | Yes | |
| `notificationAttributedInstructionVariants` | CPManeuver | Config | Opt | |
| `maneuverType` | CPManeuver | Config | Yes | |
| `roadFollowingManeuverVariants` | CPManeuver | Config | Opt | |
| `trafficSide` | CPManeuver | Config | Yes | |
| `junctionType` | CPManeuver | Config | Yes | |
| `junctionExitAngle` | CPManeuver | Config | Opt | |
| `junctionElementAngles` | CPManeuver | Config | Opt | |
| `linkedLaneGuidance` | CPManeuver | Config | Yes | |
| `highwayExitLabel` | CPManeuver | Config | Opt | |

### CPMapTemplateDelegate — Maneuver Display

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `mapTemplate(_:displayStyleFor:)` | CPMapTemplateDelegate | Native→JS | Yes | |

### CPManeuverDisplayStyle (OptionSet)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.default` | CPManeuverDisplayStyle | Enum | Yes | |
| `.leadingSymbol` | CPManeuverDisplayStyle | Enum | Yes | |
| `.trailingSymbol` | CPManeuverDisplayStyle | Enum | Yes | |
| `.symbolOnly` | CPManeuverDisplayStyle | Enum | Yes | |
| `.instructionOnly` | CPManeuverDisplayStyle | Enum | Yes | |

### CPManeuverState (Enum, iOS 17.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.continue` | CPManeuverState | Enum | Yes | |
| `.initial` | CPManeuverState | Enum | Yes | |
| `.prepare` | CPManeuverState | Enum | Yes | |
| `.execute` | CPManeuverState | Enum | Yes | |

### CPManeuverType (Enum, iOS 17.4+ — 54 cases)

#### Turn maneuvers

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.noTurn` | CPManeuverType | Enum | Yes | |
| `.leftTurn` | CPManeuverType | Enum | Yes | |
| `.rightTurn` | CPManeuverType | Enum | Yes | |
| `.slightLeftTurn` | CPManeuverType | Enum | Yes | |
| `.slightRightTurn` | CPManeuverType | Enum | Yes | |
| `.sharpLeftTurn` | CPManeuverType | Enum | Yes | |
| `.sharpRightTurn` | CPManeuverType | Enum | Yes | |
| `.leftTurnAtEnd` | CPManeuverType | Enum | Yes | |
| `.rightTurnAtEnd` | CPManeuverType | Enum | Yes | |
| `.straightAhead` | CPManeuverType | Enum | Yes | |

#### U-turn maneuvers

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.uTurn` | CPManeuverType | Enum | Yes | |
| `.uTurnWhenPossible` | CPManeuverType | Enum | Yes | |
| `.uTurnAtRoundabout` | CPManeuverType | Enum | Yes | |

#### Keep / merge maneuvers

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.keepLeft` | CPManeuverType | Enum | Yes | |
| `.keepRight` | CPManeuverType | Enum | Yes | |
| `.followRoad` | CPManeuverType | Enum | Yes | |

#### Highway maneuvers

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.changeHighway` | CPManeuverType | Enum | Yes | |
| `.changeHighwayLeft` | CPManeuverType | Enum | Yes | |
| `.changeHighwayRight` | CPManeuverType | Enum | Yes | |
| `.offRamp` | CPManeuverType | Enum | Yes | |
| `.onRamp` | CPManeuverType | Enum | Yes | |
| `.highwayOffRampLeft` | CPManeuverType | Enum | Yes | |
| `.highwayOffRampRight` | CPManeuverType | Enum | Yes | |

#### Roundabout maneuvers

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.enterRoundabout` | CPManeuverType | Enum | Yes | |
| `.exitRoundabout` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit1` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit2` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit3` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit4` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit5` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit6` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit7` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit8` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit9` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit10` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit11` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit12` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit13` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit14` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit15` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit16` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit17` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit18` | CPManeuverType | Enum | Yes | |
| `.roundaboutExit19` | CPManeuverType | Enum | Yes | |

#### Ferry maneuvers

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.changeFerry` | CPManeuverType | Enum | Yes | |
| `.enterFerry` | CPManeuverType | Enum | Yes | |
| `.exitFerry` | CPManeuverType | Enum | Yes | |

#### Arrival / start maneuvers

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.arriveAtDestination` | CPManeuverType | Enum | Yes | |
| `.arriveAtDestinationLeft` | CPManeuverType | Enum | Yes | |
| `.arriveAtDestinationRight` | CPManeuverType | Enum | Yes | |
| `.arriveEndOfDirections` | CPManeuverType | Enum | Yes | |
| `.arriveEndOfNavigation` | CPManeuverType | Enum | Yes | |
| `.startRoute` | CPManeuverType | Enum | Yes | |
| `.startRouteWithUTurn` | CPManeuverType | Enum | Yes | |

### CPLaneGuidance (iOS 17.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `instructionVariants` | CPLaneGuidance | Config | Yes | |
| `lanes` | CPLaneGuidance | Config | Yes | |

### CPLane (iOS 17.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init()` | CPLane | Config | Yes | |
| `init(angles:)` | CPLane | Config | Yes | |
| `init(angles:highlightedAngle:isPreferred:)` | CPLane | Config | Yes | |
| `status` | CPLane | Config | Yes | |
| `primaryAngle` | CPLane | Config | Yes | |
| `secondaryAngles` | CPLane | Config | Yes | |

### CPLaneStatus (Enum, iOS 17.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.notGood` | CPLaneStatus | Enum | Yes | |
| `.good` | CPLaneStatus | Enum | Yes | |
| `.preferred` | CPLaneStatus | Enum | Yes | |

### CPJunctionType (Enum, iOS 17.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.intersection` | CPJunctionType | Enum | Yes | |
| `.roundabout` | CPJunctionType | Enum | Yes | |

### CPTrafficSide (Enum, iOS 17.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.right` | CPTrafficSide | Enum | Yes | |
| `.left` | CPTrafficSide | Enum | Yes | |

### CPImageSet

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(lightContentImage:darkContentImage:)` | CPImageSet | Config | Yes | |
| `lightContentImage` | CPImageSet | Config | Yes | |
| `darkContentImage` | CPImageSet | Config | Yes | |

---

## 5. Navigation Alerts

Real-time alerts overlaid on the map during navigation. Used for traffic incidents, route changes, etc. Can include action buttons and auto-dismiss after a duration.

### CPNavigationAlert

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(titleVariants:subtitleVariants:image:primaryAction:secondaryAction:duration:)` | CPNavigationAlert | Config | Yes | |
| `init(titleVariants:subtitleVariants:imageSet:primaryAction:secondaryAction:duration:)` | CPNavigationAlert | Config | Yes | |
| `titleVariants` | CPNavigationAlert | Config | Yes | |
| `subtitleVariants` | CPNavigationAlert | Config | Yes | |
| `image` | CPNavigationAlert | Config | Yes | |
| `imageSet` | CPNavigationAlert | Config | Yes | |
| `primaryAction` | CPNavigationAlert | Config | Yes | |
| `secondaryAction` | CPNavigationAlert | Config | Yes | |
| `duration` | CPNavigationAlert | Config | Yes | |
| `updateTitleVariants(_:subtitleVariants:)` | CPNavigationAlert | JS→Native | Yes | |

### CPMapTemplate — Alert Methods

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `present(navigationAlert:animated:)` | CPMapTemplate | JS→Native | Yes | |
| `dismissNavigationAlert(animated:completion:)` | CPMapTemplate | JS→Native | Yes | |

### CPNavigationAlert.DismissalContext (Enum)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.timeout` | DismissalContext | Enum | Yes | |
| `.systemDismissed` | DismissalContext | Enum | Yes | |
| `.userDismissed` | DismissalContext | Enum | Yes | |

### Constants

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `CPNavigationAlertMinimumDuration` | Global | Config | Yes | |

---

## 6. Search Template

Displays a keyboard, text field, and scrollable list of results. The app parses search text and provides results as `CPListItem` arrays. Keyboard availability may be limited by the vehicle while driving.

### CPSearchTemplate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `delegate` | CPSearchTemplate | Config | Yes | |

### CPSearchTemplateDelegate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `searchTemplate(_:updatedSearchText:completionHandler:)` | CPSearchTemplateDelegate | Native→JS | Yes | |
| `searchTemplate(_:selectedResult:completionHandler:)` | CPSearchTemplateDelegate | Native→JS | Yes | |
| `searchTemplateSearchButtonPressed(_:)` | CPSearchTemplateDelegate | Native→JS | Yes | |

---

## 7. List Template

A scrollable single-column list divided into sections. Items can be standard text/image items, image rows (with multiple element styles), message items (communication apps), or assistant cells (Siri). Some vehicles limit lists to 12 items while driving.

### CPListTemplate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(title:sections:)` | CPListTemplate | Config | Yes | |
| `init(title:sections:assistantCellConfiguration:)` | CPListTemplate | Config | Opt | |
| `init(title:listHeader:sections:assistantCellConfiguration:)` | CPListTemplate | Config | Opt | |
| `init(title:sections:assistantCellConfiguration:headerGridButtons:)` | CPListTemplate | Config | Opt | |
| `sections` | CPListTemplate | Config | Yes | |
| `sectionCount` | CPListTemplate | Config | Yes | |
| `itemCount` | CPListTemplate | Config | Yes | |
| `title` | CPListTemplate | Config | Yes | |
| `delegate` | CPListTemplate | Config | Yes | |
| `assistantCellConfiguration` | CPListTemplate | Config | Opt | |
| `emptyViewTitleVariants` | CPListTemplate | Config | Opt | |
| `emptyViewSubtitleVariants` | CPListTemplate | Config | Opt | |
| `headerGridButtons` | CPListTemplate | Config | Opt | |
| `listHeader` | CPListTemplate | Config | Opt | |
| `showsSpinnerWhileEmpty` | CPListTemplate | Config | Opt | |
| `updateSections(_:)` | CPListTemplate | JS→Native | Yes | |
| `indexPath(for:)` | CPListTemplate | JS→Native | Opt | |
| `maximumSectionCount` | CPListTemplate (static) | Config | Yes | |
| `maximumItemCount` | CPListTemplate (static) | Config | Yes | |

### CPListTemplateDelegate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `listTemplate(_:didSelect:completionHandler:)` | CPListTemplateDelegate | Native→JS | Yes | |

### CPListSection

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(items:)` | CPListSection | Config | Yes | |
| `init(items:header:sectionIndexTitle:)` | CPListSection | Config | Yes | |
| `init(items:header:headerSubtitle:headerImage:headerButton:sectionIndexTitle:)` | CPListSection | Config | Opt | |
| `header` | CPListSection | Config | Yes | |
| `sectionIndexTitle` | CPListSection | Config | Opt | |
| `items` | CPListSection | Config | Yes | |
| `headerButton` | CPListSection | Config | Opt | |
| `headerImage` | CPListSection | Config | Opt | |
| `headerSubtitle` | CPListSection | Config | Opt | |
| `index(of:)` | CPListSection | JS→Native | Opt | |
| `item(at:)` | CPListSection | JS→Native | Opt | |

### CPListItem

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(text:detailText:)` | CPListItem | Config | Yes | |
| `init(text:detailText:image:)` | CPListItem | Config | Yes | |
| `init(text:detailText:image:accessoryImage:accessoryType:)` | CPListItem | Config | Opt | |
| `text` | CPListItem | Config | Yes | |
| `detailText` | CPListItem | Config | Yes | |
| `image` | CPListItem | Config | Yes | |
| `accessoryType` | CPListItem | Config | Opt | |
| `accessoryImage` | CPListItem | Config | Opt | |
| `isEnabled` | CPListItem | Config | Yes | |
| `handler` | CPListItem | Native→JS | Yes | |
| `userInfo` | CPListItem | Config | Yes | |
| `isExplicitContent` | CPListItem | Config | No | |
| `isPlaying` | CPListItem | Config | No | |
| `playingIndicatorLocation` | CPListItem | Config | No | |
| `playbackProgress` | CPListItem | Config | No | |
| `showsDisclosureIndicator` | CPListItem | Config | Yes | |
| `setText(_:)` | CPListItem | JS→Native | Yes | |
| `setDetailText(_:)` | CPListItem | JS→Native | Yes | |
| `setImage(_:)` | CPListItem | JS→Native | Yes | |
| `setAccessoryImage(_:)` | CPListItem | JS→Native | Opt | |
| `maximumImageSize` | CPListItem (static) | Config | Yes | |

### CPListItemAccessoryType (Enum)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.none` | CPListItemAccessoryType | Enum | Yes | |
| `.disclosureIndicator` | CPListItemAccessoryType | Enum | Yes | |
| `.cloud` | CPListItemAccessoryType | Enum | No | |

### CPListItemPlayingIndicatorLocation (Enum)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.leading` | CPListItemPlayingIndicatorLocation | Enum | No | |
| `.trailing` | CPListItemPlayingIndicatorLocation | Enum | No | |

### CPListImageRowItem

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(text:images:)` | CPListImageRowItem | Config | Opt | |
| `init(text:images:imageTitles:)` | CPListImageRowItem | Config | Opt | |
| `init(text:elements:allowsMultipleLines:)` | CPListImageRowItem | Config | Opt | |
| `init(text:cardElements:allowsMultipleLines:)` | CPListImageRowItem | Config | Opt | |
| `init(text:condensedElements:allowsMultipleLines:)` | CPListImageRowItem | Config | Opt | |
| `init(text:gridElements:allowsMultipleLines:)` | CPListImageRowItem | Config | Opt | |
| `init(text:imageGridElements:allowsMultipleLines:)` | CPListImageRowItem | Config | Opt | |
| `text` | CPListImageRowItem | Config | Opt | |
| `gridImages` | CPListImageRowItem | Config | Opt | |
| `imageTitles` | CPListImageRowItem | Config | Opt | |
| `elements` | CPListImageRowItem | Config | Opt | |
| `allowsMultipleLines` | CPListImageRowItem | Config | Opt | |
| `listImageRowHandler` | CPListImageRowItem | Native→JS | Opt | |
| `handler` | CPListImageRowItem | Native→JS | Opt | |
| `userInfo` | CPListImageRowItem | Config | Opt | |
| `isEnabled` | CPListImageRowItem | Config | Opt | |
| `update(_:)` | CPListImageRowItem | JS→Native | Opt | |
| `maximumImageSize` | CPListImageRowItem (static) | Config | Opt | |

### CPListImageRowItem Element Types (iOS 26+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `image` | CPListImageRowItemElement | Config | Opt | |
| `isEnabled` | CPListImageRowItemElement | Config | Opt | |
| `maximumImageSize` | CPListImageRowItemElement (static) | Config | Opt | |
| `init(image:title:subtitle:)` | CPListImageRowItemRowElement | Config | Opt | |
| `init(image:showsImageFullHeight:title:subtitle:tintColor:)` | CPListImageRowItemCardElement | Config | Opt | |
| `init(thumbnail:title:subtitle:tintColor:)` | CPListImageRowItemCardElement | Config | Opt | |
| `init(image:imageShape:title:subtitle:accessorySymbolName:)` | CPListImageRowItemCondensedElement | Config | Opt | |
| `init(image:)` | CPListImageRowItemGridElement | Config | Opt | |
| `init(image:imageShape:title:accessorySymbolName:)` | CPListImageRowItemImageGridElement | Config | Opt | |

### CPListTemplateDetailsHeader (iOS 26.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(thumbnail:title:subtitle:actionButtons:)` | CPListTemplateDetailsHeader | Config | Opt | |
| `init(thumbnail:title:subtitle:bodyVariants:actionButtons:)` | CPListTemplateDetailsHeader | Config | Opt | |
| `thumbnail` | CPListTemplateDetailsHeader | Config | Opt | |
| `title` | CPListTemplateDetailsHeader | Config | Opt | |
| `subtitle` | CPListTemplateDetailsHeader | Config | Opt | |
| `actionButtons` | CPListTemplateDetailsHeader | Config | Opt | |
| `bodyVariants` | CPListTemplateDetailsHeader | Config | Opt | |
| `wantsAdaptiveBackgroundStyle` | CPListTemplateDetailsHeader | Config | Opt | |

### CPListTemplateItem (Protocol)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `text` | CPListTemplateItem | Config | Yes | |
| `userInfo` | CPListTemplateItem | Config | Yes | |
| `isEnabled` | CPListTemplateItem | Config | Yes | |

### CPSelectableListItem (Protocol)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `handler` | CPSelectableListItem | Native→JS | Yes | |

### CPAssistantCellConfiguration

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(position:visibility:assistantAction:)` | CPAssistantCellConfiguration | Config | Opt | |
| `position` | CPAssistantCellConfiguration | Config | Opt | |
| `visibility` | CPAssistantCellConfiguration | Config | Opt | |
| `assistantAction` | CPAssistantCellConfiguration | Config | Opt | |

### CPAssistantCellActionType (Enum)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.playMedia` | CPAssistantCellActionType | Enum | No | |
| `.startCall` | CPAssistantCellActionType | Enum | No | |

### CPListItem.AssistantCellPosition (Enum)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.top` | AssistantCellPosition | Enum | Opt | |
| `.bottom` | AssistantCellPosition | Enum | Opt | |

### CPListItem.AssistantCellVisibility (Enum)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.off` | AssistantCellVisibility | Enum | Opt | |
| `.always` | AssistantCellVisibility | Enum | Opt | |
| `.whileLimitedUIActive` | AssistantCellVisibility | Enum | Opt | |

---

## 8. Grid Template

A menu of up to 8 items displayed as icon + title buttons. Includes a navigation bar with title and leading/trailing buttons.

### CPGridTemplate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(title:gridButtons:)` | CPGridTemplate | Config | Yes | |
| `title` | CPGridTemplate | Config | Yes | |
| `gridButtons` | CPGridTemplate | Config | Yes | |
| `updateGridButtons(_:)` | CPGridTemplate | JS→Native | Yes | |
| `updateTitle(_:)` | CPGridTemplate | JS→Native | Yes | |
| `maximumGridButtonImageSize` | CPGridTemplate (static) | Config | Yes | |

### CPGridButton

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(titleVariants:image:handler:)` | CPGridButton | JS→Native | Yes | |
| `titleVariants` | CPGridButton | Config | Yes | |
| `image` | CPGridButton | Config | Yes | |
| `isEnabled` | CPGridButton | Config | Yes | |
| `updateImage(_:)` | CPGridButton | JS→Native | Yes | |
| `updateTitleVariants(_:)` | CPGridButton | JS→Native | Yes | |

---

## 9. Tab Bar Template

A container that holds other templates as tabs. Each tab shows a root template. Supports up to 4 tabs (audio) or 5 tabs (other categories). Tabs can show red badge indicators.

### CPTabBarTemplate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(templates:)` | CPTabBarTemplate | Config | Yes | |
| `delegate` | CPTabBarTemplate | Config | Yes | |
| `templates` | CPTabBarTemplate | Config | Yes | |
| `selectedTemplate` | CPTabBarTemplate | Config | Yes | |
| `maximumTabCount` | CPTabBarTemplate (static) | Config | Yes | |
| `updateTemplates(_:)` | CPTabBarTemplate | JS→Native | Yes | |
| `select(_:)` | CPTabBarTemplate | JS→Native | Yes | |
| `selectTemplate(at:)` | CPTabBarTemplate | JS→Native | Yes | |

### CPTabBarTemplateDelegate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `tabBarTemplate(_:didSelect:)` | CPTabBarTemplateDelegate | Native→JS | Yes | |

---

## 10. Information Template

A static label display with optional footer buttons. Labels can be single-column or two-column. Useful for showing summaries (e.g., charging station details, order summaries).

### CPInformationTemplate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(title:layout:items:actions:)` | CPInformationTemplate | Config | Opt | |
| `layout` | CPInformationTemplate | Config | Opt | |
| `title` | CPInformationTemplate | Config | Opt | |
| `items` | CPInformationTemplate | Config | Opt | |
| `actions` | CPInformationTemplate | Config | Opt | |

### CPInformationItem

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(title:detail:)` | CPInformationItem | Config | Opt | |
| `title` | CPInformationItem | Config | Opt | |
| `detail` | CPInformationItem | Config | Opt | |

### CPInformationRatingItem

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(rating:maximumRating:title:detail:)` | CPInformationRatingItem | Config | No | |
| `rating` | CPInformationRatingItem | Config | No | |
| `maximumRating` | CPInformationRatingItem | Config | No | |

### CPInformationTemplateLayout (Enum)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.leading` | CPInformationTemplateLayout | Enum | Opt | |
| `.twoColumn` | CPInformationTemplateLayout | Enum | Opt | |

### CPTextButton

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(title:textStyle:handler:)` | CPTextButton | JS→Native | Yes | |
| `title` | CPTextButton | Config | Yes | |
| `textStyle` | CPTextButton | Config | Yes | |

### CPTextButtonStyle (Enum)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.normal` | CPTextButtonStyle | Enum | Yes | |
| `.confirm` | CPTextButtonStyle | Enum | Yes | |
| `.cancel` | CPTextButtonStyle | Enum | Yes | |

---

## 11. Alert & Action Sheet Templates

Modal dialogs. Alerts show a title with buttons. Action sheets show a title, message, and contextual choices. Both use `CPAlertAction` for buttons.

### CPAlertTemplate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(titleVariants:actions:)` | CPAlertTemplate | Config | Yes | |
| `titleVariants` | CPAlertTemplate | Config | Yes | |
| `actions` | CPAlertTemplate | Config | Yes | |
| `maximumActionCount` | CPAlertTemplate (static) | Config | Yes | |

### CPActionSheetTemplate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(title:message:actions:)` | CPActionSheetTemplate | Config | Yes | |
| `title` | CPActionSheetTemplate | Config | Yes | |
| `message` | CPActionSheetTemplate | Config | Yes | |
| `actions` | CPActionSheetTemplate | Config | Yes | |

### CPAlertAction

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(title:style:handler:)` | CPAlertAction | JS→Native | Yes | |
| `init(title:color:handler:)` | CPAlertAction | JS→Native | Opt | |
| `title` | CPAlertAction | Config | Yes | |
| `style` | CPAlertAction | Config | Yes | |
| `color` | CPAlertAction | Config | Opt | |
| `handler` | CPAlertAction | Native→JS | Yes | |

### CPAlertAction.Style (Enum)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.default` | CPAlertAction.Style | Enum | Yes | |
| `.cancel` | CPAlertAction.Style | Enum | Yes | |
| `.destructive` | CPAlertAction.Style | Enum | Yes | |

---

## 12. Contact Template

Displays information about a person or business with action buttons (call, message, directions). Primarily for communication apps but available to navigation apps.

### CPContactTemplate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(contact:)` | CPContactTemplate | Config | Opt | |
| `contact` | CPContactTemplate | Config | Opt | |

### CPContact

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(name:image:)` | CPContact | Config | Opt | |
| `name` | CPContact | Config | Opt | |
| `image` | CPContact | Config | Opt | |
| `subtitle` | CPContact | Config | Opt | |
| `informativeText` | CPContact | Config | Opt | |
| `actions` | CPContact | Config | Opt | |

### CPButton (base class for contact buttons)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(image:handler:)` | CPButton | JS→Native | Opt | |
| `image` | CPButton | Config | Opt | |
| `title` | CPButton | Config | Opt | |
| `isEnabled` | CPButton | Config | Opt | |

### Contact Button Subclasses

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(handler:)` | CPContactCallButton | JS→Native | Opt | |
| `init(handler:)` | CPContactDirectionsButton | JS→Native | Yes | |
| `init(phoneOrEmail:)` | CPContactMessageButton | Config | No | |
| `phoneOrEmail` | CPContactMessageButton | Config | No | |

---

## 13. Point of Interest Template

Displays a MapKit map with up to 12 annotated locations and a scrollable picker. Each point of interest has a detail card with primary/secondary action buttons. Available to driving task, EV charging, fueling, parking, quick food ordering, and public safety apps — **not** navigation apps.

### CPPointOfInterestTemplate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(title:pointsOfInterest:selectedIndex:)` | CPPointOfInterestTemplate | Config | No | |
| `title` | CPPointOfInterestTemplate | Config | No | |
| `pointsOfInterest` | CPPointOfInterestTemplate | Config | No | |
| `selectedIndex` | CPPointOfInterestTemplate | Config | No | |
| `pointOfInterestDelegate` | CPPointOfInterestTemplate | Config | No | |
| `setPointsOfInterest(_:selectedIndex:)` | CPPointOfInterestTemplate | JS→Native | No | |

### CPPointOfInterestTemplateDelegate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `pointOfInterestTemplate(_:didChangeMapRegion:)` | CPPointOfInterestTemplateDelegate | Native→JS | No | |
| `pointOfInterestTemplate(_:didSelectPointOfInterest:)` | CPPointOfInterestTemplateDelegate | Native→JS | No | |

### CPPointOfInterest

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(location:title:subtitle:summary:detailTitle:detailSubtitle:detailSummary:pinImage:)` | CPPointOfInterest | Config | No | |
| `init(location:title:subtitle:summary:detailTitle:detailSubtitle:detailSummary:pinImage:selectedPinImage:)` | CPPointOfInterest | Config | No | |
| `location` | CPPointOfInterest | Config | No | |
| `title` | CPPointOfInterest | Config | No | |
| `subtitle` | CPPointOfInterest | Config | No | |
| `summary` | CPPointOfInterest | Config | No | |
| `detailTitle` | CPPointOfInterest | Config | No | |
| `detailSubtitle` | CPPointOfInterest | Config | No | |
| `detailSummary` | CPPointOfInterest | Config | No | |
| `pinImage` | CPPointOfInterest | Config | No | |
| `selectedPinImage` | CPPointOfInterest | Config | No | |
| `primaryButton` | CPPointOfInterest | Config | No | |
| `secondaryButton` | CPPointOfInterest | Config | No | |
| `userInfo` | CPPointOfInterest | Config | No | |
| `pinImageSize` | CPPointOfInterest (static) | Config | No | |
| `selectedPinImageSize` | CPPointOfInterest (static) | Config | No | |

---

## 14. Now Playing Template

Displays currently-playing audio metadata (title, artist, artwork, elapsed time) with playback controls. A shared singleton — the system can present it on your behalf. Includes sports mode (iOS 18.4+) for live sporting events.

### CPNowPlayingTemplate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `shared` | CPNowPlayingTemplate (static) | Config | Opt | |
| `nowPlayingButtons` | CPNowPlayingTemplate | Config | Opt | |
| `isAlbumArtistButtonEnabled` | CPNowPlayingTemplate | Config | No | |
| `isUpNextButtonEnabled` | CPNowPlayingTemplate | Config | No | |
| `upNextTitle` | CPNowPlayingTemplate | Config | No | |
| `nowPlayingMode` | CPNowPlayingTemplate | Config | No | |
| `updateNowPlayingButtons(_:)` | CPNowPlayingTemplate | JS→Native | Opt | |
| `add(_:)` (observer) | CPNowPlayingTemplate | JS→Native | Opt | |
| `remove(_:)` (observer) | CPNowPlayingTemplate | JS→Native | Opt | |

### CPNowPlayingTemplateObserver (Protocol)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `nowPlayingTemplateAlbumArtistButtonTapped(_:)` | CPNowPlayingTemplateObserver | Native→JS | No | |
| `nowPlayingTemplateUpNextButtonTapped(_:)` | CPNowPlayingTemplateObserver | Native→JS | No | |

### CPNowPlayingButton (abstract base)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(handler:)` | CPNowPlayingButton | JS→Native | Opt | |
| `isEnabled` | CPNowPlayingButton | Config | Opt | |
| `isSelected` | CPNowPlayingButton | Config | Opt | |

### Now Playing Button Subclasses

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(image:handler:)` | CPNowPlayingImageButton | JS→Native | Opt | |
| `image` | CPNowPlayingImageButton | Config | Opt | |
| `CPNowPlayingAddToLibraryButton` | (inherits init from base) | JS→Native | No | |
| `CPNowPlayingMoreButton` | (inherits init from base) | JS→Native | No | |
| `CPNowPlayingPlaybackRateButton` | (inherits init from base) | JS→Native | No | |
| `CPNowPlayingRepeatButton` | (inherits init from base) | JS→Native | No | |
| `CPNowPlayingShuffleButton` | (inherits init from base) | JS→Native | No | |

### Sports Mode Types (iOS 18.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `CPNowPlayingMode.default` | CPNowPlayingMode (static) | Config | No | |
| `init(leftTeam:rightTeam:eventStatus:backgroundArtwork:)` | CPNowPlayingModeSports | Config | No | |
| `leftTeam` | CPNowPlayingModeSports | Config | No | |
| `rightTeam` | CPNowPlayingModeSports | Config | No | |
| `eventStatus` | CPNowPlayingModeSports | Config | No | |
| `backgroundArtwork` | CPNowPlayingModeSports | Config | No | |
| `init(elapsedTime:paused:)` | CPNowPlayingSportsClock | Config | No | |
| `init(timeRemaining:paused:)` | CPNowPlayingSportsClock | Config | No | |
| `countsUp` | CPNowPlayingSportsClock | Config | No | |
| `isPaused` | CPNowPlayingSportsClock | Config | No | |
| `timeValue` | CPNowPlayingSportsClock | Config | No | |
| `init(eventStatusText:eventStatusImage:eventClock:)` | CPNowPlayingSportsEventStatus | Config | No | |
| `eventStatusText` | CPNowPlayingSportsEventStatus | Config | No | |
| `eventStatusImage` | CPNowPlayingSportsEventStatus | Config | No | |
| `eventClock` | CPNowPlayingSportsEventStatus | Config | No | |
| `init(name:logo:teamStandings:eventScore:possessionIndicator:favorite:)` | CPNowPlayingSportsTeam | Config | No | |
| `name` | CPNowPlayingSportsTeam | Config | No | |
| `logo` | CPNowPlayingSportsTeam | Config | No | |
| `teamStandings` | CPNowPlayingSportsTeam | Config | No | |
| `eventScore` | CPNowPlayingSportsTeam | Config | No | |
| `possessionIndicator` | CPNowPlayingSportsTeam | Config | No | |
| `isFavorite` | CPNowPlayingSportsTeam | Config | No | |
| `init(teamInitials:)` | CPNowPlayingSportsTeamLogo | Config | No | |
| `init(teamLogo:)` | CPNowPlayingSportsTeamLogo | Config | No | |
| `initials` | CPNowPlayingSportsTeamLogo | Config | No | |
| `logo` | CPNowPlayingSportsTeamLogo | Config | No | |

### CPSportsOverlay (iOS 26.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(leftTeam:rightTeam:eventStatus:)` | CPSportsOverlay | Config | No | |
| `leftTeam` | CPSportsOverlay | Config | No | |
| `rightTeam` | CPSportsOverlay | Config | No | |
| `eventStatus` | CPSportsOverlay | Config | No | |

---

## 15. Voice Control Template

Visual feedback for voice-based services in navigation and voice-based conversational apps. Must be displayed while voice services are active. Supports action buttons (iOS 26.4+).

### CPVoiceControlTemplate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(voiceControlStates:)` | CPVoiceControlTemplate | Config | Yes | |
| `voiceControlStates` | CPVoiceControlTemplate | Config | Yes | |
| `activeStateIdentifier` | CPVoiceControlTemplate | Config | Yes | |
| `backButton` | CPVoiceControlTemplate | Config | Yes | |
| `leadingNavigationBarButtons` | CPVoiceControlTemplate | Config | Yes | |
| `trailingNavigationBarButtons` | CPVoiceControlTemplate | Config | Yes | |
| `activateVoiceControlState(withIdentifier:)` | CPVoiceControlTemplate | JS→Native | Yes | |

### CPVoiceControlState

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(identifier:titleVariants:image:repeats:)` | CPVoiceControlState | Config | Yes | |
| `identifier` | CPVoiceControlState | Config | Yes | |
| `titleVariants` | CPVoiceControlState | Config | Yes | |
| `image` | CPVoiceControlState | Config | Yes | |
| `repeats` | CPVoiceControlState | Config | Yes | |
| `actionButtons` | CPVoiceControlState | Config | Opt | |
| `maximumActionButtonCount` | CPVoiceControlState (static) | Config | Opt | |

---

## 16. Dashboard & Instrument Cluster

Secondary display surfaces for navigation apps. The Dashboard shows your map and up to 2 shortcut buttons when your app is not the foreground CarPlay app. The instrument cluster displays your map in the car's gauge area.

### CPTemplateApplicationDashboardScene (iOS 13.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `delegate` | CPTemplateApplicationDashboardScene | Config | Yes | |
| `dashboardController` | CPTemplateApplicationDashboardScene | Config | Yes | |
| `dashboardWindow` | CPTemplateApplicationDashboardScene | Config | Yes | |

### CPTemplateApplicationDashboardSceneDelegate (iOS 13.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `templateApplicationDashboardScene(_:didConnect:to:)` | CPTemplateApplicationDashboardSceneDelegate | Native→JS | Yes | |
| `templateApplicationDashboardScene(_:didDisconnect:from:)` | CPTemplateApplicationDashboardSceneDelegate | Native→JS | Yes | |

### CPDashboardController (iOS 13.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `shortcutButtons` | CPDashboardController | Config | Yes | |

### CPDashboardButton (iOS 13.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(titleVariants:subtitleVariants:image:handler:)` | CPDashboardButton | JS→Native | Yes | |
| `titleVariants` | CPDashboardButton | Config | Yes | |
| `subtitleVariants` | CPDashboardButton | Config | Yes | |
| `image` | CPDashboardButton | Config | Yes | |

### CPTemplateApplicationInstrumentClusterScene (iOS 15.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `delegate` | CPTemplateApplicationInstrumentClusterScene | Config | Yes | |
| `instrumentClusterController` | CPTemplateApplicationInstrumentClusterScene | Config | Yes | |
| `contentStyle` | CPTemplateApplicationInstrumentClusterScene | Config | Yes | |

### CPTemplateApplicationInstrumentClusterSceneDelegate (iOS 15.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `templateApplicationInstrumentClusterScene(_:didConnect:)` | CPTemplateApplicationInstrumentClusterSceneDelegate | Native→JS | Yes | |
| `templateApplicationInstrumentClusterScene(_:didDisconnectInstrumentClusterController:)` | CPTemplateApplicationInstrumentClusterSceneDelegate | Native→JS | Yes | |
| `contentStyleDidChange(_:)` | CPTemplateApplicationInstrumentClusterSceneDelegate | Native→JS | Yes | |

### CPInstrumentClusterController (iOS 15.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `delegate` | CPInstrumentClusterController | Config | Yes | |
| `instrumentClusterWindow` | CPInstrumentClusterController | Config | Yes | |
| `speedLimitSetting` | CPInstrumentClusterController | Config | Yes | |
| `compassSetting` | CPInstrumentClusterController | Config | Yes | |
| `inactiveDescriptionVariants` | CPInstrumentClusterController | Config | Yes | |
| `attributedInactiveDescriptionVariants` | CPInstrumentClusterController | Config | Opt | |

### CPInstrumentClusterControllerDelegate (iOS 15.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `instrumentClusterControllerDidConnect(_:)` | CPInstrumentClusterControllerDelegate | Native→JS | Yes | |
| `instrumentClusterControllerDidDisconnectWindow(_:)` | CPInstrumentClusterControllerDelegate | Native→JS | Yes | |
| `instrumentClusterController(_:didChangeCompassSetting:)` | CPInstrumentClusterControllerDelegate | Native→JS | Yes | |
| `instrumentClusterController(_:didChangeSpeedLimitSetting:)` | CPInstrumentClusterControllerDelegate | Native→JS | Yes | |
| `instrumentClusterControllerDidZoom(in:)` | CPInstrumentClusterControllerDelegate | Native→JS | Yes | |
| `instrumentClusterControllerDidZoomOut(_:)` | CPInstrumentClusterControllerDelegate | Native→JS | Yes | |

### CPInstrumentClusterSetting (Enum, iOS 15.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.unspecified` | CPInstrumentClusterSetting | Enum | Yes | |
| `.enabled` | CPInstrumentClusterSetting | Enum | Yes | |
| `.disabled` | CPInstrumentClusterSetting | Enum | Yes | |
| `.userPreference` | CPInstrumentClusterSetting | Enum | Yes | |

---

## 17. Multitouch (iOS 26+)

Vehicles supporting multitouch (including all CarPlay Ultra vehicles) send zoom, pitch, and rotate gestures to your navigation app's `CPMapTemplateDelegate`.

### CPMapTemplateDelegate — Zoom Gestures

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `mapTemplateDidBeginZoomGesture(_:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:didUpdateZoomGestureWithCenter:scale:velocity:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:didEndZoomGestureWithVelocity:)` | CPMapTemplateDelegate | Native→JS | Yes | |

### CPMapTemplateDelegate — Rotation Gestures

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `mapTemplateDidBeginRotationGesture(_:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:didRotateWithCenter:rotation:velocity:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:rotationDidEndWithVelocity:)` | CPMapTemplateDelegate | Native→JS | Yes | |

### CPMapTemplateDelegate — Pitch Gestures

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `mapTemplateDidBeginPitchGesture(_:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:pitchWithCenter:)` | CPMapTemplateDelegate | Native→JS | Yes | |
| `mapTemplate(_:pitchEndedWithCenter:)` | CPMapTemplateDelegate | Native→JS | Yes | |

---

## 18. Session Configuration

Reports vehicle properties to your app — whether the keyboard is available, whether lists are limited, and the current content style. Use `CPSessionConfiguration` with a delegate to observe changes.

### CPSessionConfiguration

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(delegate:)` | CPSessionConfiguration | Config | Yes | |
| `delegate` | CPSessionConfiguration | Config | Yes | |
| `contentStyle` | CPSessionConfiguration | Config | Yes | |
| `limitedUserInterfaces` | CPSessionConfiguration | Config | Yes | |
| `supportsVideoPlayback` | CPSessionConfiguration | Config | Opt | |

### CPSessionConfigurationDelegate

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `sessionConfiguration(_:contentStyleChanged:)` | CPSessionConfigurationDelegate | Native→JS | Yes | |
| `sessionConfiguration(_:limitedUserInterfacesChanged:)` | CPSessionConfigurationDelegate | Native→JS | Yes | |

### CPLimitableUserInterface (OptionSet)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.keyboard` | CPLimitableUserInterface | Enum | Yes | |
| `.lists` | CPLimitableUserInterface | Enum | Yes | |

---

## 19. Shared Types & Utilities

Types used across multiple feature areas.

### CPImageOverlay (iOS 26.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(image:alignment:)` | CPImageOverlay | Config | Opt | |
| `init(text:textColor:backgroundColor:alignment:)` | CPImageOverlay | Config | Opt | |
| `text` | CPImageOverlay | Config | Opt | |
| `textColor` | CPImageOverlay | Config | Opt | |
| `backgroundColor` | CPImageOverlay | Config | Opt | |
| `image` | CPImageOverlay | Config | Opt | |
| `alignment` | CPImageOverlay | Config | Opt | |

### CPImageOverlay.Alignment (Enum, iOS 26.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.center` | CPImageOverlay.Alignment | Enum | Opt | |
| `.leading` | CPImageOverlay.Alignment | Enum | Opt | |
| `.trailing` | CPImageOverlay.Alignment | Enum | Opt | |

### CPThumbnailImage (iOS 26.4+)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(image:)` | CPThumbnailImage | Config | Opt | |
| `init(image:imageOverlay:sportsOverlay:)` | CPThumbnailImage | Config | Opt | |
| `image` | CPThumbnailImage | Config | Opt | |
| `imageOverlay` | CPThumbnailImage | Config | Opt | |
| `sportsOverlay` | CPThumbnailImage | Config | Opt | |

### Message Types (Communication Apps)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `init(conversationIdentifier:text:leadingConfiguration:trailingConfiguration:detailText:trailingText:)` | CPMessageListItem | Config | No | |
| `init(fullName:phoneOrEmailAddress:leadingConfiguration:trailingConfiguration:detailText:trailingText:)` | CPMessageListItem | Config | No | |
| `conversationIdentifier` | CPMessageListItem | Config | No | |
| `phoneOrEmailAddress` | CPMessageListItem | Config | No | |
| `text` | CPMessageListItem | Config | No | |
| `detailText` | CPMessageListItem | Config | No | |
| `trailingText` | CPMessageListItem | Config | No | |
| `leadingConfiguration` | CPMessageListItem | Config | No | |
| `trailingConfiguration` | CPMessageListItem | Config | No | |
| `userInfo` | CPMessageListItem | Config | No | |
| `isEnabled` | CPMessageListItem | Config | No | |
| `leadingDetailTextImage` | CPMessageListItem | Config | No | |
| `init(leadingItem:leadingImage:unread:)` | CPMessageListItemLeadingConfiguration | Config | No | |
| `leadingItem` | CPMessageListItemLeadingConfiguration | Config | No | |
| `leadingImage` | CPMessageListItemLeadingConfiguration | Config | No | |
| `isUnread` | CPMessageListItemLeadingConfiguration | Config | No | |
| `init(trailingItem:trailingImage:)` | CPMessageListItemTrailingConfiguration | Config | No | |
| `trailingItem` | CPMessageListItemTrailingConfiguration | Config | No | |
| `trailingImage` | CPMessageListItemTrailingConfiguration | Config | No | |
| `init()` | CPMessageComposeBarButton | Config | No | |
| `init(image:)` | CPMessageComposeBarButton | Config | No | |
| `init(conversationIdentifier:unread:)` | CPMessageGridItemConfiguration | Config | No | |

### CPMessageLeadingItem (Enum)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.none` | CPMessageLeadingItem | Enum | No | |
| `.pin` | CPMessageLeadingItem | Enum | No | |
| `.star` | CPMessageLeadingItem | Enum | No | |

### CPMessageTrailingItem (Enum)

| Member | Parent Type | Kind | Nav? | Status |
|--------|-------------|------|------|--------|
| `.none` | CPMessageTrailingItem | Enum | No | |
| `.mute` | CPMessageTrailingItem | Enum | No | |

---

## 20. Integration Points (Adjacent Frameworks)

These are not part of the CarPlay framework (`import CarPlay`) but are required for a fully functional CarPlay app. They're already available through standard iOS APIs or other RN/Expo packages.

### AVAudioSession — Voice Prompts

Navigation apps must configure audio sessions correctly for voice prompts:

- **Category:** `AVAudioSession.Category.playback`
- **Mode:** `AVAudioSession.Mode.voicePrompt`
- **Options:** `.interruptSpokenAudioAndMixWithOthers`, `.duckOthers`
- **Lifecycle:** Call `setActive(true)` only when a prompt is ready; call `setActive(false)` immediately after.
- **Prompt style:** Check `promptStyle` before each prompt — returns `.none`, `.short`, or `.normal`.

### UNUserNotificationCenter — CarPlay Notifications

- Request authorization with `.carPlay` option: `UNAuthorizationOptions = [.badge, .sound, .alert, .carPlay]`
- Create notification categories with `.allowInCarPlay` option.
- Route guidance notifications are handled by the CarPlay framework, not `UserNotifications`.

### MapKit — Base Map View

- Navigation apps render their map in a `UIViewController` assigned to `CPWindow.rootViewController`.
- Use `MKMapView` or custom rendering for the base view, Dashboard, and instrument cluster.
- `CPPointOfInterest.location` uses `MKMapItem`.
- `CPTrip.origin` / `CPTrip.destination` use `MKMapItem`.
- `CPPointOfInterestTemplateDelegate.didChangeMapRegion` provides `MKCoordinateRegion`.

### SiriKit & CallKit

- Communication apps must support `INSendMessageIntent`, `INSearchForMessagesIntent`, `INSetMessageAttributeIntent`.
- VoIP apps must support CallKit and `INStartCallIntent`.
- `CPAssistantCellConfiguration` triggers SiriKit intents (`.playMedia`, `.startCall`).
- `CPContactMessageButton` activates Siri compose flow.

### WidgetKit — CarPlay Widgets

- Support `.systemSmall` widget family for CarPlay.
- Use `.disfavoredLocations([.carPlay])` if widget isn't suitable for driving.
- Use `widgetURL` / `Link` to launch your CarPlay app from a widget.

### UIScene — Scene Lifecycle

- CarPlay apps must adopt `UIScene`-based lifecycle.
- Declare scenes in `UIApplicationSceneManifest` in `Info.plist`.
- Navigation apps declare 4 scene roles: device, CarPlay main, Dashboard, and instrument cluster.
- Use `CPTemplateApplicationScene.open(_:options:completionHandler:)` to launch other apps on the CarPlay screen.

### Data Protection

- Files with `NSFileProtectionComplete` or `NSFileProtectionCompleteUnlessOpen` are inaccessible while iPhone is locked.
- Keychain items with `kSecAttrAccessibleWhenUnlocked` are inaccessible while locked.
- CarPlay is frequently used with a locked iPhone — test accordingly.

// NavigationHandler.swift
// Manages CPNavigationSession lifecycle — start, stop, update maneuvers and estimates.
// Stores references to the active session and trip for estimate updates.
// See: docs/carplay-api-surface.md §3 — Navigation Session & Route Guidance

import CarPlay

final class NavigationHandler {
    static let shared = NavigationHandler()

    private var currentSession: CPNavigationSession?
    private var currentTrip: CPTrip?

    private init() {}

    // MARK: - Session Lifecycle

    func startNavigation(tripConfig: [String: Any]) -> String? {
        guard let trip = TripBuilder.build(from: tripConfig) else { return nil }

        // Get the root map template from the template store
        guard let mapTemplate = findMapTemplate() else { return nil }

        // Must dispatch to main thread — CPMapTemplate operations are UIKit
        var sessionId: String?
        DispatchQueue.main.sync {
            let session = mapTemplate.startNavigationSession(for: trip)
            session.pauseTrip(for: .loading, description: "Loading route...")
            self.currentSession = session
            self.currentTrip = trip
            sessionId = UUID().uuidString
        }
        return sessionId
    }

    func stopNavigation() {
        DispatchQueue.main.async { [self] in
            currentSession?.finishTrip()
            currentSession = nil
            currentTrip = nil
        }
    }

    // MARK: - Maneuver Updates

    func updateManeuvers(configs: [[String: Any]]) {
        let maneuvers = ManeuverBuilder.buildArray(from: configs)
        DispatchQueue.main.async { [self] in
            currentSession?.upcomingManeuvers = maneuvers
        }
    }

    // MARK: - Travel Estimate Updates

    func updateTravelEstimates(
        distanceRemaining: Double,
        timeRemaining: Double,
        maneuverIndex: Int?
    ) {
        let estimates = CPTravelEstimates(
            distanceRemaining: Measurement(value: distanceRemaining, unit: .meters),
            timeRemaining: timeRemaining
        )

        DispatchQueue.main.async { [self] in
            // Update per-maneuver estimate if index provided
            if let idx = maneuverIndex,
               let session = currentSession,
               idx < session.upcomingManeuvers.count {
                let maneuver = session.upcomingManeuvers[idx]
                session.updateEstimates(estimates, for: maneuver)
            }

            // Always update trip-level estimate
            if let trip = currentTrip, let mapTemplate = findMapTemplate() {
                mapTemplate.updateEstimates(estimates, for: trip)
            }
        }
    }

    // MARK: - Helpers

    private func findMapTemplate() -> CPMapTemplate? {
        guard let interfaceController = SceneSessionManager.shared.interfaceController,
              let mapTemplate = interfaceController.rootTemplate as? CPMapTemplate
        else { return nil }
        return mapTemplate
    }
}

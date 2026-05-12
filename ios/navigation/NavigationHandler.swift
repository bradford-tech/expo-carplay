// NavigationHandler.swift
// Manages CPNavigationSession lifecycle — start, stop, update maneuvers and estimates.
// Stores references to the active session and trip for estimate updates.
// See: docs/carplay-api-surface.md §3 — Navigation Session & Route Guidance

import CarPlay

final class NavigationHandler {
    static let shared = NavigationHandler()

    private var currentSession: CPNavigationSession?
    private var currentTrip: CPTrip?
    private(set) var previewedTrips: [CPTrip] = []

    private init() {}

    // MARK: - Session Lifecycle

    /// Threading convention for this file: `await MainActor.run` when the call
    /// needs to return a value to the awaiting AsyncFunction (as here);
    /// `DispatchQueue.main.async` for fire-and-forget updates.
    func startNavigation(tripConfig: [String: Any]) async -> String? {
        guard let trip = TripBuilder.build(from: tripConfig) else { return nil }

        return await MainActor.run { () -> String? in
            guard let mapTemplate = findMapTemplate() else { return nil }

            // End any existing session first — CPMapTemplate throws
            // clientTripAlreadyStartedException if a trip is already active.
            currentSession?.finishTrip()
            currentSession = nil
            currentTrip = nil

            let session = mapTemplate.startNavigationSession(for: trip)
            session.pauseTrip(for: .loading, description: "Loading route...")
            self.currentSession = session
            self.currentTrip = trip
            return UUID().uuidString
        }
    }

    func stopNavigation() {
        DispatchQueue.main.async { [self] in
            currentSession?.finishTrip()
            currentSession = nil
            currentTrip = nil
        }
    }

    // MARK: - Trip Previews

    func showTripPreviews(tripConfigs: [[String: Any]]) {
        let trips = tripConfigs.compactMap { TripBuilder.build(from: $0) }
        guard !trips.isEmpty, let mapTemplate = findMapTemplate() else { return }

        previewedTrips = trips

        DispatchQueue.main.async {
            mapTemplate.showTripPreviews(trips, textConfiguration: nil)
        }
    }

    func hideTripPreviews() {
        guard let mapTemplate = findMapTemplate() else { return }

        previewedTrips = []

        DispatchQueue.main.async {
            mapTemplate.hideTripPreviews()
        }
    }

    func tripIndex(for trip: CPTrip) -> Int? {
        previewedTrips.firstIndex(where: { $0 === trip })
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
            distanceRemaining: UnitConversion.localizedDistance(meters: distanceRemaining),
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

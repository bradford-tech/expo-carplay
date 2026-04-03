// TripBuilder.swift
// Constructs CPTrip and CPRouteChoice from JS config dictionaries.
// See: docs/carplay-api-surface.md §3 — CPTrip, CPRouteChoice

import CarPlay
import MapKit

enum TripBuilder {
    static func build(from config: [String: Any]) -> CPTrip? {
        guard let originDict = config["origin"] as? [String: Double],
              let destDict = config["destination"] as? [String: Double],
              let routeChoicesArray = config["routeChoices"] as? [[String: Any]]
        else { return nil }

        let originCoord = CLLocationCoordinate2D(
            latitude: originDict["latitude"] ?? 0,
            longitude: originDict["longitude"] ?? 0
        )
        let destCoord = CLLocationCoordinate2D(
            latitude: destDict["latitude"] ?? 0,
            longitude: destDict["longitude"] ?? 0
        )

        let originItem = MKMapItem(placemark: MKPlacemark(coordinate: originCoord))
        let destItem = MKMapItem(placemark: MKPlacemark(coordinate: destCoord))

        let routeChoices = routeChoicesArray.compactMap { choiceDict -> CPRouteChoice? in
            guard let summaryVariants = choiceDict["summaryVariants"] as? [String] else { return nil }
            let additionalInfo = choiceDict["additionalInformationVariants"] as? [String] ?? []
            return CPRouteChoice(
                summaryVariants: summaryVariants,
                additionalInformationVariants: additionalInfo,
                selectionSummaryVariants: summaryVariants
            )
        }

        guard !routeChoices.isEmpty else { return nil }

        return CPTrip(origin: originItem, destination: destItem, routeChoices: routeChoices)
    }
}

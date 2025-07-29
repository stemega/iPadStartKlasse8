import Foundation

/// Simple helper to persist small preferences locally.
struct LocalDataStore {
    private static let introKey = "hasSeenIntro"

    static func loadHasSeenIntro() -> Bool {
        UserDefaults.standard.bool(forKey: introKey)
    }

    static func save(hasSeenIntro: Bool) {
        UserDefaults.standard.set(hasSeenIntro, forKey: introKey)
    }
}

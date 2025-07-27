import Foundation

/// Provides access to audio files stored via the share extension.
struct EvidenceStore {
    /// Directory within the shared container where audio files are saved.
    private static var directory: URL? {
        FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: Constants.appGroupID)
    }

    /// Returns URLs of all audio files that have been imported.
    static func allAudioFiles() -> [URL] {
        guard let dir = directory else { return [] }
        return (try? FileManager.default.contentsOfDirectory(at: dir, includingPropertiesForKeys: nil)) ?? []
    }
}

import Foundation

enum EvidenceType: String, Codable {
    case text
    case photo
    case video
    case link
    case file
}

struct AppTask: Identifiable, Codable {
    var id: UUID
    var title: String
    var description: String
    var evidence: EvidenceType
}

extension AppTask {
    static var sampleTasks: [AppTask] {
        [
            AppTask(id: UUID(), title: "Essay schreiben", description: "Schreibe einen kurzen Aufsatz.", evidence: .text),
            AppTask(id: UUID(), title: "Foto hochladen", description: "Lade ein Foto deiner Arbeit hoch.", evidence: .photo),
            AppTask(id: UUID(), title: "Video aufnehmen", description: "Nimm ein kurzes Video auf.", evidence: .video),
            AppTask(id: UUID(), title: "Link teilen", description: "Füge einen nützlichen Link hinzu.", evidence: .link),
            AppTask(id: UUID(), title: "Datei abgeben", description: "Lade eine Datei hoch.", evidence: .file)
        ]
    }
}

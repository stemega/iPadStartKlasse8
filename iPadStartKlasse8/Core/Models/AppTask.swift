import Foundation

enum EvidenceType: String, Codable {
    case text
    case photo
    case video
    case link
    case file
    case audio
}

enum Subject: String, Codable, CaseIterable, Identifiable {
    case deutsch = "Deutsch"
    case mathematik = "Mathematik"
    case naturwissenschaften = "Naturwissenschaften"
    case fremdsprachen = "Fremdsprachen"
    case kunst = "Kunst"

    var id: String { rawValue }
}

struct AppTask: Identifiable, Codable, Equatable {
    var id: UUID
    var title: String
    var description: String
    var subject: Subject
    var evidence: EvidenceType
    var isCompleted: Bool = false
}

extension AppTask {
    static var sampleTasks: [AppTask] {
        [
            // Deutsch
            AppTask(id: UUID(), title: "Mebis-Kurs benutzt", description: "Einen Kurs in Mebis geöffnet und bearbeitet.", subject: .deutsch, evidence: .link),
            AppTask(id: UUID(), title: "Online-Übung gemacht", description: "Eine Online-Übung bearbeitet.", subject: .deutsch, evidence: .text),
            AppTask(id: UUID(), title: "Digitalen Jahrgangsstufentest auf Mebis bearbeitet", description: "Den Jahrgangsstufentest online gelöst.", subject: .deutsch, evidence: .file),

            // Mathematik
            AppTask(id: UUID(), title: "Grundlegende Fähigkeiten in GoodNotes", description: "Notizen in GoodNotes erstellt.", subject: .mathematik, evidence: .file),

            // Naturwissenschaften
            AppTask(id: UUID(), title: "Erklärvideo erstellen", description: "Ein Erklärvideo zu einem Thema aufnehmen.", subject: .naturwissenschaften, evidence: .video),

            // Fremdsprachen
            AppTask(id: UUID(), title: "Audioaufnahme anfertigen", description: "Einen kurzen Text aufnehmen.", subject: .fremdsprachen, evidence: .audio),

            // Kunst
            AppTask(id: UUID(), title: "Film erstellen", description: "Einen kurzen Film drehen.", subject: .kunst, evidence: .video)
        ]
    }
}

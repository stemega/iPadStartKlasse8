import Foundation

struct Student: Identifiable, Codable {
    var id: UUID
    var firstName: String
    var lastName: String
    var className: String
    var studentID: String
}

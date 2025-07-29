import Foundation

struct FAQItem: Identifiable, Codable {
    var id: UUID
    var question: String
    var answer: String
    var category: String
}

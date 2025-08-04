import Foundation

struct FAQItem: Identifiable, Codable {
    var id: String
    var question: String
    var answer: String
    var category: String
}

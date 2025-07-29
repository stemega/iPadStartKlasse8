import Foundation

struct FAQStore {
    static func loadFAQItems() -> [FAQItem] {
        guard let url = Bundle.main.url(forResource: "FAQItems", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let items = try? JSONDecoder().decode([FAQItem].self, from: data) else {
            return []
        }
        return items
    }
}

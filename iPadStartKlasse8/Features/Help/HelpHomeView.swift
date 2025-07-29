import SwiftUI

struct HelpHomeView: View {
    let items: [FAQItem]

    private var categories: [String] {
        Set(items.map { $0.category }).sorted()
    }

    var body: some View {
        NavigationStack {
            List {
                ForEach(categories, id: \.self) { category in
                    NavigationLink(category) {
                        FAQListView(title: category, items: items.filter { $0.category == category })
                    }
                }
            }
            .navigationTitle("Hilfe & FAQ")
        }
    }
}

#Preview {
    let items = FAQStore.loadFAQItems()
    return HelpHomeView(items: items)
}

import SwiftUI

struct FAQListView: View {
    var title: String
    var items: [FAQItem]
    @State private var searchText = ""

    private var filteredItems: [FAQItem] {
        if searchText.isEmpty { return items }
        return items.filter { $0.question.localizedCaseInsensitiveContains(searchText) }
    }

    var body: some View {
        List(filteredItems) { item in
            NavigationLink(item.question) {
                FAQDetailView(item: item)
            }
        }
        .navigationTitle(title)
        .searchable(text: $searchText)
    }
}

#Preview {
    let items = FAQStore.loadFAQItems()
    return FAQListView(title: "Vorschau", items: items)
}

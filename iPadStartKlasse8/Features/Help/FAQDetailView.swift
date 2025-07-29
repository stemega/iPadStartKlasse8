import SwiftUI

struct FAQDetailView: View {
    let item: FAQItem

    var body: some View {
        ScrollView {
            Text(item.answer)
                .padding()
        }
        .navigationTitle(item.question)
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    let items = FAQStore.loadFAQItems()
    return FAQDetailView(item: items.first!)
}

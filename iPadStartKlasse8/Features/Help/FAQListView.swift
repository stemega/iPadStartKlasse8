import SwiftUI

struct FAQListView: View {
    var title: String
    var items: [FAQItem]
    @State private var searchText = ""
    @Environment(\.dismiss) private var dismiss

    private var filteredItems: [FAQItem] {
        if searchText.isEmpty { 
            return items 
        }
        return items.filter { 
            $0.question.localizedCaseInsensitiveContains(searchText) ||
            $0.answer.localizedCaseInsensitiveContains(searchText)
        }
    }

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                // Search results header
                if !searchText.isEmpty {
                    HStack {
                        Text("\(filteredItems.count) Ergebnis\(filteredItems.count == 1 ? "" : "se")")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                        Spacer()
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 8)
                }
                
                // FAQ Items
                ForEach(filteredItems) { item in
                    NavigationLink {
                        FAQDetailView(item: item)
                    } label: {
                        FAQCard(
                            item: item,
                            searchText: searchText
                        )
                    }
                    .buttonStyle(PressableButtonStyle())
                }
                
                // Empty state
                if filteredItems.isEmpty && !searchText.isEmpty {
                    EmptySearchView(searchText: searchText)
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 20)
        }
        .background(
            LinearGradient(
                colors: [
                    Color(.systemBackground),
                    Color(.systemBlue).opacity(0.02)
                ],
                startPoint: .top,
                endPoint: .bottom
            )
        )
        .navigationTitle(title)
        .navigationBarTitleDisplayMode(.large)
        .searchable(
            text: $searchText,
            placement: .navigationBarDrawer(displayMode: .always),
            prompt: "Suche in \(title)..."
        )
        .navigationBarBackButtonHidden(false)
    }
}

struct FAQCard: View {
    let item: FAQItem
    let searchText: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Question
            Text(highlightedText(item.question, searchTerm: searchText))
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(.primary)
                .multilineTextAlignment(.leading)
                .fixedSize(horizontal: false, vertical: true)
            
            // Answer preview
            Text(answerPreview)
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.leading)
                .lineLimit(2)
            
            // Navigation indicator
            HStack {
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundColor(.blue.opacity(0.6))
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color(.secondarySystemBackground))
                .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.blue.opacity(0.1), lineWidth: 1)
        )
    }
    
    private var answerPreview: String {
        let cleanAnswer = item.answer
            .replacingOccurrences(of: "**", with: "")
            .replacingOccurrences(of: "\n", with: " ")
            .trimmingCharacters(in: .whitespacesAndNewlines)
        
        if cleanAnswer.count > 100 {
            return String(cleanAnswer.prefix(100)) + "..."
        }
        return cleanAnswer
    }
    
    private func highlightedText(_ text: String, searchTerm: String) -> AttributedString {
        var attributedString = AttributedString(text)
        
        if !searchTerm.isEmpty {
            let range = text.lowercased().range(of: searchTerm.lowercased())
            if let range = range {
                let nsRange = NSRange(range, in: text)
                if let attributedRange = Range(nsRange, in: attributedString) {
                    attributedString[attributedRange].foregroundColor = .blue
                    attributedString[attributedRange].font = .headline.weight(.bold)
                }
            }
        }
        
        return attributedString
    }
}

struct EmptySearchView: View {
    let searchText: String
    
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 48))
                .foregroundColor(.secondary.opacity(0.6))
            
            VStack(spacing: 8) {
                Text("Keine Ergebnisse für \"\(searchText)\"")
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(.primary)
                
                Text("Versuche es mit anderen Suchbegriffen oder durchsuche andere Kategorien.")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
            }
        }
        .padding(40)
        .frame(maxWidth: .infinity)
    }
}

#Preview {
    let items = FAQStore.loadFAQItems()
    return NavigationStack {
        FAQListView(title: "Vorschau", items: items)
    }
}

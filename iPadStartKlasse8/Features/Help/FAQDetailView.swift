import SwiftUI

struct FAQDetailView: View {
    let item: FAQItem
    @State private var isFavorited: Bool = false
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Question header
                VStack(alignment: .leading, spacing: 16) {
                    Text(item.question)
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.primary)
                        .fixedSize(horizontal: false, vertical: true)
                    
                    // Category badge
                    HStack {
                        Text(item.category)
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundColor(.blue)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color.blue.opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                        
                        Spacer()
                        
                        // Favorite button
                        Button(action: { isFavorited.toggle() }) {
                            Image(systemName: isFavorited ? "heart.fill" : "heart")
                                .font(.title3)
                                .foregroundColor(isFavorited ? .red : .secondary)
                        }
                    }
                }
                .padding(20)
                .background(
                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color(.secondarySystemBackground))
                        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
                )
                
                // Answer content
                VStack(alignment: .leading, spacing: 16) {
                    Text("Antwort")
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(.primary)
                    
                    FormattedAnswerView(answer: item.answer)
                }
                .padding(20)
                .background(
                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color(.tertiarySystemBackground))
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(Color.blue.opacity(0.1), lineWidth: 1)
                        )
                )
                
                // Quick actions
                VStack(spacing: 12) {
                    Text("Weitere Aktionen")
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(.primary)
                    
                    HStack(spacing: 12) {
                        QuickActionButton(
                            icon: "square.and.arrow.up",
                            title: "Teilen",
                            action: { shareContent() }
                        )
                        
                        QuickActionButton(
                            icon: "doc.on.doc",
                            title: "Kopieren",
                            action: { copyToClipboard() }
                        )
                        
                        Spacer()
                    }
                }
                .padding(20)
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 40)
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
        .navigationBarTitleDisplayMode(.inline)
    }
    
    private func shareContent() {
        let text = "\(item.question)\n\n\(item.answer)"
        let av = UIActivityViewController(activityItems: [text], applicationActivities: nil)
        
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let window = windowScene.windows.first {
            window.rootViewController?.present(av, animated: true)
        }
    }
    
    private func copyToClipboard() {
        UIPasteboard.general.string = "\(item.question)\n\n\(item.answer)"
    }
}

struct FormattedAnswerView: View {
    let answer: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            ForEach(formatAnswer(), id: \.id) { section in
                switch section.type {
                case .header:
                    Text(section.content)
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(.primary)
                        .padding(.top, section.id == formatAnswer().first?.id ? 0 : 8)
                    
                case .numberedList:
                    VStack(alignment: .leading, spacing: 8) {
                        ForEach(section.items, id: \.self) { item in
                            HStack(alignment: .top, spacing: 8) {
                                Text("•")
                                    .font(.subheadline)
                                    .fontWeight(.semibold)
                                    .foregroundColor(.blue)
                                
                                Text(item)
                                    .font(.subheadline)
                                    .foregroundColor(.primary)
                                    .fixedSize(horizontal: false, vertical: true)
                            }
                        }
                    }
                    .padding(.leading, 8)
                    
                case .paragraph:
                    Text(section.content)
                        .font(.subheadline)
                        .foregroundColor(.primary)
                        .fixedSize(horizontal: false, vertical: true)
                    
                case .important:
                    HStack(alignment: .top, spacing: 8) {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .font(.subheadline)
                            .foregroundColor(.orange)
                        
                        Text(section.content)
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .foregroundColor(.primary)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                    .padding(12)
                    .background(Color.orange.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    
                case .tip:
                    HStack(alignment: .top, spacing: 8) {
                        Image(systemName: "lightbulb.fill")
                            .font(.subheadline)
                            .foregroundColor(.yellow)
                        
                        Text(section.content)
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .foregroundColor(.primary)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                    .padding(12)
                    .background(Color.yellow.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                }
            }
        }
    }
    
    private func formatAnswer() -> [AnswerSection] {
        var sections: [AnswerSection] = []
        let lines = answer.components(separatedBy: .newlines)
        
        var currentItems: [String] = []
        var sectionId = 0
        
        for line in lines {
            let trimmed = line.trimmingCharacters(in: .whitespacesAndNewlines)
            
            if trimmed.isEmpty {
                continue
            }
            
            // Check for headers (text between **)
            if trimmed.hasPrefix("**") && trimmed.hasSuffix("**") {
                // Flush any current numbered list
                if !currentItems.isEmpty {
                    sections.append(AnswerSection(
                        id: sectionId,
                        type: .numberedList,
                        content: "",
                        items: currentItems
                    ))
                    currentItems = []
                    sectionId += 1
                }
                
                let headerText = trimmed.replacingOccurrences(of: "**", with: "")
                sections.append(AnswerSection(
                    id: sectionId,
                    type: .header,
                    content: headerText,
                    items: []
                ))
                sectionId += 1
            }
            // Check for numbered lists
            else if trimmed.range(of: "^\\d+\\.", options: .regularExpression) != nil {
                // Flush any current numbered list
                if !currentItems.isEmpty {
                    sections.append(AnswerSection(
                        id: sectionId,
                        type: .numberedList,
                        content: "",
                        items: currentItems
                    ))
                    currentItems = []
                    sectionId += 1
                }
                
                currentItems.append(trimmed)
            }
            // Check for important notes
            else if trimmed.lowercased().hasPrefix("wichtig") || trimmed.lowercased().hasPrefix("achtung") {
                // Flush any current numbered list
                if !currentItems.isEmpty {
                    sections.append(AnswerSection(
                        id: sectionId,
                        type: .numberedList,
                        content: "",
                        items: currentItems
                    ))
                    currentItems = []
                    sectionId += 1
                }
                
                sections.append(AnswerSection(
                    id: sectionId,
                    type: .important,
                    content: trimmed,
                    items: []
                ))
                sectionId += 1
            }
            // Check for tips
            else if trimmed.lowercased().hasPrefix("tipp") {
                // Flush any current numbered list
                if !currentItems.isEmpty {
                    sections.append(AnswerSection(
                        id: sectionId,
                        type: .numberedList,
                        content: "",
                        items: currentItems
                    ))
                    currentItems = []
                    sectionId += 1
                }
                
                sections.append(AnswerSection(
                    id: sectionId,
                    type: .tip,
                    content: trimmed,
                    items: []
                ))
                sectionId += 1
            }
            // Regular paragraph
            else {
                // Flush any current numbered list
                if !currentItems.isEmpty {
                    sections.append(AnswerSection(
                        id: sectionId,
                        type: .numberedList,
                        content: "",
                        items: currentItems
                    ))
                    currentItems = []
                    sectionId += 1
                }
                
                sections.append(AnswerSection(
                    id: sectionId,
                    type: .paragraph,
                    content: trimmed,
                    items: []
                ))
                sectionId += 1
            }
        }
        
        // Flush any remaining items
        if !currentItems.isEmpty {
            sections.append(AnswerSection(
                id: sectionId,
                type: .numberedList,
                content: "",
                items: currentItems
            ))
        }
        
        return sections
    }
}

struct AnswerSection {
    let id: Int
    let type: AnswerSectionType
    let content: String
    let items: [String]
}

enum AnswerSectionType {
    case header
    case numberedList
    case paragraph
    case important
    case tip
}

struct QuickActionButton: View {
    let icon: String
    let title: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.subheadline)
                
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
            }
            .foregroundColor(.blue)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(Color.blue.opacity(0.1))
            .clipShape(RoundedRectangle(cornerRadius: 8))
        }
    }
}

#Preview {
    let items = FAQStore.loadFAQItems()
    return NavigationStack {
        FAQDetailView(item: items.first!)
    }
}

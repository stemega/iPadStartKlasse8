import SwiftUI

struct HelpHomeView: View {
    let items: [FAQItem]

    /// Static list of available categories with their icons and descriptions.
    ///
    /// Using a predefined list ensures that the home screen always shows
    /// navigation options, even if the FAQ data fails to load or is empty.
    private let categoriesWithIcons: [(String, String, String)] = [
        ("Erste Schritte", "play.circle.fill", "Grundlagen für den Start"),
        ("Apps & Tools", "square.grid.2x2.fill", "Wichtige Apps und Werkzeuge"),
        ("Troubleshooting", "wrench.and.screwdriver.fill", "Probleme lösen"),
        ("Dateien & Organisation", "folder.fill", "Ordnung in deinen Dateien"),
        ("Kommunikation & Zusammenarbeit", "person.2.fill", "Teamwork und Austausch"),
        ("Sicherheit & Verantwortung", "shield.fill", "Sicher und verantwortlich"),
        ("Tipps & Tricks", "lightbulb.fill", "Profi-Tipps für Fortgeschrittene"),
        ("Multimedia & Projekte", "video.circle.fill", "Kreative Projekte")
    ]

    var body: some View {
        NavigationStack {
            ZStack {
                Image("DashboardBackground")
                    .resizable()
                    .scaledToFill()
                    .blur(radius: 20)
                    .ignoresSafeArea()

                ScrollView {
                    LazyVStack(spacing: 16) {
                        // Header section
                        VStack(spacing: 12) {
                            Text("Wie kann ich dir helfen?")
                                .font(.system(size: 28, weight: .bold, design: .rounded))
                                .foregroundColor(.primary)
                                .multilineTextAlignment(.center)

                            Text("Finde schnell Antworten auf deine iPad-Fragen")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)
                        }
                        .padding(.horizontal, 20)
                        .padding(.top, 8)
                        .padding(.bottom, 12)

                        // Categories grid
                        LazyVGrid(
                            columns: [
                                GridItem(.flexible(), spacing: 12),
                                GridItem(.flexible(), spacing: 12)
                            ],
                            spacing: 16
                        ) {
                            ForEach(categoriesWithIcons, id: \.0) { category, icon, description in
                                NavigationLink {
                                    FAQListView(
                                        title: category,
                                        items: items.filter { $0.category == category }
                                    )
                                } label: {
                                    CategoryCard(
                                        title: category,
                                        icon: icon,
                                        description: description,
                                        itemCount: items.filter { $0.category == category }.count
                                    )
                                }
                                .buttonStyle(PlainButtonStyle())
                            }
                        }
                        .padding(.horizontal, 20)
                    }
                    .padding(.bottom, 20)
                }
                .background(
                    LinearGradient(
                        colors: [
                            Color(.systemBackground).opacity(0.8),
                            Color(.systemBlue).opacity(0.02)
                        ],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
            }
            .navigationTitle("iPad-Hilfe")
            .navigationBarTitleDisplayMode(.large)
        }
    }
}

struct CategoryCard: View {
    let title: String
    let icon: String
    let description: String
    let itemCount: Int
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(.blue)
                    .frame(width: 32, height: 32)
                
                Spacer()
                
                Text("\(itemCount)")
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.blue.opacity(0.8))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(.primary)
                    .multilineTextAlignment(.leading)
                    .lineLimit(2)
                
                Text(description)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.leading)
                    .lineLimit(2)
            }
            
            Spacer()
            
            // Visual indicator for navigation
            HStack {
                Spacer()
                Image(systemName: "arrow.right")
                    .font(.caption)
                    .foregroundColor(.blue.opacity(0.6))
            }
        }
        .padding(16)
        .frame(height: 140)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(.secondarySystemBackground))
                .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.blue.opacity(0.1), lineWidth: 1)
        )
    }
}

#Preview {
    let items = FAQStore.loadFAQItems()
    return HelpHomeView(items: items)
}

import SwiftUI

struct OnboardingView: View {
    var onContinue: () -> Void

    var body: some View {
        GeometryReader { geometry in
            VStack(spacing: 0) {
                // Header section with gradient background
                VStack(spacing: 24) {
                    Spacer()
                    
                    // App icon representation
                    ZStack {
                        Circle()
                            .fill(
                                LinearGradient(
                                    colors: [.blue, .indigo], 
                                    startPoint: .topLeading, 
                                    endPoint: .bottomTrailing
                                )
                            )
                            .frame(width: 120, height: 120)
                            .shadow(color: .blue.opacity(0.3), radius: 20, x: 0, y: 10)
                        
                        Image(systemName: "ipad.and.arrow.forward")
                            .font(.system(size: 50, weight: .light))
                            .foregroundColor(.white)
                    }
                    
                    VStack(spacing: 12) {
                        Text("Willkommen zur iPad-Hilfe")
                            .font(.system(size: 34, weight: .bold, design: .rounded))
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [.primary, .blue], 
                                    startPoint: .leading, 
                                    endPoint: .trailing
                                )
                            )
                            .multilineTextAlignment(.center)
                        
                        Text("Dein perfekter Begleiter für den Schulalltag")
                            .font(.title3)
                            .fontWeight(.medium)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                    }
                    
                    Spacer()
                }
                .frame(height: geometry.size.height * 0.6)
                .background(
                    LinearGradient(
                        colors: [
                            Color(.systemBackground),
                            Color(.systemBlue).opacity(0.03)
                        ],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                
                // Features section
                VStack(spacing: 24) {
                    VStack(spacing: 20) {
                        FeatureRow(
                            icon: "questionmark.circle.fill",
                            title: "Umfassende FAQ",
                            description: "Antworten auf alle wichtigen iPad-Fragen"
                        )
                        
                        FeatureRow(
                            icon: "magnifyingglass",
                            title: "Clevere Suche",
                            description: "Finde schnell die richtige Hilfe"
                        )
                        
                        FeatureRow(
                            icon: "graduationcap.fill",
                            title: "Schuloptimiert",
                            description: "Speziell für dein Gymnasium entwickelt"
                        )
                    }
                    .padding(.horizontal, 32)
                    
                    // CTA Button
                    Button(action: onContinue) {
                        HStack(spacing: 12) {
                            Text("Los geht's")
                                .font(.headline)
                                .fontWeight(.semibold)
                            
                            Image(systemName: "arrow.right")
                                .font(.headline)
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 56)
                        .background(
                            LinearGradient(
                                colors: [.blue, .indigo], 
                                startPoint: .leading, 
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(16)
                        .shadow(color: .blue.opacity(0.3), radius: 8, x: 0, y: 4)
                    }
                    .padding(.horizontal, 32)
                    .padding(.bottom, 40)
                }
                .frame(height: geometry.size.height * 0.4)
            }
        }
        .background(Color(.systemBackground))
    }
}

struct FeatureRow: View {
    let icon: String
    let title: String
    let description: String
    
    var body: some View {
        HStack(spacing: 16) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(.blue)
                .frame(width: 32, height: 32)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(.primary)
                
                Text(description)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
            
            Spacer()
        }
    }
}

#Preview {
    OnboardingView() {}
}

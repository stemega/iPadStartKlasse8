import SwiftUI

struct OnboardingView: View {
    var onContinue: () -> Void

    var body: some View {
        VStack(spacing: 20) {
            Text("Willkommen zur iPad-Hilfe")
                .font(.title)

            Text("Diese App unterstützt dich beim Einstieg in den Unterricht mit dem iPad.")
                .multilineTextAlignment(.center)
            Button("Los geht's") {
                onContinue()
            }
            .buttonStyle(.borderedProminent)
        }
        .padding()
    }
}

#Preview {
    OnboardingView() {}
}

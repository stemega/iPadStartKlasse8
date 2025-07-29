import SwiftUI

/// Root view that either shows onboarding or the help home.
struct ContentView: View {
    @State private var hasSeenIntro: Bool = LocalDataStore.loadHasSeenIntro()
    @State private var faqItems: [FAQItem] = FAQStore.loadFAQItems()

    var body: some View {
        if hasSeenIntro {
            HelpHomeView(items: faqItems)
        } else {
            OnboardingView {
                hasSeenIntro = true
                LocalDataStore.save(hasSeenIntro: true)
            }
        }
    }
}

#Preview {
    ContentView()
}

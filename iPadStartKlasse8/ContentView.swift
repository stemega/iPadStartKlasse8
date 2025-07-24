import SwiftUI

struct ContentView: View {
    @State private var student = Student(id: UUID(), firstName: "", lastName: "", className: "", studentID: "")
    @State private var isRegistered = false

    var body: some View {
        if isRegistered {
            DashboardView(student: student)
        } else {
            OnboardingView(student: $student) {
                isRegistered = true
            }
        }
    }
}

#Preview {
    ContentView()
}

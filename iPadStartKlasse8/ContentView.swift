import SwiftUI

struct ContentView: View {
    @State private var student = Student(id: UUID(), firstName: "", lastName: "", className: "", studentID: "")
    @State private var isRegistered = false
    @State private var tasks = AppTask.sampleTasks

    var body: some View {
        if isRegistered {
            DashboardView(student: student, tasks: $tasks)
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

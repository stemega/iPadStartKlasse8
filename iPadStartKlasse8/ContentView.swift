
import SwiftUI

/// Root view that either shows onboarding or the dashboard.
struct ContentView: View {
    @State private var student: Student = {
        LocalDataStore.shared.loadStudent() ??
            Student(id: UUID(), firstName: "", lastName: "", className: "", studentID: "")
    }()
    @State private var isRegistered: Bool = LocalDataStore.shared.loadStudent() != nil
    @State private var tasks: [AppTask] = {
        let stored = LocalDataStore.shared.loadTasks()
        return stored.isEmpty ? AppTask.sampleTasks : stored
    }()

    var body: some View {
        if isRegistered {
            DashboardView(student: student, tasks: $tasks)
                .onChange(of: tasks) { newValue in
                    LocalDataStore.shared.save(tasks: newValue)
                }
        } else {
            OnboardingView(student: $student) {
                isRegistered = true
                LocalDataStore.shared.save(student: student)
                LocalDataStore.shared.save(tasks: tasks)
            }
        }

    }
}
 
 #Preview {
     ContentView()
 }


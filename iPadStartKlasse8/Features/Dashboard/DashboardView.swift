import SwiftUI

// Simple dashboard displaying a welcome message and link to tasks
struct DashboardView: View {
    var student: Student

    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Text("Willkommen, \(student.firstName)!")
                    .font(.title)
                ProgressView(value: 0.2)
                    .progressViewStyle(.linear)
                Text("Hier werden deine Aufgaben angezeigt.")
                NavigationLink("Zu deinen Aufgaben") {
                    TaskListView(tasks: AppTask.sampleTasks)
                }
            }
            .padding()
            .navigationTitle("Dashboard")
        }
    }
}

#Preview {
    DashboardView(student: Student(id: UUID(), firstName: "Max", lastName: "Muster", className: "8A", studentID: "1234"))
}

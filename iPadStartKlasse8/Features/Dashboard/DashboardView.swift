import SwiftUI

// Simple dashboard displaying a welcome message and link to tasks
struct DashboardView: View {
    var student: Student
    @Binding var tasks: [AppTask]

    private var progress: Double {
        guard !tasks.isEmpty else { return 0 }
        let completed = tasks.filter { $0.isCompleted }.count
        return Double(completed) / Double(tasks.count)
    }

    private func binding(for task: AppTask) -> Binding<AppTask> {
        guard let index = tasks.firstIndex(where: { $0.id == task.id }) else {
            fatalError("Task not found")
        }
        return $tasks[index]
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Text("Willkommen, \(student.firstName)!")
                    .font(.title)
                ProgressView(value: progress)
                    .progressViewStyle(.circular)
                    .frame(width: 60)
                if let nextTask = tasks.first(where: { !$0.isCompleted }) {
                    NavigationLink("Weiter mit \(nextTask.title)") {
                        TaskDetailView(task: binding(for: nextTask))
                    }
                }
                NavigationLink("Zu deinen Aufgaben") {
                    TaskListView(tasks: $tasks)
                }
            }
            .padding()
            .navigationTitle("Dashboard")
        }
    }
}

#Preview {
    @Previewable @State var sampleTasks = AppTask.sampleTasks
    return DashboardView(student: Student(id: UUID(), firstName: "Max", lastName: "Muster", className: "8A", studentID: "1234"), tasks: $sampleTasks)
}

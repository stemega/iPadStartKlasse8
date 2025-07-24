import SwiftUI

/// Displays a simple list of demo tasks with detail view

struct TaskListView: View {
    var tasks: [AppTask]

    var body: some View {
        List(tasks) { task in
            NavigationLink(destination: TaskDetailView(task: task)) {
                Text(task.title)
            }
        }
        .navigationTitle("Aufgaben")
    }
}

struct TaskDetailView: View {
    var task: AppTask

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text(task.description)
            Text("Nachweis: \(task.evidence.rawValue)")
        }
        .padding()
        .navigationTitle(task.title)
    }
}

#Preview {
    NavigationStack {
        TaskListView(tasks: AppTask.sampleTasks)
    }
}

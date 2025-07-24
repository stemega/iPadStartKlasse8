import SwiftUI

/// Displays a simple list of demo tasks with detail view

struct TaskListView: View {
    @Binding var tasks: [AppTask]

    var body: some View {
        List {
            ForEach($tasks) { $task in
                NavigationLink(destination: TaskDetailView(task: $task)) {
                    HStack {
                        Image(systemName: task.isCompleted ? "checkmark.circle.fill" : "circle")
                        Text(task.title)
                    }
                }
            }
        }
        .navigationTitle("Aufgaben")
    }
}

struct TaskDetailView: View {
    @Binding var task: AppTask

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text(task.description)
            Text("Nachweis: \(task.evidence.rawValue)")
            Toggle("Erledigt", isOn: $task.isCompleted)
        }
        .padding()
        .navigationTitle(task.title)
    }
}

#Preview {
    @Previewable @State var demoTasks = AppTask.sampleTasks
    return NavigationStack {
        TaskListView(tasks: $demoTasks)
    }
}

import SwiftUI

/// Displays a simple list of demo tasks with detail view

struct TaskListView: View {
    @Binding var tasks: [AppTask]
    @State private var selectedTaskID: AppTask.ID?

    var body: some View {
        NavigationSplitView {
            List(selection: $selectedTaskID) {
                ForEach(Subject.allCases) { subject in
                    let indices = tasks.indices.filter { tasks[$0].subject == subject }
                    if !indices.isEmpty {
                        Section(subject.rawValue) {
                            ForEach(indices, id: \.self) { index in
                                let task = tasks[index]
                                HStack {
                                    Image(systemName: task.isCompleted ? "checkmark.circle.fill" : "circle")
                                    Text(task.title)
                                }
                                .tag(task.id)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Aufgaben")
        } detail: {
            if let selectedID = selectedTaskID,
               let index = tasks.firstIndex(where: { $0.id == selectedID }) {
                TaskDetailView(task: $tasks[index])
            } else {
                Text("Wähle eine Aufgabe")
                    .foregroundStyle(.secondary)
            }
        }
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
    return TaskListView(tasks: $demoTasks)
}

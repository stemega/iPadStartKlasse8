import Foundation

/// Simple helper to persist student and task data locally as JSON files.
struct LocalDataStore {
    static let shared = LocalDataStore()

    private let studentURL: URL
    private let tasksURL: URL
    private let fileManager: FileManager

    init(fileManager: FileManager = .default) {
        self.fileManager = fileManager
        let documents = fileManager.urls(for: .documentDirectory, in: .userDomainMask)[0]
        studentURL = documents.appendingPathComponent("student.json")
        tasksURL = documents.appendingPathComponent("tasks.json")
    }

    // MARK: Student
    func loadStudent() -> Student? {
        guard let data = try? Data(contentsOf: studentURL) else { return nil }
        return try? JSONDecoder().decode(Student.self, from: data)
    }

    func save(student: Student) {
        do {
            let data = try JSONEncoder().encode(student)
            try data.write(to: studentURL, options: .atomic)
        } catch {
            print("Failed to save student: \(error)")
        }
    }

    // MARK: Tasks
    func loadTasks() -> [AppTask] {
        guard let data = try? Data(contentsOf: tasksURL) else { return [] }
        return (try? JSONDecoder().decode([AppTask].self, from: data)) ?? []
    }

    func save(tasks: [AppTask]) {
        do {
            let data = try JSONEncoder().encode(tasks)
            try data.write(to: tasksURL, options: .atomic)
        } catch {
            print("Failed to save tasks: \(error)")
        }
    }
}

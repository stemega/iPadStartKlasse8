import SwiftUI

struct OnboardingView: View {
    @Binding var student: Student
    var onContinue: () -> Void

    var body: some View {
        NavigationStack {
            Form {
                Section(header: Text("Persönliche Daten")) {
                    TextField("Vorname", text: $student.firstName)
                    TextField("Nachname", text: $student.lastName)
                    TextField("Klasse", text: $student.className)
                    TextField("ID", text: $student.studentID)
                }
                Button("Weiter") {
                    onContinue()
                }
                .disabled(student.firstName.isEmpty || student.lastName.isEmpty || student.className.isEmpty || student.studentID.isEmpty)
            }
            .navigationTitle("Registrierung")
        }
    }
}

#Preview {
    @State var student = Student(id: UUID(), firstName: "", lastName: "", className: "", studentID: "")
    return OnboardingView(student: $student) {}
}

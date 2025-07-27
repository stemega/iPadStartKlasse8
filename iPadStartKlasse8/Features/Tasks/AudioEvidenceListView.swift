import SwiftUI

/// Displays all audio files imported via the share extension.
struct AudioEvidenceListView: View {
    let files: [URL] = EvidenceStore.allAudioFiles()

    var body: some View {
        List(files, id: \.self) { url in
            Text(url.lastPathComponent)
        }
        .navigationTitle("Importierte Audios")
    }
}

#Preview {
    AudioEvidenceListView()
}

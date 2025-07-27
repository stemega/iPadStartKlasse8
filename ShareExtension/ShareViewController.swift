import UIKit
import UniformTypeIdentifiers

/// Minimal share extension to import audio files from Voice Memos.
class ShareViewController: UIViewController {
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        handleInput()
    }

    private func handleInput() {
        guard let item = extensionContext?.inputItems.first as? NSExtensionItem,
              let attachments = item.attachments else {
            complete()
            return
        }

        for provider in attachments {
            if provider.hasItemConformingToTypeIdentifier(UTType.audio.identifier) {
                provider.loadInPlaceFileRepresentation(forTypeIdentifier: UTType.audio.identifier) { url, inPlace, error in
                    if let url {
                        self.save(url: url)
                    }
                    self.complete()
                }
                return
            }
        }
        complete()
    }

    private func save(url: URL) {
        guard let container = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: Constants.appGroupID) else {
            return
        }
        let destination = container.appendingPathComponent(url.lastPathComponent)
        try? FileManager.default.copyItem(at: url, to: destination)
    }

    private func complete() {
        extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
    }
}

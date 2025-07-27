import SwiftUI
import WebKit

/// Displays an embedded YouTube tutorial for creating a video.
struct VideoCreationView: View {
    private let videoURL = URL(string: "https://www.youtube.com/embed/Ha9E9Zmthjw?si=zTEH0gPARYffhO0D")!

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Dieses YouTube-Video hilft dir weiter, falls du Fragen hast.")
                .font(.headline)
            WebView(url: videoURL)
        }
        .navigationTitle("Video erstellen")
        .navigationBarTitleDisplayMode(.inline)
    }
}

/// Simple WebView wrapper to display web content.
struct WebView: UIViewRepresentable {
    let url: URL

    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.scrollView.isScrollEnabled = false
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        uiView.load(URLRequest(url: url))
    }
}

#Preview {
    VideoCreationView()
}

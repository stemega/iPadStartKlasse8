import SwiftUI

/// A button style that slightly scales down the content when pressed
/// to provide responsive feedback.
struct PressableButtonStyle: ButtonStyle {
    var scaleAmount: CGFloat = 0.97
    var animation: Animation = .easeOut(duration: 0.15)

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? scaleAmount : 1.0)
            .animation(animation, value: configuration.isPressed)
    }
}

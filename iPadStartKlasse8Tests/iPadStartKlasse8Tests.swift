import Testing
@testable import iPadStartKlasse8

struct iPadStartKlasse8Tests {
    @Test func faqLoading() throws {
        let items = FAQStore.loadFAQItems()
        #expect(!items.isEmpty)
    }
}

# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Clear All Messages**: New button to clear entire chat history with confirmation dialog
- **Comprehensive Test Suite**: 17 unit tests covering all major functionality
  - Message sending and display
  - AI response generation
  - Dark mode toggle
  - Search functionality
  - Message deletion
  - Clear all messages
  - localStorage persistence
  - Error handling for corrupted data
  - UI state management (disabled buttons)
- **JSDoc Comments**: Complete documentation for all functions and components
- **Accessibility Improvements**:
  - ARIA labels on all interactive elements
  - Proper ARIA roles for chat messages (role="log")
  - ARIA live regions for screen reader announcements
  - Descriptive button labels
- **Error Handling**: Robust localStorage error handling
  - Graceful handling of JSON parse errors
  - QuotaExceededError detection and warnings
  - Automatic cleanup of corrupted data
  - Array validation for loaded data

### Changed
- Export and Clear buttons now properly disabled when no messages exist
- Send button now properly disabled when input is empty
- Improved user experience with confirmation dialog for destructive actions

### Security
- Input validation for localStorage data (array type checking)
- Safe handling of user-generated content

### Technical Improvements
- Better code documentation for maintainability
- Enhanced error resilience
- Improved testability with comprehensive test coverage

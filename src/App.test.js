import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders AI Chat Dashboard heading', () => {
    render(<App />);
    const headingElement = screen.getByText(/AI Chat Dashboard/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('renders empty state when no messages', () => {
    render(<App />);
    const emptyState = screen.getByText(/No messages yet. Start chatting!/i);
    expect(emptyState).toBeInTheDocument();
  });

  test('sends a message and displays it', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Type your message.../i);
    const sendButton = screen.getByText(/Send 🚀/i);

    fireEvent.change(input, { target: { value: 'Hello!' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });

  test('generates AI response after user message', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Type your message.../i);
    const sendButton = screen.getByText(/Send 🚀/i);

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Echo: Test message')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  test('does not send empty messages', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Type your message.../i);
    const sendButton = screen.getByText(/Send 🚀/i);

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(sendButton);

    const emptyState = screen.getByText(/No messages yet. Start chatting!/i);
    expect(emptyState).toBeInTheDocument();
  });

  test('toggles dark mode', () => {
    render(<App />);
    const modeToggle = screen.getByLabelText(/Switch to dark mode/i);

    const appDiv = document.querySelector('.app');
    expect(appDiv).not.toHaveClass('dark');

    fireEvent.click(modeToggle);
    expect(appDiv).toHaveClass('dark');
  });

  test('filters messages based on search term', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Type your message.../i);
    const sendButton = screen.getByText(/Send 🚀/i);

    // Send two messages
    fireEvent.change(input, { target: { value: 'First message' } });
    fireEvent.click(sendButton);
    fireEvent.change(input, { target: { value: 'Second message' } });
    fireEvent.click(sendButton);

    const searchInput = screen.getByPlaceholderText(/Search messages.../i);
    fireEvent.change(searchInput, { target: { value: 'First' } });

    expect(screen.getByText('First message')).toBeInTheDocument();
    expect(screen.queryByText('Second message')).not.toBeInTheDocument();
  });

  test('deletes a message', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Type your message.../i);
    const sendButton = screen.getByText(/Send 🚀/i);

    fireEvent.change(input, { target: { value: 'Delete me' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('Delete me')).toBeInTheDocument();

    const deleteButtons = screen.getAllByText('✕');
    fireEvent.click(deleteButtons[0]);

    expect(screen.queryByText('Delete me')).not.toBeInTheDocument();
  });

  test('clear all messages with confirmation', () => {
    window.confirm = jest.fn(() => true);
    render(<App />);
    const input = screen.getByPlaceholderText(/Type your message.../i);
    const sendButton = screen.getByText(/Send 🚀/i);

    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.click(sendButton);

    const clearButton = screen.getByLabelText(/Clear all messages/i);
    fireEvent.click(clearButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(screen.getByText(/No messages yet/i)).toBeInTheDocument();
  });

  test('persists messages to localStorage', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Type your message.../i);
    const sendButton = screen.getByText(/Send 🚀/i);

    fireEvent.change(input, { target: { value: 'Persist this' } });
    fireEvent.click(sendButton);

    const savedMessages = JSON.parse(localStorage.getItem('chat-messages'));
    expect(savedMessages).toHaveLength(1);
    expect(savedMessages[0].text).toBe('Persist this');
  });

  test('loads messages from localStorage on mount', () => {
    const mockMessages = [
      { id: 1, text: 'Saved message', timestamp: '12:00:00', sender: 'user' }
    ];
    localStorage.setItem('chat-messages', JSON.stringify(mockMessages));

    render(<App />);
    expect(screen.getByText('Saved message')).toBeInTheDocument();
  });

  test('handles corrupted localStorage data gracefully', () => {
    localStorage.setItem('chat-messages', 'invalid json');
    console.error = jest.fn();

    render(<App />);
    expect(console.error).toHaveBeenCalled();
    expect(screen.getByText(/No messages yet/i)).toBeInTheDocument();
  });

  test('disables send button when input is empty', () => {
    render(<App />);
    const sendButton = screen.getByLabelText(/Send message/i);
    expect(sendButton).toBeDisabled();
  });

  test('disables clear button when no messages', () => {
    render(<App />);
    const clearButton = screen.getByLabelText(/Clear all messages/i);
    expect(clearButton).toBeDisabled();
  });

  test('disables export button when no messages', () => {
    render(<App />);
    const exportButton = screen.getByLabelText(/Export chat history/i);
    expect(exportButton).toBeDisabled();
  });
});

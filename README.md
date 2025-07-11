# Cookie Monster 🍪

A simple web-based cookie parser that takes a cookie value string and displays the individual cookies as key-value pairs.

## Features

- ✨ Clean, modern interface
- 🔍 Parse cookie strings from browser developer tools
- 📋 Display cookies as organized key-value pairs
- 🛡️ Handle edge cases (cookies without values, special characters)
- 🎯 Example cookie string included for testing

## How to Use

1. Open `index.html` in your web browser
2. Paste a cookie string into the textarea (an example is pre-loaded)
3. Click "Parse Cookies" or press Ctrl/Cmd + Enter
4. View the parsed cookies displayed as key-value pairs

## Cookie String Format

The parser accepts standard HTTP cookie strings, such as:
```
sessionId=abc123; userId=456; theme=dark; preferences=json%3A%7B%22lang%22%3A%22en%22%7D
```

## Getting Cookie Strings

You can get cookie strings from your browser's developer tools:
1. Open Developer Tools (F12)
2. Go to Application/Storage tab
3. Click on Cookies in the sidebar
4. Copy the cookie values you want to parse

## Features Handled

- Multiple cookies separated by semicolons
- Cookies with and without values
- URL-encoded values
- Special characters in cookie names and values
- Whitespace trimming

## Files

- `index.html` - The complete web application (HTML, CSS, and JavaScript)

## Running Locally

Simply open the `index.html` file in any modern web browser. No server required!

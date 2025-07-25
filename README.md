# SVG Logo Editor

<p align="right">
  <a href="README.ru.md"><img src="https://img.shields.io/badge/Русский-red?style=for-the-badge&logo=github" alt="Русский"></a>
</p>

A modern, interactive web application for editing SVG logos with real-time color customization, theme support, and multiple export formats.

![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.0.4-purple)

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Color Schemes](#color-schemes)
- [Export Formats](#export-formats)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Features

✨ **Real-time Color Editing** - Modify logo colors instantly with intuitive color pickers
🎨 **Pre-built Color Schemes** - Choose from corporate, warm, cool, and nature themes
🌙 **Dark/Light Theme Support** - Seamless theme switching with system preference detection
📤 **Multiple Export Formats** - Export as SVG or JSON color schemes
📥 **Import/Export Color Schemes** - Save and share your custom color configurations
🎯 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
⚡ **Fast Performance** - Built with Vite and optimized React components
🔧 **TypeScript Support** - Full type safety and excellent developer experience

## Demo

Visit the live demo: [SVG Logo Editor](https://your-demo-url.com)

## Installation

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/svg-logo-editor.git
cd svg-logo-editor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Basic Usage

1. **Color Editing**: Use the color pickers to modify different parts of your logo:
   - Primary color
   - Secondary color
   - Accent color
   - Neutral color
   - Special elements
   - Gradient colors
   - Background color

2. **Theme Switching**: Click the theme toggle button to switch between light and dark modes

3. **Color Schemes**: Select from predefined color schemes:
   - **Default**: Balanced blue and gray tones
   - **Corporate**: Professional dark blue and teal
   - **Warm**: Energetic red and orange palette
   - **Cool**: Calming blue and purple combination
   - **Nature**: Fresh green and teal colors

### Advanced Features

#### Exporting Your Logo

1. Choose your export format:
   - **SVG**: Vector format for scalable graphics
   - **JSON**: Color scheme configuration for sharing

2. Optionally specify a custom filename
3. Click "Export" to download your file

#### Importing Color Schemes

1. Drag and drop a JSON color scheme file onto the import area
2. Or click "Choose File" to select a file manually
3. The colors will be automatically applied to your logo

## Color Schemes

The application includes several built-in color schemes:

| Scheme | Primary | Secondary | Use Case |
|--------|---------|-----------|----------|
| Default | #007bff | #6c757d | General purpose |
| Corporate | #2C3E50 | #3498DB | Business branding |
| Warm | #E74C3C | #F39C12 | Creative projects |
| Cool | #3498DB | #9B59B6 | Tech companies |
| Nature | #27AE60 | #16A085 | Environmental brands |

## Export Formats

### SVG Export
- Scalable vector graphics
- Perfect for web and print
- Maintains all color modifications
- Small file size

### JSON Export
- Color scheme configuration
- Shareable with other users
- Version controlled
- Includes metadata and timestamps

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── styles/             # CSS stylesheets
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # Application constants
└── assets/             # Static assets
```

### Technology Stack

- **React 19.1.0** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 7.0.4** - Build tool and dev server
- **CSS3** - Styling with CSS variables for theming
- **File-saver** - File download functionality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ using React and TypeScript**

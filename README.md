# 🎯 JokoUI

> *A lightweight, reactive vanilla JavaScript framework designed exclusively for [Prabogo Backend](https://github.com/prabogo)*

**JokoUI + Prabogo = Indonesia Emas 2045 Hijriah** 🇮🇩✨  
*Because why use React, Vue, or Angular when you can build your own framework and mass produce bugs domestically?*

> ⚠️ **DISCLAIMER**: No Ijazah required to use this framework. We don't check your diploma, your GPA, or whether your university is even accredited. Your code either works or it doesn't. Meritocracy at its finest.

---

## 🚀 Features

- ⚡ **Reactive State** - ES6 Proxy-based reactivity that actually works (most of the time)
- 🧩 **Class-based Components** - Because OOP never hurt anybody... right?
- 🔗 **PrabogoConnect** - Native HTTP client made with love for Prabogo backend
- 🎨 **Zero Dependencies** - Pure vanilla JS, no node_modules black hole
- 🪶 **Lightweight** - Smaller than your morning coffee order at Starbucks

---

## 📁 Project Structure

```
JokoUI/
├── src/
│   ├── core/
│   │   ├── joko-state.js       # Reactive state management
│   │   ├── joko-dom.js         # DOM rendering & mounting
│   │   └── prabogo-connect.js  # HTTP client for Prabogo
│   └── components/
│       └── App.js              # Demo component
├── index.html                  # Entry point
├── main.js                     # Bootstrap
└── style.css                   # Premium dark theme
```

---

## 🛠️ Quick Start

### 1. Clone and Serve

```bash
# Serve with Python
python -m http.server 8080

# Or with Node.js
npx serve .
```

### 2. Open in Browser

Navigate to `http://localhost:8080` and witness the glory.

---

## 📖 Usage

### Creating a Component

```javascript
import { JokoComponent } from './src/core/joko-state.js';

export class MyComponent extends JokoComponent {
    constructor() {
        super();
        this.setState({
            message: 'Hello from JokoUI!'
        });
    }

    onMount() {
        console.log('Component mounted!');
    }

    updateMessage() {
        this.state.message = 'State updated reactively!';
    }

    render() {
        return `
            <div>
                <h1>${this.state.message}</h1>
                <button data-joko-click="updateMessage">Click Me</button>
            </div>
        `;
    }
}
```

### Mounting a Component

```javascript
import { mount } from './src/core/joko-dom.js';
import { MyComponent } from './src/components/MyComponent.js';

const app = new MyComponent();
mount(app, 'app');
```

### Using PrabogoConnect

```javascript
import { PrabogoClient } from './src/core/prabogo-connect.js';

const api = new PrabogoClient({
    baseUrl: 'https://your-prabogo-backend.com/api'
});

// GET request
const users = await api.get('/users');

// POST request
const newUser = await api.post('/users', { name: 'Joko', role: 'UI' });
```

---

## 🎨 Event Binding

Use `data-joko-*` attributes for declarative event binding:

| Attribute | Event |
|-----------|-------|
| `data-joko-click` | `onclick` |
| `data-joko-input` | `oninput` |
| `data-joko-submit` | `onsubmit` |

---

## 🔄 Lifecycle Hooks

| Hook | Description |
|------|-------------|
| `onMount()` | Called after component is mounted to DOM |
| `onUpdate()` | Called after state change triggers re-render |
| `onUnmount()` | Called before component is removed |

---

## 🤝 Contributing

Found a bug? Feature request? Just want to say hi?  
Open an issue or PR. We're friendly (unless you suggest using jQuery).

---

## 📜 License

MIT License - Use it however you want.  
Just don't blame us when things break in production.

---

<p align="center">
  <i>Built with ☕ and questionable life choices</i><br>
  <b>JokoUI v1.0.0</b>
</p>

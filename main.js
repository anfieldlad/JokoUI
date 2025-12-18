/**
 * JokoUI Application Bootstrap
 * Entry point for the JokoUI Framework demo application
 * 
 * This framework is designed to work with Prabogo Backend (Go-based)
 * @see https://github.com/prabogo
 */

import { mount } from './src/core/joko-dom.js';
import { App } from './src/components/App.js';

// Initialize JokoUI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('╔═══════════════════════════════════════╗');
    console.log('║         🎯 JokoUI Framework           ║');
    console.log('║   Vanilla JS • Reactive • Lightweight ║');
    console.log('║   For Prabogo Backend (Go-based)      ║');
    console.log('╚═══════════════════════════════════════╝');

    // Create and mount the App component
    const app = new App();
    mount(app, 'app');

    // Expose app instance for debugging (optional)
    if (typeof window !== 'undefined') {
        window.__JOKO_APP__ = app;
    }
});

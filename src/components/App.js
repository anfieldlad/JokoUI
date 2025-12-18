/**
 * App Component - Demo application for JokoUI Framework
 * Demonstrates counter reactivity and Prabogo API integration
 */

import { JokoComponent } from '../core/joko-state.js';
import { prabogoClient } from '../core/prabogo-connect.js';

export class App extends JokoComponent {
    constructor() {
        super();

        // Initialize reactive state
        this.setState({
            count: 0,
            user: null,
            loading: false,
            error: null
        });
    }

    /**
     * Lifecycle hook - called when component mounts
     */
    onMount() {
        console.log('🚀 JokoUI App mounted successfully!');

        // Configure Prabogo client (demo URL)
        prabogoClient.setBaseUrl('https://jsonplaceholder.typicode.com');
    }

    /**
     * Increment counter
     */
    increment() {
        this.state.count = this.state.count + 1;
    }

    /**
     * Decrement counter
     */
    decrement() {
        this.state.count = this.state.count - 1;
    }

    /**
     * Reset counter
     */
    reset() {
        this.state.count = 0;
    }

    /**
     * Fetch user profile from Prabogo Backend (simulated)
     */
    async fetchUser() {
        this.state.loading = true;
        this.state.error = null;

        try {
            // Simulate API call to Prabogo backend
            // Using JSONPlaceholder as demo API
            const response = await prabogoClient.get('/users/1');

            this.state.user = response.data;
            this.state.loading = false;

        } catch (error) {
            console.error('Failed to fetch user:', error);
            this.state.error = error.message;
            this.state.loading = false;
        }
    }

    /**
     * Clear user data
     */
    clearUser() {
        this.state.user = null;
        this.state.error = null;
    }

    /**
     * Render the component
     * @returns {string} HTML template
     */
    render() {
        const { count, user, loading, error } = this.state;

        return `
            <div class="joko-app">
                <header class="app-header">
                    <div class="logo">
                        <span class="logo-icon">🎯</span>
                        <h1>JokoUI</h1>
                    </div>
                    <p class="tagline">A lightweight vanilla JS framework for Prabogo Backend</p>
                </header>
                
                <main class="app-content">
                    <!-- Counter Section -->
                    <section class="card counter-section">
                        <h2>⚡ Reactive Counter</h2>
                        <p class="description">Test the reactivity system using ES6 Proxy</p>
                        
                        <div class="counter-display">
                            <span class="count ${count < 0 ? 'negative' : count > 0 ? 'positive' : ''}">${count}</span>
                        </div>
                        
                        <div class="button-group">
                            <button class="btn btn-primary" data-joko-click="decrement">
                                <span>−</span> Decrease
                            </button>
                            <button class="btn btn-secondary" data-joko-click="reset">
                                <span>↺</span> Reset
                            </button>
                            <button class="btn btn-primary" data-joko-click="increment">
                                <span>+</span> Increase
                            </button>
                        </div>
                    </section>
                    
                    <!-- API Section -->
                    <section class="card api-section">
                        <h2>🌐 Prabogo API Demo</h2>
                        <p class="description">Test the PrabogoConnect HTTP client</p>
                        
                        <div class="button-group">
                            <button 
                                class="btn btn-accent" 
                                data-joko-click="fetchUser"
                                ${loading ? 'disabled' : ''}
                            >
                                ${loading ? '⏳ Loading...' : '📡 Fetch User Profile'}
                            </button>
                            ${user ? `
                                <button class="btn btn-secondary" data-joko-click="clearUser">
                                    🗑️ Clear
                                </button>
                            ` : ''}
                        </div>
                        
                        ${error ? `
                            <div class="error-message">
                                <span>❌</span> ${error}
                            </div>
                        ` : ''}
                        
                        ${user ? `
                            <div class="user-card">
                                <div class="user-avatar">
                                    ${user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div class="user-info">
                                    <h3>${user.name || 'Unknown'}</h3>
                                    <p class="user-email">📧 ${user.email || 'N/A'}</p>
                                    <p class="user-phone">📱 ${user.phone || 'N/A'}</p>
                                    <p class="user-company">🏢 ${user.company?.name || 'N/A'}</p>
                                    <p class="user-website">🌍 ${user.website || 'N/A'}</p>
                                </div>
                            </div>
                        ` : `
                            <div class="placeholder">
                                <span>👤</span>
                                <p>Click "Fetch User Profile" to load data from Prabogo Backend</p>
                            </div>
                        `}
                    </section>
                </main>
                
                <footer class="app-footer">
                    <p>Built with <span class="heart">❤️</span> using JokoUI Framework</p>
                    <p class="version">v1.0.0</p>
                </footer>
            </div>
        `;
    }
}

export default App;

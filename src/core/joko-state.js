/**
 * JokoUI State Management Module
 * Provides reactive state using ES6 Proxy
 */

/**
 * Creates a reactive state object that triggers updates on changes
 * @param {Object} initialState - The initial state object
 * @param {Function} onChangeCallback - Callback function to invoke when state changes
 * @returns {Proxy} A reactive proxy object
 */
export function createReactiveState(initialState, onChangeCallback) {
    const handler = {
        set(target, property, value) {
            const oldValue = target[property];
            
            // Only trigger update if value actually changed
            if (oldValue !== value) {
                target[property] = value;
                
                // Invoke callback with change details
                if (typeof onChangeCallback === 'function') {
                    onChangeCallback({
                        property,
                        oldValue,
                        newValue: value,
                        state: target
                    });
                }
            }
            
            return true;
        },
        
        get(target, property) {
            const value = target[property];
            
            // If the property is an object, make it reactive too (deep reactivity)
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                return createReactiveState(value, onChangeCallback);
            }
            
            return value;
        }
    };
    
    return new Proxy({ ...initialState }, handler);
}

/**
 * Base component class with reactive state
 * All JokoUI components should extend this class
 */
export class JokoComponent {
    constructor() {
        this._mounted = false;
        this._element = null;
        this._state = {};
        
        // Create reactive state with auto re-render on change
        this.state = createReactiveState(this._state, () => {
            if (this._mounted) {
                this._update();
            }
        });
    }
    
    /**
     * Initialize state with reactive proxy
     * @param {Object} initialState - Initial state values
     */
    setState(initialState) {
        this._state = { ...initialState };
        this.state = createReactiveState(this._state, () => {
            if (this._mounted) {
                this._update();
            }
        });
    }
    
    /**
     * Render method - must be implemented by child classes
     * @returns {string} HTML template literal
     */
    render() {
        throw new Error('Component must implement render() method');
    }
    
    /**
     * Lifecycle hook - called after component is mounted to DOM
     */
    onMount() {
        // Override in child class
    }
    
    /**
     * Lifecycle hook - called before component is unmounted
     */
    onUnmount() {
        // Override in child class
    }
    
    /**
     * Lifecycle hook - called after component updates
     */
    onUpdate() {
        // Override in child class
    }
    
    /**
     * Internal method to update the DOM
     * @private
     */
    _update() {
        if (this._element) {
            const newHtml = this.render();
            
            // Parse the new HTML
            const template = document.createElement('template');
            template.innerHTML = newHtml.trim();
            const newElement = template.content.firstChild;
            
            // Replace old element with new one
            this._element.replaceWith(newElement);
            this._element = newElement;
            
            // Re-bind events after update
            this._bindEvents();
            
            // Call lifecycle hook
            this.onUpdate();
        }
    }
    
    /**
     * Bind event handlers from data-joko-* attributes
     * @private
     */
    _bindEvents() {
        if (!this._element) return;
        
        // Find all elements with data-joko-click attribute
        const clickables = this._element.querySelectorAll('[data-joko-click]');
        clickables.forEach(el => {
            const methodName = el.getAttribute('data-joko-click');
            if (typeof this[methodName] === 'function') {
                el.onclick = (e) => this[methodName](e);
            }
        });
        
        // Find all elements with data-joko-input attribute
        const inputs = this._element.querySelectorAll('[data-joko-input]');
        inputs.forEach(el => {
            const methodName = el.getAttribute('data-joko-input');
            if (typeof this[methodName] === 'function') {
                el.oninput = (e) => this[methodName](e);
            }
        });
        
        // Find all elements with data-joko-submit attribute
        const forms = this._element.querySelectorAll('[data-joko-submit]');
        forms.forEach(el => {
            const methodName = el.getAttribute('data-joko-submit');
            if (typeof this[methodName] === 'function') {
                el.onsubmit = (e) => {
                    e.preventDefault();
                    this[methodName](e);
                };
            }
        });
    }
}

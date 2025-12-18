/**
 * JokoUI DOM Management Module
 * Handles rendering and mounting components to the DOM
 */

/**
 * Mount a JokoComponent to a target DOM element
 * @param {JokoComponent} component - The component instance to mount
 * @param {string} targetId - The ID of the target DOM element
 * @returns {JokoComponent} The mounted component instance
 */
export function mount(component, targetId) {
    const target = document.getElementById(targetId);

    if (!target) {
        throw new Error(`JokoUI: Target element with id "${targetId}" not found`);
    }

    // Render the component
    const html = component.render();

    // Parse HTML and create element
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    const element = template.content.firstChild;

    // Clear target and append new element
    target.innerHTML = '';
    target.appendChild(element);

    // Store reference to DOM element
    component._element = element;
    component._mounted = true;

    // Bind event handlers
    component._bindEvents();

    // Call lifecycle hook
    component.onMount();

    return component;
}

/**
 * Unmount a component from the DOM
 * @param {JokoComponent} component - The component instance to unmount
 */
export function unmount(component) {
    if (component._mounted && component._element) {
        // Call lifecycle hook
        component.onUnmount();

        // Remove from DOM
        component._element.remove();

        // Clean up references
        component._element = null;
        component._mounted = false;
    }
}

/**
 * Create a virtual element helper (for future virtual DOM implementation)
 * @param {string} tag - HTML tag name
 * @param {Object} props - Element properties/attributes
 * @param {Array} children - Child elements or text content
 * @returns {Object} Virtual element object
 */
export function createElement(tag, props = {}, ...children) {
    return {
        tag,
        props,
        children: children.flat()
    };
}

/**
 * Render a virtual element to HTML string (utility function)
 * @param {Object} vElement - Virtual element object
 * @returns {string} HTML string
 */
export function renderToString(vElement) {
    if (typeof vElement === 'string' || typeof vElement === 'number') {
        return String(vElement);
    }

    if (!vElement || !vElement.tag) {
        return '';
    }

    const { tag, props, children } = vElement;

    // Build attributes string
    const attrs = Object.entries(props || {})
        .map(([key, value]) => {
            if (key === 'className') {
                return `class="${value}"`;
            }
            if (typeof value === 'boolean') {
                return value ? key : '';
            }
            return `${key}="${value}"`;
        })
        .filter(Boolean)
        .join(' ');

    // Build children HTML
    const childrenHtml = (children || [])
        .map(child => renderToString(child))
        .join('');

    // Self-closing tags
    const selfClosing = ['img', 'input', 'br', 'hr', 'meta', 'link'];
    if (selfClosing.includes(tag)) {
        return `<${tag}${attrs ? ' ' + attrs : ''} />`;
    }

    return `<${tag}${attrs ? ' ' + attrs : ''}>${childrenHtml}</${tag}>`;
}

import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to an error reporting service
        console.error(error, errorInfo);
        // Set state to indicate that an error has occurred
        this.setState({ hasError: true }, () => {
            // Reload the page after 5 seconds
            setTimeout(() => {
                window.location.reload();
            }, 0);
        });
    }

    render() {
        if (this.state.hasError) {
            // You can render a fallback UI here
            return <div>Oops! Something went wrong. Reloading the page...</div>;
        }
        // Render children if there's no error
        return this.props.children;
    }
}

export default ErrorBoundary;

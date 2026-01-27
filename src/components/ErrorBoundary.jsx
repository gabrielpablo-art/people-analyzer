import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-8">
                    <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full border border-red-100">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
                        <p className="text-gray-600 mb-4">Please report this error to support:</p>
                        <pre className="bg-red-50 p-4 rounded-lg text-red-800 font-mono text-xs overflow-auto whitespace-pre-wrap">
                            {this.state.error && this.state.error.toString()}
                            {this.state.error && this.state.error.stack && `\n\n${this.state.error.stack}`}
                        </pre>
                        <button
                            onClick={() => {
                                localStorage.removeItem('currentUser');
                                window.location.reload();
                            }}
                            className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
                        >
                            Clear Session & Reload
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

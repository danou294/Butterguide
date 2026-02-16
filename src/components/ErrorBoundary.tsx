import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F1F0EB] flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm text-center">
            <h1 className="text-xl font-bold mb-2">Oups, une erreur est survenue</h1>
            <p className="text-gray-500 text-sm mb-6">
              Quelque chose s'est mal passé. Essaie de rafraîchir la page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white py-2.5 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

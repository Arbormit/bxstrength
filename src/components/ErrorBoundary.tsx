import React, { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Dumbbell } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  declare props: Readonly<Props>;

  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React UI Exception:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#111111] border border-gray-800 p-8 text-center shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#E52165]/20 text-[#E52165] flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="flex items-center justify-center gap-2">
              <Dumbbell className="w-5 h-5 text-[#E52165]" />
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                BxStrength
              </span>
            </div>

            <h1 className="text-2xl font-black uppercase text-white tracking-tight">
              APPLICATION RECOVERY ACTIVE
            </h1>

            <p className="text-xs text-gray-400 leading-relaxed">
              An unhandled interface state occurred. The platform state engine has contained the issue gracefully.
            </p>

            <button
              onClick={this.handleReload}
              className="w-full bg-[#E52165] hover:bg-[#c41551] text-white text-xs font-black tracking-widest py-3 uppercase shadow-md shadow-pink-500/20 flex items-center justify-center gap-2 transition-all mt-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RELOAD DASHBOARD SESSION</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

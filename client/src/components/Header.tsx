import { Wifi, WifiOff, Loader, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  serverStatus: 'online' | 'offline' | 'checking';
  user?: any;
  onLogin: () => void;
  onLogout: () => void;
}

export function Header({ serverStatus, user, onLogin, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const getStatusIcon = () => {
    switch (serverStatus) {
      case 'online':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      case 'checking':
        return <Loader className="w-4 h-4 text-yellow-500 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (serverStatus) {
      case 'online':
        return 'Server Online';
      case 'offline':
        return 'Server Offline';
      case 'checking':
        return 'Checking...';
    }
  };

  const getStatusColor = () => {
    switch (serverStatus) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'checking':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ChatPDF
              </h1>
              <p className="text-xs text-slate-500 -mt-1">AI-Powered</p>
            </div>
          </div>

          {/* Server Status and Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Server Status - Hidden on mobile */}
            <div className={`hidden sm:flex items-center space-x-2 px-3 py-2 rounded-full border text-sm font-medium ${getStatusColor()}`}>
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>
            
            {/* Mobile Server Status Icon Only */}
            <div className="sm:hidden">
              {getStatusIcon()}
            </div>
            
            {/* User Auth */}
            {user ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 bg-green-100 text-green-800 rounded-full border border-green-200">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 px-2 sm:px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Login</span>
              </button>
            )}
            
            {/* Version Badge - Hidden on mobile */}
            <div className="hidden sm:block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
              v1.0.0
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

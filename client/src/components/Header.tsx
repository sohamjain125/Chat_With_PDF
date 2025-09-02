import { Wifi, WifiOff, Loader } from 'lucide-react';

interface HeaderProps {
  serverStatus: 'online' | 'offline' | 'checking';
}

export function Header({ serverStatus }: HeaderProps) {
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
    <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chat with PDF
              </h1>
              <p className="text-sm text-gray-600">AI-powered document conversations</p>
            </div>
          </div>

          {/* Server Status */}
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-full border text-sm font-medium ${getStatusColor()}`}>
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>
            
            {/* Version Badge */}
            <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
              v1.0.0
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

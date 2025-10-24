import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/Auth/LoginForm';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { DashboardView } from '@/components/Dashboard/DashboardView';
import { UsersView } from '@/components/Users/UsersView';
import { TasksView } from '@/components/Tasks/TasksView';
import { SettingsView } from '@/components/Settings/SettingsView';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('#dashboard');

  useEffect(() => {
    const handleNavigation = (event: CustomEvent) => {
      setCurrentView(event.detail);
    };

    window.addEventListener('navigate', handleNavigation as EventListener);
    return () => window.removeEventListener('navigate', handleNavigation as EventListener);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderView = () => {
    switch (currentView) {
      case '#users':
        return <UsersView />;
      case '#tasks':
        return <TasksView />;
      case '#settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <DashboardLayout>
      {renderView()}
    </DashboardLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
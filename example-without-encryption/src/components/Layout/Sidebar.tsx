import React from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/utils/permissions';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Settings,
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  permission?: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '#dashboard' },
  { icon: Users, label: 'Users', href: '#users', permission: 'canViewAllUsers' },
  { icon: CheckSquare, label: 'Tasks', href: '#tasks' },
  { icon: Settings, label: 'Settings', href: '#settings' },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = React.useState('#dashboard');

  const handleNavigation = (href: string) => {
    setActiveTab(href);
    // Emit custom event for navigation
    window.dispatchEvent(new CustomEvent('navigate', { detail: href }));
  };

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
        {user && (
          <div className="mt-3">
            <p className="text-sm text-gray-600">{user.username}</p>
            <span className={cn(
              "inline-block px-2 py-1 text-xs font-medium rounded-full mt-1",
              user.role === 'admin' && "bg-red-100 text-red-800",
              user.role === 'manager' && "bg-blue-100 text-blue-800",
              user.role === 'user' && "bg-green-100 text-green-800"
            )}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const hasAccess = !item.permission || hasPermission(user, item.permission as any);
          
          if (!hasAccess) return null;

          return (
            <Button
              key={item.href}
              variant={activeTab === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-10",
                activeTab === item.href && "bg-gray-100"
              )}
              onClick={() => handleNavigation(item.href)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};
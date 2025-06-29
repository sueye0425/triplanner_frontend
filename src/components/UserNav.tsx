import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, ChevronDown } from 'lucide-react';

export function UserNav() {
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 transition-all duration-200"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center">
          {currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <span className="text-white text-sm font-medium">
              {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
            </span>
          )}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-gray-900">
            {currentUser.displayName || 'User'}
          </p>
          <p className="text-xs text-gray-500">
            {currentUser.email}
          </p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200/50 z-20">
            <div className="py-2">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/50 transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 
'use client';

import { Bell, Search, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/')}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              EC
            </div>
            <span className="text-xl font-bold hidden sm:inline-block">EagleConnect</span>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clubs..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => router.push('/clubs/create')}
                className="hidden sm:flex"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Club
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={() => router.push('/clubs/create')}
                className="sm:hidden"
              >
                <Plus className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>
            </>
          )}
          
          <ThemeSwitcher />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {user?.firstName} {user?.lastName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  My Clubs
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                {(user?.role === 'university_admin' || (user as any)?.role === 'admin' || (user as any)?.isAdmin) && (
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => router.push('/login')}>
                Login
              </Button>
              <Button onClick={() => router.push('/register')}>
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

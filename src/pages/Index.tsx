import { useState } from 'react';
import TodoList from '@/components/TodoList';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const Index = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen animated-bg ${isDark ? 'dark' : ''}`}>
      <div className="backdrop-blur-xl bg-background/80 min-h-screen">
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex-1"></div>
            <h1 className="text-4xl font-bold flex-1 text-center">Task Manager</h1>
            <div className="flex-1 flex justify-end">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDark ? (
                  <Sun className="h-6 w-6" />
                ) : (
                  <Moon className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
          <TodoList />
        </div>
      </div>
    </div>
  );
};

export default Index;
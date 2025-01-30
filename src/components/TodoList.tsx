import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Edit2Icon, TrashIcon, CheckIcon, XIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: Date;
  category: string;
}

const categories = [
  { name: 'Work', color: 'bg-blue-500' },
  { name: 'Personal', color: 'bg-green-500' },
  { name: 'Shopping', color: 'bg-yellow-500' },
  { name: 'Health', color: 'bg-red-500' },
];

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('12:00');
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addTodo = () => {
    if (!newTitle.trim()) return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      completed: false,
      dueDate: selectedDate ? combineDateAndTime(selectedDate, selectedTime) : undefined,
      category: selectedCategory,
    };

    setTodos([...todos, newTodo]);
    setNewTitle('');
    setNewDescription('');
    setSelectedDate(undefined);
    setSelectedTime('12:00');
  };

  const combineDateAndTime = (date: Date, time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    return newDate;
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setNewTitle(todo.title);
    setNewDescription(todo.description);
    setSelectedDate(todo.dueDate);
    setSelectedCategory(todo.category);
  };

  const saveEdit = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              title: newTitle,
              description: newDescription,
              dueDate: selectedDate ? combineDateAndTime(selectedDate, selectedTime) : undefined,
              category: selectedCategory,
            }
          : todo
      )
    );
    setEditingId(null);
    setNewTitle('');
    setNewDescription('');
    setSelectedDate(undefined);
    setSelectedTime('12:00');
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  };

  const getTimeRemaining = (dueDate?: Date) => {
    if (!dueDate) return '';
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Due soon';
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="space-y-4 mb-8">
        <Input
          placeholder="Task title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full"
        />
        <Textarea
          placeholder="Task description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="w-full"
        />
        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-[150px]"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-[240px] rounded-md border border-input bg-background px-3 py-2"
          >
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <Button onClick={addTodo} className="ml-auto">
            Add Task
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={cn(
                        "p-4 transition-all duration-200 hover:shadow-lg",
                        todo.completed && "opacity-60"
                      )}
                    >
                      {editingId === todo.id ? (
                        <div className="space-y-4">
                          <Input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                          />
                          <Textarea
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button onClick={() => saveEdit(todo.id)} size="sm">
                              <CheckIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => setEditingId(null)}
                              variant="outline"
                              size="sm"
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <h3 className={cn(
                              "text-lg font-semibold",
                              todo.completed && "line-through"
                            )}>
                              {todo.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {todo.description}
                            </p>
                            <div className="flex gap-2 mt-2">
                              {todo.dueDate && (
                                <Badge variant="secondary">
                                  {getTimeRemaining(todo.dueDate)}
                                </Badge>
                              )}
                              <Badge
                                className={cn(
                                  categories.find(c => c.name === todo.category)?.color,
                                  "text-white"
                                )}
                              >
                                {todo.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => startEditing(todo)}
                              variant="ghost"
                              size="sm"
                            >
                              <Edit2Icon className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => deleteTodo(todo.id)}
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TodoList;
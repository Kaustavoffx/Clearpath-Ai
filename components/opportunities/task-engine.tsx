'use client'

import React, { useState } from 'react'
import { CheckCircle2, Clock, MoreVertical, Edit3, Trash2, GripVertical, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { toggleTaskStatus, deleteTask } from '@/app/actions/task-actions'
import { toast } from 'sonner'

export function TaskEngine({ initialTasks }: { initialTasks: any[] }) {
  const [tasks, setTasks] = useState(() => {
    return [...initialTasks].sort((a, b) => a.step_number - b.step_number)
  });

  const toggleTaskCompletion = (index: number) => {
    const newTasks = [...tasks];
    const task = newTasks[index];
    const currentStatus = task.status;
    
    if (task.status === 'COMPLETED' || task.completion_percent === 100) {
      task.status = 'PENDING';
      task.completion_percent = 0;
    } else {
      task.status = 'COMPLETED';
      task.completion_percent = 100;
    }
    setTasks(newTasks);
    
    toast.promise(
      toggleTaskStatus(task.id, currentStatus),
      {
        loading: 'Updating task...',
        success: 'Task status saved',
        error: 'Failed to update task'
      }
    )
  };

  const handleDelete = (index: number) => {
    const task = tasks[index];
    if (confirm(`Delete task "${task.title}"?`)) {
      setTasks(prev => prev.filter((_, i) => i !== index));
      toast.promise(deleteTask(task.id), {
        loading: 'Deleting task...',
        success: 'Task deleted',
        error: 'Failed to delete task'
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    const p = (priority || 'medium').toLowerCase();
    if (p === 'high' || p === 'critical') return 'bg-danger/10 text-danger border-danger/20';
    if (p === 'low') return 'bg-glass-surface text-muted-foreground border-glass-border';
    return 'bg-warning/10 text-warning border-warning/20'; // Medium
  }

  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center border-2 border-dashed border-glass-border rounded-[32px] text-muted-foreground">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <h2 className="text-xl font-semibold mb-2">No Tasks Extracted</h2>
        <p>The AI could not identify any explicit action steps required for this opportunity.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Execution Plan</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-glass-surface text-foreground font-semibold">
            {tasks.filter(t => t.status === 'COMPLETED' || t.completion_percent === 100).length} / {tasks.length} Completed
          </Badge>
        </div>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task, index) => {
          const isCompleted = task.status === 'COMPLETED' || task.completion_percent === 100;

          return (
            <div 
              key={task.id || index}
              className={cn(
                "group flex items-start gap-4 p-5 rounded-[20px] border transition-all duration-300",
                isCompleted 
                  ? "bg-success/5 border-success/20 opacity-75" 
                  : "bg-glass-surface/50 border-glass-border hover:bg-glass-surface hover:shadow-glass-card"
              )}
            >
              <div className="pt-1 cursor-grab text-muted-foreground/30 hover:text-muted-foreground transition-colors">
                <GripVertical className="w-5 h-5" />
              </div>

              <button 
                onClick={() => toggleTaskCompletion(index)}
                className="pt-1 shrink-0 transition-transform hover:scale-110"
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-success" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-glass-border"></div>
                )}
              </button>
              
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className={cn(
                    "text-[16px] font-semibold leading-tight",
                    isCompleted ? "text-success line-through" : "text-foreground"
                  )}>
                    {task.title}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-[10px] uppercase font-bold tracking-widest", getPriorityColor(task.priority))}>
                      {task.priority || 'Medium'}
                    </Badge>
                    <button onClick={() => handleDelete(index)} className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all rounded-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {task.description && (
                  <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[85%]">
                    {task.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 mt-2">
                  {task.estimated_time_minutes > 0 && (
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground bg-glass-layer px-2.5 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5" />
                      {task.estimated_time_minutes} min
                    </div>
                  )}
                  {task.due_date && (
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-warning bg-warning/10 px-2.5 py-1 rounded-md">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  )}
                  {task.notes && (
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                      <Edit3 className="w-3.5 h-3.5" /> Has Notes
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

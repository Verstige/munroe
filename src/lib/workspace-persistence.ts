// Workspace Persistence Service
// Handles saving all user-created content to the database instead of localStorage

import { supabase } from './supabase';

// ============================================
// TYPES
// ============================================

export interface WorkspaceNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  visibility: 'public' | 'team' | 'private';
  author: string;
  projectId?: string;
  dueDate?: Date;
  reminderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  assigneeAvatar?: string;
  dueDate?: Date;
  startDate?: Date;
  tags: string[];
  projectId?: string;
  visibility: 'public' | 'team' | 'private';
  subtasks?: WorkspaceTask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  projectId?: string;
  suggestions?: any[];
  createdAt: Date;
}

export interface Mention {
  id: string;
  userId: string;
  mentionedBy: string;
  context: string;
  read: boolean;
  projectId?: string;
  createdAt: Date;
}

export interface TimeEntry {
  id: string;
  userId: string;
  projectId?: string;
  taskId?: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  durationMinutes: number;
  isRunning: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceLayout {
  id: string;
  userId: string;
  teamId: string;
  layoutType: 'project_map' | 'dashboard' | 'kanban' | 'calendar';
  layoutData: any;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityItem {
  id: string;
  type: 'project_created' | 'task_completed' | 'status_changed' | 'member_added' | 'comment_added' | 'deadline_approaching' | 'milestone_reached' | 'note_created' | 'note_updated';
  userId: string;
  userName: string;
  userAvatar?: string;
  projectId?: string;
  projectName?: string;
  description: string;
  metadata?: any;
  createdAt: Date;
}

// ============================================
// WORKSPACE NOTES SERVICE
// ============================================

export class WorkspaceNotesService {
  static async getNotes(teamId: string, projectId?: string): Promise<WorkspaceNote[]> {
    let query = supabase
      .from('workspace_notes')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data?.map(note => ({
      ...note,
      createdAt: new Date(note.created_at),
      updatedAt: new Date(note.updated_at),
      dueDate: note.due_date ? new Date(note.due_date) : undefined,
      reminderDate: note.reminder_date ? new Date(note.reminder_date) : undefined,
    })) || [];
  }

  static async createNote(note: Omit<WorkspaceNote, 'id' | 'createdAt' | 'updatedAt'>, teamId: string, userId: string): Promise<WorkspaceNote> {
    const { data, error } = await supabase
      .from('workspace_notes')
      .insert({
        title: note.title,
        content: note.content,
        tags: note.tags,
        visibility: note.visibility,
        author: note.author,
        project_id: note.projectId,
        due_date: note.dueDate?.toISOString(),
        reminder_date: note.reminderDate?.toISOString(),
        created_by: userId,
        team_id: teamId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      id: data.id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      dueDate: data.due_date ? new Date(data.due_date) : undefined,
      reminderDate: data.reminder_date ? new Date(data.reminder_date) : undefined,
    };
  }

  static async updateNote(id: string, updates: Partial<WorkspaceNote>): Promise<WorkspaceNote> {
    const { data, error } = await supabase
      .from('workspace_notes')
      .update({
        title: updates.title,
        content: updates.content,
        tags: updates.tags,
        visibility: updates.visibility,
        due_date: updates.dueDate?.toISOString(),
        reminder_date: updates.reminderDate?.toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      id: data.id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      dueDate: data.due_date ? new Date(data.due_date) : undefined,
      reminderDate: data.reminder_date ? new Date(data.reminder_date) : undefined,
    };
  }

  static async deleteNote(id: string): Promise<void> {
    const { error } = await supabase
      .from('workspace_notes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

// ============================================
// WORKSPACE TASKS SERVICE
// ============================================

export class WorkspaceTasksService {
  static async getTasks(teamId: string, projectId?: string): Promise<WorkspaceTask[]> {
    let query = supabase
      .from('workspace_tasks')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data?.map(task => ({
      ...task,
      id: task.id,
      createdAt: new Date(task.created_at),
      updatedAt: new Date(task.updated_at),
      dueDate: task.due_date ? new Date(task.due_date) : undefined,
      startDate: task.start_date ? new Date(task.start_date) : undefined,
      subtasks: task.subtasks || [],
    })) || [];
  }

  static async createTask(task: Omit<WorkspaceTask, 'id' | 'createdAt' | 'updatedAt'>, teamId: string, userId: string): Promise<WorkspaceTask> {
    const { data, error } = await supabase
      .from('workspace_tasks')
      .insert({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
        assignee_avatar: task.assigneeAvatar,
        due_date: task.dueDate?.toISOString(),
        start_date: task.startDate?.toISOString(),
        tags: task.tags,
        project_id: task.projectId,
        visibility: task.visibility,
        subtasks: task.subtasks || [],
        created_by: userId,
        team_id: teamId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      id: data.id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      dueDate: data.due_date ? new Date(data.due_date) : undefined,
      startDate: data.start_date ? new Date(data.start_date) : undefined,
      subtasks: data.subtasks || [],
    };
  }

  static async updateTask(id: string, updates: Partial<WorkspaceTask>): Promise<WorkspaceTask> {
    const { data, error } = await supabase
      .from('workspace_tasks')
      .update({
        title: updates.title,
        description: updates.description,
        status: updates.status,
        priority: updates.priority,
        assignee: updates.assignee,
        assignee_avatar: updates.assigneeAvatar,
        due_date: updates.dueDate?.toISOString(),
        start_date: updates.startDate?.toISOString(),
        tags: updates.tags,
        visibility: updates.visibility,
        subtasks: updates.subtasks,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      id: data.id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      dueDate: data.due_date ? new Date(data.due_date) : undefined,
      startDate: data.start_date ? new Date(data.start_date) : undefined,
      subtasks: data.subtasks || [],
    };
  }

  static async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('workspace_tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

// ============================================
// CHAT MESSAGES SERVICE
// ============================================

export class ChatMessagesService {
  static async getMessages(teamId: string, projectId?: string): Promise<ChatMessage[]> {
    let query = supabase
      .from('chat_messages')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: true });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data?.map(message => ({
      ...message,
      id: message.id,
      createdAt: new Date(message.created_at),
    })) || [];
  }

  static async createMessage(message: Omit<ChatMessage, 'id' | 'createdAt'>, teamId: string, userId: string): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        role: message.role,
        content: message.content,
        project_id: message.projectId,
        suggestions: message.suggestions || [],
        created_by: userId,
        team_id: teamId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      id: data.id,
      createdAt: new Date(data.created_at),
    };
  }
}

// ============================================
// MENTIONS SERVICE
// ============================================

export class MentionsService {
  static async getMentions(userId: string): Promise<Mention[]> {
    const { data, error } = await supabase
      .from('mentions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(mention => ({
      ...mention,
      id: mention.id,
      createdAt: new Date(mention.created_at),
    })) || [];
  }

  static async createMention(mention: Omit<Mention, 'id' | 'createdAt'>, teamId: string, mentionedBy: string): Promise<Mention> {
    const { data, error } = await supabase
      .from('mentions')
      .insert({
        user_id: mention.userId,
        mentioned_by: mentionedBy,
        context: mention.context,
        read: mention.read,
        project_id: mention.projectId,
        team_id: teamId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      id: data.id,
      createdAt: new Date(data.created_at),
    };
  }

  static async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('mentions')
      .update({ read: true })
      .eq('id', id);

    if (error) throw error;
  }
}

// ============================================
// TIME ENTRIES SERVICE
// ============================================

export class TimeEntriesService {
  static async getTimeEntries(userId: string, teamId: string): Promise<TimeEntry[]> {
    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(entry => ({
      ...entry,
      id: entry.id,
      startTime: new Date(entry.start_time),
      endTime: entry.end_time ? new Date(entry.end_time) : undefined,
      createdAt: new Date(entry.created_at),
      updatedAt: new Date(entry.updated_at),
    })) || [];
  }

  static async createTimeEntry(entry: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'>, teamId: string): Promise<TimeEntry> {
    const { data, error } = await supabase
      .from('time_entries')
      .insert({
        user_id: entry.userId,
        project_id: entry.projectId,
        task_id: entry.taskId,
        description: entry.description,
        start_time: entry.startTime.toISOString(),
        end_time: entry.endTime?.toISOString(),
        duration_minutes: entry.durationMinutes,
        is_running: entry.isRunning,
        team_id: teamId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      id: data.id,
      startTime: new Date(data.start_time),
      endTime: data.end_time ? new Date(data.end_time) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  static async updateTimeEntry(id: string, updates: Partial<TimeEntry>): Promise<TimeEntry> {
    const { data, error } = await supabase
      .from('time_entries')
      .update({
        description: updates.description,
        end_time: updates.endTime?.toISOString(),
        duration_minutes: updates.durationMinutes,
        is_running: updates.isRunning,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      id: data.id,
      startTime: new Date(data.start_time),
      endTime: data.end_time ? new Date(data.end_time) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}

// ============================================
// WORKSPACE LAYOUTS SERVICE
// ============================================

export class WorkspaceLayoutsService {
  static async getLayouts(userId: string, teamId: string): Promise<WorkspaceLayout[]> {
    const { data, error } = await supabase
      .from('workspace_layouts')
      .select('*')
      .eq('user_id', userId)
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(layout => ({
      ...layout,
      id: layout.id,
      createdAt: new Date(layout.created_at),
      updatedAt: new Date(layout.updated_at),
    })) || [];
  }

  static async saveLayout(layout: Omit<WorkspaceLayout, 'id' | 'createdAt' | 'updatedAt'>, teamId: string): Promise<WorkspaceLayout> {
    const { data, error } = await supabase
      .from('workspace_layouts')
      .insert({
        user_id: layout.userId,
        team_id: teamId,
        layout_type: layout.layoutType,
        layout_data: layout.layoutData,
        is_default: layout.isDefault,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      id: data.id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}

// ============================================
// ACTIVITY FEED SERVICE
// ============================================

export class ActivityFeedService {
  static async getActivity(teamId: string): Promise<ActivityItem[]> {
    const { data, error } = await supabase
      .from('activity_feed')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return data?.map(activity => ({
      ...activity,
      id: activity.id,
      createdAt: new Date(activity.created_at),
    })) || [];
  }

  static async createActivity(activity: Omit<ActivityItem, 'id' | 'createdAt'>, teamId: string): Promise<ActivityItem> {
    const { data, error } = await supabase
      .from('activity_feed')
      .insert({
        type: activity.type,
        user_id: activity.userId,
        user_name: activity.userName,
        user_avatar: activity.userAvatar,
        project_id: activity.projectId,
        project_name: activity.projectName,
        description: activity.description,
        metadata: activity.metadata || {},
        team_id: teamId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      id: data.id,
      createdAt: new Date(data.created_at),
    };
  }
}

// ============================================
// MIGRATION UTILITIES
// ============================================

export class MigrationService {
  static async migrateLocalStorageNotes(teamId: string, userId: string): Promise<void> {
    try {
      const savedNotes = localStorage.getItem('builtInNotes');
      if (savedNotes) {
        const notes = JSON.parse(savedNotes);
        for (const note of notes) {
          await WorkspaceNotesService.createNote({
            title: note.title,
            content: note.content,
            tags: note.tags || [],
            visibility: note.visibility || 'team',
            author: note.author || 'Migrated User',
            projectId: note.projectId,
            dueDate: note.dueDate ? new Date(note.dueDate) : undefined,
            reminderDate: note.reminderDate ? new Date(note.reminderDate) : undefined,
          }, teamId, userId);
        }
        localStorage.removeItem('builtInNotes');
      }
    } catch (error) {
      console.error('Error migrating notes:', error);
    }
  }

  static async migrateLocalStorageTasks(teamId: string, userId: string): Promise<void> {
    try {
      const savedTasks = localStorage.getItem('viewableTasks');
      if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        for (const task of tasks) {
          await WorkspaceTasksService.createTask({
            title: task.title,
            description: task.description,
            status: task.status || 'todo',
            priority: task.priority || 'medium',
            assignee: task.assignee || 'Unassigned',
            assigneeAvatar: task.assigneeAvatar,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            startDate: task.startDate ? new Date(task.startDate) : undefined,
            tags: task.tags || [],
            projectId: task.projectId,
            visibility: task.visibility || 'team',
            subtasks: task.subtasks || [],
          }, teamId, userId);
        }
        localStorage.removeItem('viewableTasks');
      }
    } catch (error) {
      console.error('Error migrating tasks:', error);
    }
  }

  static async migrateAllLocalStorageData(teamId: string, userId: string): Promise<void> {
    await this.migrateLocalStorageNotes(teamId, userId);
    await this.migrateLocalStorageTasks(teamId, userId);
  }
}

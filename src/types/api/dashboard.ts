export interface DashboardOverview {
  total_projects: number
  active_projects: number
  completed_projects: number
  total_tasks: number
  pending_tasks: number
  in_progress_tasks: number
  completed_tasks: number
  recent_activity: RecentActivity[]
}

export interface RecentActivity {
  _id: string
  type: 'project_created' | 'task_created' | 'task_updated' | 'member_added'
  description: string
  project_id?: string
  task_id?: string
  user_id: string
  createdAt: string
}

export interface RecentProject {
  _id: string
  name: string
  description?: string
  status: string
  priority: string
  last_activity: string
  member_count: number
}

export interface DashboardBreakdownItem {
  key: string
  label: string
  count: number
  percentage: number
}

export interface DashboardProjectSummary {
  project: {
    _id: string
    name: string
    visibility: string
  }
  range: {
    days: number
    since: string
    until: string
  }
  dueSoon: {
    days: number
    start: string
    end: string
  }
  totals: {
    tasks: number
  }
  stats: {
    created: number
    updated: number
    completed: number
    dueSoon: number
  }
  statusOverview: {
    total: number
    breakdown: DashboardBreakdownItem[]
  }
  priorityBreakdown: DashboardBreakdownItem[]
  typesOfWork: DashboardBreakdownItem[]
}

export interface DashboardWorkloadMember {
  user_id: string | null
  full_name: string
  email: string | null
  avatar_url: string | null
  department: string | null
  tasks: number
  percentage: number
}

export interface DashboardTeamWorkload {
  project: {
    _id: string
    name: string
  }
  totals: {
    tasks: number
    assignments: number
  }
  members: DashboardWorkloadMember[]
  unassigned: {
    tasks: number
    percentage: number
  }
}

export interface DashboardActivityLogUser {
  full_name?: string
  email?: string
  avatar_url?: string
  department?: string
  username?: string
}

export interface DashboardActivityLog {
  _id: string
  content: string
  logHistory?: string | null
  createdAt: string
  user?: DashboardActivityLogUser | null
}

export interface DashboardActivityFeed {
  project: {
    _id: string
    name: string
  }
  logs: DashboardActivityLog[]
}

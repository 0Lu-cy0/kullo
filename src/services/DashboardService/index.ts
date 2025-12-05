import http from '../index'
import type { ApiResponse } from '~/types/utils'
import URL_DASHBOARDS from './urls'
import type {
  DashboardOverview,
  RecentProject,
  DashboardProjectSummary,
  DashboardTeamWorkload,
  DashboardActivityFeed,
} from '~/types/api/dashboard'

const getOverview = (): Promise<ApiResponse<DashboardOverview>> =>
  http.get(URL_DASHBOARDS.API_DASHBOARDS_URL)

const getRecentProjects = (): Promise<ApiResponse<RecentProject[]>> =>
  http.get(URL_DASHBOARDS.API_DASHBOARD_RECENT_PROJECTS_URL)

const getProjectSummary = (
  projectId: string,
  params?: { rangeDays?: number; dueInDays?: number; typeLimit?: number }
): Promise<ApiResponse<DashboardProjectSummary>> =>
  http.get(URL_DASHBOARDS.API_DASHBOARD_PROJECT_SUMMARY_URL(projectId), { params })

const getProjectWorkload = (
  projectId: string,
  params?: { limit?: number }
): Promise<ApiResponse<DashboardTeamWorkload>> =>
  http.get(URL_DASHBOARDS.API_DASHBOARD_PROJECT_WORKLOAD_URL(projectId), { params })

const getProjectActivity = (
  projectId: string,
  params?: { limit?: number }
): Promise<ApiResponse<DashboardActivityFeed>> =>
  http.get(URL_DASHBOARDS.API_DASHBOARD_PROJECT_ACTIVITY_URL(projectId), { params })

export const DashboardService = {
  getOverview,
  getRecentProjects,
  getProjectSummary,
  getProjectWorkload,
  getProjectActivity,
}

const API_DASHBOARDS_URL = '/home/dashboards'
const API_DASHBOARD_RECENT_PROJECTS_URL = '/home/dashboards/projects/recent'
const API_DASHBOARD_PROJECT_SUMMARY_URL = (projectId: string) =>
  `/home/dashboards/projects/${projectId}/summary`
const API_DASHBOARD_PROJECT_WORKLOAD_URL = (projectId: string) =>
  `/home/dashboards/projects/${projectId}/workload`
const API_DASHBOARD_PROJECT_ACTIVITY_URL = (projectId: string) =>
  `/home/dashboards/projects/${projectId}/activity`

const URL_DASHBOARDS = {
  API_DASHBOARDS_URL,
  API_DASHBOARD_RECENT_PROJECTS_URL,
  API_DASHBOARD_PROJECT_SUMMARY_URL,
  API_DASHBOARD_PROJECT_WORKLOAD_URL,
  API_DASHBOARD_PROJECT_ACTIVITY_URL,
}
export default URL_DASHBOARDS

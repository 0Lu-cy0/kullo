import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { message, Spin } from 'antd'
import {
  Check,
  Edit2,
  CheckSquare,
  Calendar,
  User,
  Maximize2,
  Bookmark,
  Shapes,
  GitBranch,
  Zap,
  Plus,
  ChevronsUp,
  Minus,
  ChevronDown,
} from 'lucide-react'
import LayoutCommon from '~/components/Layouts/LayoutAdmin/LayoutCommon'
import styles from './style.module.scss'
import { DashboardService } from '~/services/DashboardService'
import type {
  DashboardProjectSummary,
  DashboardTeamWorkload,
  DashboardActivityFeed,
  DashboardBreakdownItem,
} from '~/types/api/dashboard'

const STATUS_COLORS: Record<string, string> = {
  todo: '#60a5fa',
  in_progress: '#f97316',
  testing: '#a855f7',
  completed: '#22c55e',
  default: '#94a3b8',
}

const STATUS_LABELS: Record<string, string> = {
  todo: 'Cần làm',
  in_progress: 'Đang thực hiện',
  testing: 'Đang kiểm thử',
  completed: 'Hoàn thành',
}

const PRIORITY_LABELS: Record<string, string> = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
}

const PRIORITY_COLORS: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#0ea5e9',
}

const TYPE_ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  task: CheckSquare,
  asset: Shapes,
  subtask: GitBranch,
  epic: Zap,
}

const LOG_TYPE_LABELS: Record<string, string> = {
  task_created: 'Tạo mới',
  task_updated: 'Cập nhật',
  task_deleted: 'Xóa bỏ',
  task_assigned: 'Giao việc',
  task_unassigned: 'Gỡ giao việc',
  task_status_changed: 'Trạng thái',
  default: 'Hoạt động',
}

const LOG_TYPE_ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  task_created: Plus,
  task_updated: Edit2,
  task_deleted: Minus,
  task_assigned: User,
  task_unassigned: User,
  task_status_changed: CheckSquare,
  default: Bookmark,
}

interface ActivityFeedItem {
  id: string
  userName: string
  content: string
  statusLabel: string
  relativeTime: string
  Icon: React.ComponentType<{ size?: number; className?: string }>
}

interface WorkloadRow {
  id: string
  name: string
  initials: string
  percentage: number
  tasks: number
  isUnassigned?: boolean
}

const ActivityItem = ({ item }: { item: ActivityFeedItem }) => (
  <div className={styles.activityItem}>
    <div className={styles.activityAvatar}>
      <div className={styles.avatarCircle}>
        <item.Icon size={12} />
      </div>
    </div>
    <div>
      <p>
        <span className={styles.userLink}>{item.userName}</span> {item.content}
        <span className={styles.statusBadge}>{item.statusLabel}</span>
      </p>
      <p className={styles.timeText}>{item.relativeTime}</p>
    </div>
  </div>
)

const StatCard = ({
  icon: Icon,
  value,
  subLabel,
}: {
  icon: any
  value: string
  subLabel: string
}) => (
  <div className={styles.statCard}>
    <div className={styles.statIcon}>
      <Icon size={16} />
    </div>
    <div className={styles.statContent}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{subLabel}</div>
    </div>
  </div>
)

const ProgressBar = ({
  label,
  icon: Icon,
  percent,
}: {
  label: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
  percent: number
}) => (
  <div className={styles.progressBar}>
    <div className={styles.progressLabel}>
      {Icon && <Icon size={14} className="mr-2" />}
      {label}
    </div>
    <div className={styles.progressBarContainer}>
      <div className={styles.progressTrack}>
        {percent > 0 ? (
          <div className={styles.progressFill} style={{ width: `${Math.min(percent, 100)}%` }}>
            {Math.round(percent)}%
          </div>
        ) : (
          <div className={styles.progressFill} style={{ width: '6%' }}>
            0%
          </div>
        )}
      </div>
    </div>
  </div>
)

const DEFAULT_STATS = {
  completed: 0,
  updated: 0,
  created: 0,
  dueSoon: 0,
}

const Summary = () => {
  const { id: projectId } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [summaryData, setSummaryData] = useState<DashboardProjectSummary | null>(null)
  const [workloadData, setWorkloadData] = useState<DashboardTeamWorkload | null>(null)
  const [activityData, setActivityData] = useState<DashboardActivityFeed | null>(null)

  useEffect(() => {
    if (!projectId) {
      message.warning('Không tìm thấy projectId để tải dashboard summary')
      return
    }

    const fetchDashboard = async () => {
      setIsLoading(true)
      try {
        const [summaryRes, workloadRes, activityRes] = await Promise.all([
          DashboardService.getProjectSummary(projectId, {
            rangeDays: 7,
            dueInDays: 7,
            typeLimit: 4,
          }),
          DashboardService.getProjectWorkload(projectId, { limit: 8 }),
          DashboardService.getProjectActivity(projectId, { limit: 20 }),
        ])

        if (summaryRes?.isOk) setSummaryData(summaryRes.data)
        if (workloadRes?.isOk) setWorkloadData(workloadRes.data)
        if (activityRes?.isOk) setActivityData(activityRes.data)
      } catch (error) {
        console.error(error)
        message.error('Không thể tải dữ liệu dashboard, vui lòng thử lại')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboard()
  }, [projectId])

  const stats = summaryData?.stats ?? DEFAULT_STATS
  const rangeDays = summaryData?.range?.days ?? 7
  const dueSoonDays = summaryData?.dueSoon?.days ?? 7
  const statusBreakdown = summaryData?.statusOverview?.breakdown ?? []
  const statusTotal = summaryData?.statusOverview?.total ?? 0
  const priorityBreakdown = summaryData?.priorityBreakdown ?? []
  const workTypes = summaryData?.typesOfWork ?? []

  const donutStyles = useMemo(() => {
    if (!statusBreakdown.length) return {}
    let cursor = 0
    const segments = statusBreakdown.map((item) => {
      const color = STATUS_COLORS[item.key] || STATUS_COLORS.default
      const end = cursor + item.percentage
      const segment = `${color} ${cursor}% ${Math.min(end, 100)}%`
      cursor = Math.min(end, 100)
      return segment
    })
    return { background: `conic-gradient(${segments.join(', ')})` }
  }, [statusBreakdown])

  const priorityOrder = ['high', 'medium', 'low']
  const priorityBars = priorityOrder
    .map((key) => ({
      key,
      ...(priorityBreakdown.find((item) => item.key === key) || {
        key,
        label: PRIORITY_LABELS[key],
        count: 0,
        percentage: 0,
      }),
    }))
    .filter(Boolean) as DashboardBreakdownItem[]

  const maxPriorityCount = Math.max(...priorityBars.map((item) => item.count || 0), 1)
  const axisLabels = [
    maxPriorityCount,
    Math.round(maxPriorityCount * 0.66),
    Math.round(maxPriorityCount * 0.33),
    0,
  ]

  const workloadRows = useMemo<WorkloadRow[]>(() => {
    const members = workloadData?.members || []
    const rows: WorkloadRow[] = members.map((member) => {
      const name = member.full_name || member.email || 'Không rõ'
      return {
        id: member.user_id || name,
        name,
        initials: name.slice(0, 2).toUpperCase(),
        percentage: Number(member.percentage?.toFixed(2) || 0),
        tasks: member.tasks,
      }
    })

    if (workloadData?.unassigned?.tasks) {
      rows.push({
        id: 'unassigned',
        name: 'Chưa giao',
        initials: 'CG',
        percentage: Number(workloadData.unassigned.percentage?.toFixed(2) || 0),
        tasks: workloadData.unassigned.tasks,
        isUnassigned: true,
      })
    }
    return rows
  }, [workloadData])

  const activityItems = useMemo<ActivityFeedItem[]>(() => {
    return (activityData?.logs || []).map((log) => {
      let metadata: Record<string, any> | null = null
      if (log.logHistory) {
        try {
          metadata = JSON.parse(log.logHistory)
        } catch (error) {
          metadata = null
        }
      }
      const type = (metadata?.type as string) || 'default'
      const Icon = LOG_TYPE_ICON_MAP[type] || LOG_TYPE_ICON_MAP.default
      const statusLabel =
        type === 'task_status_changed'
          ? metadata?.to || LOG_TYPE_LABELS[type] || LOG_TYPE_LABELS.default
          : LOG_TYPE_LABELS[type] || LOG_TYPE_LABELS.default

      return {
        id: log._id,
        userName: log.user?.full_name || log.user?.username || log.user?.email || 'Hệ thống',
        content: log.content,
        statusLabel,
        relativeTime: moment(log.createdAt).fromNow(),
        Icon,
      }
    })
  }, [activityData])

  const epicInfo = workTypes.find((item) => item.key === 'epic')

  return (
    <LayoutCommon>
      <div className={styles.container}>
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Spin tip="Đang tải tổng quan dự án..." />
          </div>
        ) : (
          <div className="flex-1 h-[1050px] pb-10">
            <div className={styles.statsGrid}>
              <div className={styles.statCardCircle}>
                <div className={styles.circleIcon}>
                  <Check size={14} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stats.completed} hoàn thành</div>
                  <div className={styles.statLabel}>trong {rangeDays} ngày gần đây</div>
                </div>
              </div>

              <StatCard
                icon={Edit2}
                value={`${stats.updated} được cập nhật`}
                subLabel={`trong ${rangeDays} ngày`}
              />
              <StatCard
                icon={CheckSquare}
                value={`${stats.created} được tạo mới`}
                subLabel={`trong ${rangeDays} ngày`}
              />
              <StatCard
                icon={Calendar}
                value={`${stats.dueSoon} sắp đến hạn`}
                subLabel={`trong ${dueSoonDays} ngày tới`}
              />
            </div>

            <div className={styles.mainGrid}>
              <div className={styles.column}>
                <div className={`${styles.card} ${styles.statusOverview}`}>
                  <div className={styles.cardHeader}>
                    <h3>Tổng quan trạng thái</h3>
                    <p>
                      Trạng thái toàn bộ công việc thuộc project.{' '}
                      <a href="#">Xem tất cả công việc</a>
                    </p>
                  </div>

                  <div className={styles.chartContainer}>
                    <div className={styles.donutChart} style={donutStyles}>
                      <div className={styles.chartCenter}>
                        <div className={styles.totalCount}>{statusTotal}</div>
                        <div className={styles.totalLabel}>Tổng số công việc</div>
                      </div>
                    </div>
                    <div className={styles.legend}>
                      {statusBreakdown.length === 0 && <span>Chưa có dữ liệu</span>}
                      {statusBreakdown.map((item) => (
                        <div key={item.key} className={styles.legendItem}>
                          <span
                            className={styles.legendColor}
                            style={{
                              backgroundColor: STATUS_COLORS[item.key] || STATUS_COLORS.default,
                            }}
                          ></span>
                          <span>
                            {STATUS_LABELS[item.key] || item.label}:{' '}
                            <span className={styles.legendValue}>
                              {item.count} ({Math.round(item.percentage)}%)
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>Phân tích độ ưu tiên</h3>
                    <p>
                      Ưu tiên đang phân bổ trong project. <a href="#">Cách quản lý ưu tiên</a>
                    </p>
                  </div>

                  <div className={styles.priorityChartContainer}>
                    <div className={styles.yAxisLabels}>
                      {axisLabels.map((label, index) => (
                        <span key={`${label}-${index}`}>{label}</span>
                      ))}
                    </div>
                    <div className={styles.chartArea}>
                      <div className={styles.gridLines}>
                        <div className={styles.gridLine}></div>
                        <div className={styles.gridLine}></div>
                        <div className={styles.gridLine}></div>
                      </div>
                      {priorityBars.map((bar) => {
                        const Icon =
                          bar.key === 'high'
                            ? ChevronsUp
                            : bar.key === 'medium'
                              ? Minus
                              : ChevronDown
                        const height = ((bar.count || 0) / maxPriorityCount) * 100 || 0
                        return (
                          <div
                            key={bar.key}
                            className={styles.chartBar}
                            style={{
                              height: `${Math.max(height, 4)}%`,
                              backgroundColor: PRIORITY_COLORS[bar.key] || '#9ca3af',
                            }}
                          >
                            <span className={styles.barLabel}>
                              <Icon size={10} className="inline mr-1" />
                              {PRIORITY_LABELS[bar.key] || bar.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.column}>
                <div className={styles.activityCard}>
                  <div className={styles.activityHeader}>
                    <div>
                      <h3>Hoạt động gần đây</h3>
                      <p>Các cập nhật mới nhất trong dự án.</p>
                    </div>
                    <button type="button">
                      <Maximize2 size={14} />
                    </button>
                  </div>

                  <div className={`${styles.activityScrollArea} ${styles.customScrollbar}`}>
                    <div className={styles.activityList}>
                      {activityItems.length === 0 && <span>Chưa có hoạt động nào</span>}
                      {activityItems.map((item) => (
                        <ActivityItem key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className={`${styles.card} ${styles.teamWorkload}`}>
                  <div className={styles.cardHeader}>
                    <h3>Tải công việc của đội</h3>
                    <p>
                      Theo dõi mức độ tải của mỗi thành viên.{' '}
                      <a href="#">Điều phối lại công việc</a>
                    </p>
                  </div>
                  <div>
                    <div className={styles.workloadHeader}>
                      <div style={{ gridColumn: 'span 4' }}>Người phụ trách</div>
                      <div style={{ gridColumn: 'span 8' }}>Phân bổ công việc</div>
                    </div>
                    {workloadRows.length === 0 && <span>Không có dữ liệu workload</span>}
                    {workloadRows.map((row) => (
                      <div key={row.id} className={styles.workloadRow}>
                        <div className={styles.assignee}>
                          <div className={styles.assigneeAvatar}>{row.initials}</div>
                          <span className={styles.assigneeName}>{row.name}</span>
                        </div>
                        <div className={styles.workloadBar}>
                          <div className={styles.workloadTrack}>
                            <div
                              className={styles.workloadFill}
                              style={{
                                width: `${Math.min(row.percentage, 100)}%`,
                                backgroundColor: row.isUnassigned ? '#f97316' : '#6b7280',
                              }}
                            ></div>
                            <span className={styles.workloadText}>
                              {row.tasks} việc • {row.percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutCommon>
  )
}

export default Summary

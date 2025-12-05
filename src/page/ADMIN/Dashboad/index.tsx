import { Card, Col, Row, Typography, Empty, Spin, Button, Modal, message } from 'antd'
import {
  StarOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  StarFilled
} from '@ant-design/icons'
import styles from './styles.module.scss'
import { useEffect, useState } from 'react'
import type { Project } from '~/types/api/project'
import type { ProjectSearchResult } from '~/types/api/search'
import type { RecentProject } from '~/types/api/dashboard'
import { ProjectService } from '~/services/ProjectService'
import { DashboardService } from '~/services/DashboardService'
import { useNavigate } from 'react-router-dom'
import ROUTER from '~/routers'
import { useSearch } from '~/contexts/SearchContext'

const { Title, Text } = Typography

type DashboardProject = (Project | ProjectSearchResult) & { liked?: boolean }

const toStringId = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && '_id' in (value as Record<string, unknown>)) {
    const nested = (value as { _id?: unknown })._id
    return nested ? toStringId(nested) : ''
  }
  return value != null ? String(value) : ''
}

const normalizeProject = <T extends { _id: unknown }>(project: T): T & { _id: string } => ({
  ...project,
  _id: toStringId(project._id)
})

const matchProjectId = (projectId: string, candidateId: unknown) => projectId === toStringId(candidateId)

const Dashboard = () => {
  const navigate = useNavigate()

  const [listProjects, setListProjects] = useState<Project[]>([])
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null)
  const [favoriteUpdatingId, setFavoriteUpdatingId] = useState<string | null>(null)
  const { projectSearchQuery, projectSearchResults, isProjectSearching } = useSearch()
  const trimmedProjectQuery = projectSearchQuery.trim()
  const isFilteringProjects = Boolean(trimmedProjectQuery)
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([])
  const [isRecentLoading, setIsRecentLoading] = useState<boolean>(false)
  const baseProjects: Array<Project | ProjectSearchResult> = isFilteringProjects
    ? projectSearchResults
    : listProjects
  const deriveLikedState = (projectId: string) =>
    listProjects.find(project => matchProjectId(projectId, project._id))?.liked ?? false
  const visibleProjects: DashboardProject[] = baseProjects.map((project) => ({
    ...project,
    liked: project.liked ?? deriveLikedState(project._id)
  }))
  const starredProjects: DashboardProject[] = listProjects
    .filter((project) => project.liked)
    .map((project) => ({ ...project, liked: true }))
  const showProjectEmptyState =
    isFilteringProjects && !isProjectSearching && visibleProjects.length === 0
  const image = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'

  const formatRecentActivity = (timestamp?: string) => {
    if (!timestamp) return 'Chưa có hoạt động'
    const date = new Date(timestamp)
    if (Number.isNaN(date.getTime())) return 'Chưa có hoạt động'
    return `Hoạt động gần nhất: ${date.toLocaleString('vi-VN')}`
  }

  const fetchProjects = async () => {
    try {
      const res = await ProjectService.projectGetAll()
      if (res.isOk && res.data) {
        setListProjects(res.data.map(normalizeProject))
      }
    } catch (error) {
      void error
      message.error('Không thể tải danh sách dự án')
    }
  }

  const fetchRecentProjects = async () => {
    setIsRecentLoading(true)
    try {
      const res = await DashboardService.getRecentProjects()
      if (res?.isOk && Array.isArray(res.data)) {
        setRecentProjects(res.data.map(normalizeProject))
      } else {
        setRecentProjects([])
      }
    } catch (error) {
      void error
      message.error('Không thể tải danh sách dự án gần đây')
    } finally {
      setIsRecentLoading(false)
    }
  }

  const performDeleteProject = async (projectId: string) => {
    setDeletingProjectId(projectId)
    try {
      const res = await ProjectService.deleteProject(projectId)
      message.success(res?.message || 'Đã xóa dự án')
      setListProjects(prev => prev.filter(project => !matchProjectId(projectId, project._id)))
      setRecentProjects(prev => prev.filter(project => !matchProjectId(projectId, project._id)))
      await fetchProjects()
    } catch (error) {
      void error
      message.error('Không thể xóa dự án')
    } finally {
      setDeletingProjectId(null)
    }
  }

  const handleConfirmDeleteProject = (project: Project | ProjectSearchResult) => {
    Modal.confirm({
      title: `Xóa dự án "${project.name}"?`,
      icon: <ExclamationCircleOutlined />,
      content:
        'Hành động này sẽ xóa dự án và toàn bộ dữ liệu liên quan. Bạn sẽ không thể hoàn tác.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      centered: true,
      onOk: () => performDeleteProject(project._id)
    })
  }

  const handleToggleFavorite = async (projectId: string, nextLiked: boolean) => {
    setFavoriteUpdatingId(projectId)
    try {
      const res = await ProjectService.toggleFavorite(projectId, nextLiked)
      const updatedLiked = res?.data?.liked ?? nextLiked
      setListProjects((prev) =>
        prev.map((project) =>
          matchProjectId(projectId, project._id) ? { ...project, liked: updatedLiked } : project
        )
      )
      message.success(updatedLiked ? 'Đã đánh dấu sao dự án' : 'Đã bỏ đánh dấu sao')
    } catch (error) {
      void error
      message.error('Không thể cập nhật trạng thái yêu thích')
    } finally {
      setFavoriteUpdatingId(null)
    }
  }

  const renderProjectCard = (project: DashboardProject) => {
    return (
      <Col xs={24} sm={12} md={6} key={project._id}>
        <Card
          onClick={() => navigate(ROUTER.DU_AN.replace(':id', project._id))}
          className={styles.boardCard}
          cover={
            <div className={styles.boardCover} style={{ backgroundImage: `url(${image})` }}>
              <Button
                type="text"
                icon={project.liked ? <StarFilled /> : <StarOutlined />}
                loading={favoriteUpdatingId === project._id}
                className={`${styles.starToggleBtn} ${project.liked ? styles.starActive : ''}`}
                onClick={(event) => {
                  event.stopPropagation()
                  handleToggleFavorite(project._id, !project.liked)
                }}
              />
            </div>
          }
        >
          <div className={styles.cardFooter}>
            <Text className={styles.templateTitle}>{project.name}</Text>
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              loading={deletingProjectId === project._id}
              className={styles.deleteButton}
              onClick={(event) => {
                event.stopPropagation()
                handleConfirmDeleteProject(project)
              }}
            >
              Xóa
            </Button>
          </div>
        </Card>
      </Col>
    )
  }

  useEffect(() => {
    fetchProjects()
    fetchRecentProjects()
  }, [])

  return (
    <div className={styles.dashboardContent}>
      {/* Jira Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Title level={4} {...(styles.sectionHeading && { className: styles.sectionHeading })}>
            CÁC KHÔNG GIAN LÀM VIỆC CỦA BẠN
          </Title>
          <CloseOutlined className={styles.closeIcon} />
        </div>
        <Row gutter={[16, 16]} className={styles.cardGrid}>
          {isProjectSearching ? (
            <Col span={24}>
              <div className={styles.projectSearchState}>
                <Spin />
                <Text className={styles.projectSearchStateText}>Đang tìm kiếm dự án...</Text>
              </div>
            </Col>
          ) : showProjectEmptyState ? (
            <Col span={24}>
              <Empty description={`Không tìm thấy dự án cho "${trimmedProjectQuery || projectSearchQuery}"`} />
            </Col>
          ) : (
            visibleProjects.map((project) => renderProjectCard(project))
          )}
        </Row>
      </div>

      {!isFilteringProjects && (
        <>
          {/* Starred Boards Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderLeft}>
                <StarOutlined className={styles.starIcon} />
                <Title level={4} {...(styles.sectionHeading && { className: styles.sectionHeading })}>
                  Bảng Đánh Dấu Sao
                </Title>
              </div>
            </div>
            <Row gutter={[16, 16]} className={styles.cardGrid}>
              {starredProjects.length === 0 ? (
                <Col span={24}>
                  <Empty description="Chưa có dự án nào được đánh dấu sao" />
                </Col>
              ) : (
                starredProjects.map((project) => renderProjectCard(project))
              )}
            </Row>
          </div>

          {/* Recent Boards Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderLeft}>
                <ClockCircleOutlined className={styles.clockIcon} />
                <Title level={4} {...(styles.sectionHeading && { className: styles.sectionHeading })}>
                  Đã xem gần đây
                </Title>
              </div>
            </div>
            <Row gutter={[16, 16]} className={styles.cardGrid}>
              {isRecentLoading ? (
                <Col span={24}>
                  <div className={styles.projectSearchState}>
                    <Spin />
                    <Text className={styles.projectSearchStateText}>Đang tải dự án gần đây...</Text>
                  </div>
                </Col>
              ) : recentProjects.length === 0 ? (
                <Col span={24}>
                  <Empty description="Chưa có dự án nào được xem gần đây" />
                </Col>
              ) : (
                recentProjects.map((project) => {
                  return (
                    <Col xs={24} sm={12} md={6} key={project._id}>
                      <Card
                        className={styles.boardCard}
                        onClick={() => navigate(ROUTER.DU_AN.replace(':id', project._id))}
                        cover={
                          <div
                            className={styles.boardCover}
                            style={{ backgroundImage: `url(${image})` }}
                          ></div>
                        }
                      >
                        <Text className={styles.boardTitle}>{project.name}</Text>
                        <Text className={styles.boardMeta}>
                          {formatRecentActivity(project.last_activity)}
                        </Text>
                      </Card>
                    </Col>
                  )
                })
              )}
            </Row>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard

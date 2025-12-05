import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Button, Checkbox, DatePicker, Divider, Input, Popover, Space, Tag } from 'antd'
import { FilterOutlined, SearchOutlined } from '@ant-design/icons'
import dayjs, { type Dayjs } from 'dayjs'
import { debounce } from 'lodash'
import styles from './styles.module.scss'
import { useSearch } from '~/contexts/SearchContext'

interface FilterState {
  status: string[]
  priority: string[]
  dueBefore: string | null
}

const statusOptions = [
  { value: 'planning', label: 'Lên kế hoạch', color: '#8b5cf6' },
  { value: 'in_progress', label: 'Đang thực hiện', color: '#3b82f6' },
  { value: 'testing', label: 'Đang kiểm thử', color: '#f97316' },
  { value: 'completed', label: 'Đã hoàn thành', color: '#22c55e' }
]

const priorityOptions = [
  { value: 'high', label: 'Ưu tiên cao', color: '#ef4444' },
  { value: 'medium', label: 'Ưu tiên trung bình', color: '#facc15' },
  { value: 'low', label: 'Ưu tiên thấp', color: '#06b6d4' }
]

const defaultFilters: FilterState = {
  status: [],
  priority: [],
  dueBefore: null
}

const ProjectSearch = () => {
  const [filters, setFilters] = useState<FilterState>(() => ({ ...defaultFilters }))
  const [filterOpen, setFilterOpen] = useState(false)
  const {
    projectSearchQuery,
    setProjectSearchQuery,
    performProjectSearch,
    clearProjectSearch
  } = useSearch()

  const activeFilterCount = filters.status.length + filters.priority.length + (filters.dueBefore ? 1 : 0)
  const trimmedQuery = projectSearchQuery.trim()

  const projectSearch = useMemo(
    () =>
      debounce((keyword: string, activeFilters: FilterState) => {
        performProjectSearch(keyword, {
          status: activeFilters.status,
          priority: activeFilters.priority,
          dueBefore: activeFilters.dueBefore
        })
      }, 250),
    [performProjectSearch]
  )

  useEffect(() => {
    return () => projectSearch.cancel()
  }, [projectSearch])

  useEffect(() => {
    if (!trimmedQuery) {
      projectSearch.cancel()
      clearProjectSearch()
      return
    }

    projectSearch(trimmedQuery, filters)
  }, [trimmedQuery, filters, projectSearch, clearProjectSearch])

  const handleFilterToggle = (field: keyof FilterState, value: string) => {
    setFilters(prev => {
      const current = prev[field] as string[]
      const exists = current.includes(value)
      const updated = exists ? current.filter(item => item !== value) : [...current, value]
      return {
        ...prev,
        [field]: updated
      }
    })
  }

  const handleDueChange = (value: Dayjs | null) => {
    setFilters(prev => ({
      ...prev,
      dueBefore: value ? value.toISOString() : null
    }))
  }

  const handleResetFilters = () => {
    setFilters(() => ({ ...defaultFilters }))
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setProjectSearchQuery(value)
    if (!value.trim()) {
      clearProjectSearch()
    }
  }

  const filterContent = (
    <div className={styles.filterContent}>
      <div className={styles.filterSection}>
        <div className={styles.filterSectionTitle}>Trạng thái</div>
        <Space direction="vertical" size={6} className={styles.filterOptions}>
          {statusOptions.map(option => (
            <Checkbox
              key={option.value}
              checked={filters.status.includes(option.value)}
              onChange={() => handleFilterToggle('status', option.value)}
            >
              <Tag color={option.color}>{option.label}</Tag>
            </Checkbox>
          ))}
        </Space>
      </div>

      <Divider className={styles.filterDivider} />

      <div className={styles.filterSection}>
        <div className={styles.filterSectionTitle}>Mức độ ưu tiên</div>
        <Space direction="vertical" size={6} className={styles.filterOptions}>
          {priorityOptions.map(option => (
            <Checkbox
              key={option.value}
              checked={filters.priority.includes(option.value)}
              onChange={() => handleFilterToggle('priority', option.value)}
            >
              <Tag color={option.color}>{option.label}</Tag>
            </Checkbox>
          ))}
        </Space>
      </div>

      <Divider className={styles.filterDivider} />

      <div className={styles.filterSection}>
        <div className={styles.filterSectionTitle}>Hạn kết thúc trước</div>
        <DatePicker
          format="DD/MM/YYYY"
          value={filters.dueBefore ? dayjs(filters.dueBefore) : null}
          onChange={handleDueChange}
          className={styles.filterDatePicker}
        />
        {filters.dueBefore && (
          <Button type="link" size="small" onClick={() => handleDueChange(null)}>
            Xóa ngày lọc
          </Button>
        )}
      </div>

      <Divider className={styles.filterDivider} />

      <div className={styles.filterFooter}>
        <span>{activeFilterCount} bộ lọc đang bật</span>
        <Button size="small" onClick={handleResetFilters} disabled={activeFilterCount === 0}>
          Đặt lại
        </Button>
      </div>
    </div>
  )

  return (
    <div className={styles.projectSearchWrapper}>
      <div className={styles.projectSearchInput}>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          value={projectSearchQuery}
          onChange={handleInputChange}
          placeholder="Tìm dự án, không gian làm việc..."
          className={styles.projectSearchField}
        />
      </div>

      <Popover
        trigger="click"
        content={filterContent}
        open={filterOpen}
        onOpenChange={visible => setFilterOpen(visible)}
        overlayClassName={styles.filterPopover}
      >
        <Button
          icon={<FilterOutlined />}
          className={`${styles.filterButton} ${activeFilterCount ? styles.filterButtonActive : ''}`}
        >
          Lọc {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
        </Button>
      </Popover>
    </div>
  )
}

export default ProjectSearch

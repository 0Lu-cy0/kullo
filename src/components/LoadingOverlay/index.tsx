import styles from './styles.module.scss'

const LoadingOverlay = ({ isOverlay = false, isLoadingTable = false, sizeSmall = false }) => {
  return (
    <div className={styles.appChangeRouterProgress}>
      <div className={styles.loader}>
        <div className={`${styles.inner} ${styles.one}`} />
        <div className={`${styles.inner} ${styles.two}`} />
        <div className={`${styles.inner} ${styles.three}`} />
      </div>
    </div>
  )
}

export default LoadingOverlay

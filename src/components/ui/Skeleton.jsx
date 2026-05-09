export function Skeleton({ height = '16px', width = '100%', radius, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{
        height,
        width,
        borderRadius: radius,
        flexShrink: 0,
        ...style,
      }}
    />
  )
}

export function PropertyCardSkeleton() {
  return (
    <div style={{
      backgroundColor: 'var(--color-background-primary)',
      border: '1px solid var(--color-border-primary)',
      borderRadius: 'var(--border-radius-lg)',
      padding: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ flex: 1, marginRight: '12px' }}>
          <Skeleton height="15px" width="70%" style={{ marginBottom: '8px' }} />
          <Skeleton height="12px" width="45%" />
        </div>
        <Skeleton height="22px" width="56px" radius="999px" />
      </div>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '14px' }}>
        <div style={{ flex: 1 }}>
          <Skeleton height="11px" width="60%" style={{ marginBottom: '6px' }} />
          <Skeleton height="14px" width="80%" />
        </div>
        <div style={{ flex: 1 }}>
          <Skeleton height="11px" width="60%" style={{ marginBottom: '6px' }} />
          <Skeleton height="14px" width="80%" />
        </div>
      </div>
      <Skeleton height="36px" radius="var(--border-radius-sm)" />
    </div>
  )
}

export function MessageSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Skeleton height="38px" width="55%" radius="14px 14px 3px 14px" />
      </div>
      <div>
        <Skeleton height="12px" width="30%" style={{ marginBottom: '8px' }} radius="999px" />
        <Skeleton height="72px" width="72%" radius="3px 14px 14px 14px" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Skeleton height="38px" width="40%" radius="14px 14px 3px 14px" />
      </div>
      <div>
        <Skeleton height="96px" width="80%" radius="3px 14px 14px 14px" />
      </div>
    </div>
  )
}

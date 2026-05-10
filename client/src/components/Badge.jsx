export default function Badge({ type = 'default', children, className = '' }) {
  return (
    <span className={`badge badge-${type} ${className}`}>
      {children}
    </span>
  );
}

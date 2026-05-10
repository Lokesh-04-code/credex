export default function Card({ title, badge, className = '', children, ...props }) {
  return (
    <article className={`card fade-in ${className}`} {...props}>
      {title && (
        <h2 className="card-title">
          {title}
          {badge && badge}
        </h2>
      )}
      {children}
    </article>
  );
}

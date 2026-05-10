export default function Modal({ open, onClose, title, children }) {
  return (
    <div className={`modal-overlay ${open ? 'open' : ''}`} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="modal-title" style={{ margin: 0, fontSize: 'var(--font-xl)' }}>{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

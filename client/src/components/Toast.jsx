export default function Toast({ message, type = 'info', onDismiss }) {
  return (
    <div className={`toast toast-${type}`} role="alert">
      <span>{message}</span>
    </div>
  );
}

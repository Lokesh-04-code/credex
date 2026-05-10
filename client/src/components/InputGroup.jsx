export default function InputGroup({ label, id, type = 'text', ...props }) {
  const isTextarea = type === 'textarea';

  return (
    <div className="input-group">
      {isTextarea ? (
        <textarea id={id} placeholder=" " {...props} />
      ) : (
        <input id={id} type={type} placeholder=" " {...props} />
      )}
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

import '../asset/css/ClassMakerForm.css';

export const InputField = ({ id, label, type, value, onChange, placeholder }) => (
    <div className="input-field">
        <label htmlFor={id}>{label}</label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    </div>
);
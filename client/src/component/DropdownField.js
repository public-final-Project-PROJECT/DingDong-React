import '../asset/css/ClassMakerForm.css';

export const DropdownField = ({ id, label, value, options, onChange }) => (
    <div className="dropdown-field">
        <label htmlFor={id}>{label}</label>
        <select id={id} value={value} onChange={onChange}>
            <option value="" disabled>
                선택해주세요
            </option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);
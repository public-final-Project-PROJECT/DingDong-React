import '../asset/css/ClassMakerForm.css';

export const SchoolNameDisplay = ({ isEditable, schoolName, onChange }) => (
    isEditable ? (
        <div className="schoolName">
            <label htmlFor="schoolName">학교 이름 </label>
            <input
                id="schoolName"
                type="text"
                value={schoolName}
                onChange={onChange}
                placeholder="학교 이름을 입력해주세요."
            />
        </div>
    ) : (
        // <div>
        //     학교 이름: {schoolName}
        //     <p style={{ color: 'red' }}>
        //         재직중인 학교가 설정되어 있습니다. 학교 이름을 수정할 수 없습니다.
        //     </p>
        // </div>
        null
    )
);
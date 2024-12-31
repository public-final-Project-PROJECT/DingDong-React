import { useState, useEffect } from "react";
import ReactModal from "react-modal";

const NonVotingModal = ({ setNonStudentModalShow, nonVoters, votedStudentIds }) => {
    const [nonVotingModal, setNonVotingModal] = useState(true); // 모달 on/off

    const closeModalHandler = () => {
        setNonStudentModalShow(false);
        setNonVotingModal(false);
        console.log(nonVoters)
        console.log(votedStudentIds)
        // console.log(filteredNonVoters)
    };


    // const filteredNonVoters = nonVoters.filter(student => 
    //     !votedStudentIds.includes(student.studentId) 
    // );

    // console.log(filteredNonVoters); 
    return (
        <ReactModal
            isOpen={nonVotingModal}
            contentLabel="nonVoting 학생 modal"
            appElement={document.getElementById("root")}
            style={{
                content: {
                    top: "50%",
                    left: "50%",
                    right: "auto",
                    bottom: "auto",
                    marginRight: "-50%",
                    transform: "translate(-50%, -50%)",
                    width: 600,
                    borderRadius: 0,
                    border: "none",
                    padding: "42px",
                    // backgroundColor:"rgb(255,255,255,0.)"
                },
            }}
        >
            {nonVoters.length > 0 ? (
                <span className="non-voters">
                    <strong>미투표자:</strong>
                    {console.log(nonVoters)}
                    {nonVoters.map(student => (
                      <>
                        <div key={student.id}>{student.name}</div> 
                        <button>알림보내기</button>
                        </>
                    ))}
                    <br />
                </span>
            ) : (
                <p>모든 학생이 투표를 완료했습니다.</p> 
            )}
            <button onClick={closeModalHandler}>닫기</button>
        </ReactModal>
    );
};

export default NonVotingModal;

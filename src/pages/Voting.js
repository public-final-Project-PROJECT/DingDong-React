import { useState, useEffect } from "react";
import NewVoting from "../component/NewVoting";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCheckToSlot, faCircle, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import '../asset/css/Voting.css';
import NonVotingModal from "../component/NonVotingModal";
import ReactModal from "react-modal";


const Voting = () => {
    const [newVotingModal, setNewVotingModal] = useState(false); // 투표 만들기 모달
    const [idVoteState, setIdVoteState] = useState(false);
    const [votingData, setVotingData] = useState([]); // 투표 기본 정보 요청 response 담음
    const [contentsData, setContentsData] = useState({});
    const [modalShow, setModalShow] = useState(false);
    const [rere, setRere] = useState(false);
    const [voteResults, setVoteResults] = useState([{}]); // 투표 결과
    const [studentInfo, setStudentInfo] = useState({}); // 학생 정보 담기
    const [nonStudentModalShow, setNonStudentModalShow] = useState(false); // 투표 안한 학생 보기 모달
    const [isMaxVoted, setIdMaxVoted] = useState(); // 가장 많은 득표수를 받은 투표
    const [nonVotingModal, setNonVotingModal] = useState(true); // 모달 on/off

    

    // 학생 정보 가져오기 (이름, 이미지)
    const findClassByStudentsName = async () => {
        try {
            const response = await axios.post(
                'http://localhost:3013/api/voting/findStudentsName',
                { classId: 1 },
            );
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('findStudentsName 중 error : ', error);
        }
    };

    // 투표 항목들에 대한 유저들의 투표 정보
    const optionSend = async (voteId) => {
        try {
            const response = await axios.post(
                `http://localhost:3013/api/voting/VoteOptionUsers`,
                { votingId: voteId, classId: 1 }
            );
            const voteDetails = response.data.reduce((acc, item) => {
                const { contentsId, studentId } = item;
                if (!acc[contentsId]) {
                    acc[contentsId] = { voters: [] };
                }
                acc[contentsId].voters.push(studentId);
                return acc;
            }, {});
            setVoteResults((prev) => ({
                ...prev,
                [voteId]: voteDetails,
            }));
        } catch (error) {
            console.error(`Error in optionSend for voting ID ${voteId}:`, error);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const votingResponse = await Send();
                if (votingResponse && votingResponse.length > 0) {
                    const allContents = {};
                    for (const vote of votingResponse) {
                        const contents = await contentsSend(vote.id);
                        allContents[vote.id] = contents;
                        await optionSend(vote.id);
                    }
                    setContentsData(allContents);
                }

                const studentData = await findClassByStudentsName();
                const studentMap = studentData.reduce((map, student) => {
                    map[student.studentId] = { id:student.studentId, name: student.studentName, img: student.studentImg };
                    return map;
                }, {});
                setStudentInfo(studentMap);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        fetchInitialData();
    }, []);


    // 1. 투표 list 조회 요청
    const Send = async () => {
        try {
            const response = await axios.post(
                `http://localhost:3013/api/voting/findVoting`,
                { classId: 2 }
            );
            console.log(response);
            setVotingData(response.data);
            return response.data;
        } catch (error) {
            console.error("Voting error:", error);
        }
    };


    // 2. 투표들의 각각 항목 조회 요청
    const contentsSend = async (votingId) => {
        try {
            const response = await axios.post(
                `http://localhost:3013/api/voting/findContents`,
                { votingId: votingId },
            );
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(`vote contents 데이터 오류  ${votingId}:`, error);
            return [];
        }
    };

    
    // 투표 종료 handler(idVote 값 false 로 변경)
    function endHandler(voteId){ 
      let result = window.confirm("투표를 종료하시겠습니까?");
      
      if(result){
      axios.post(
       `http://localhost:3013/api/voting/isVoteUpdate`,
         { votingId: voteId }, // 투표 고유 id
      ).then(function (response) {
          setIdVoteState(true);
          alert("투표가 종료되었습니다 !");
       
      });
      }else{
        return;
      }

    }

    const findNonVoters = (votingId, totalStudents) => {
 
      const voteData = voteResults[votingId] || {};
    
  
      const voters = Object.keys(voteData).reduce((acc, contentsId) => {
        acc.push(...voteData[contentsId].voters);
        return acc;
      }, []);
    
      console.log(`Voters for vote ID ${votingId}:`, voters);
    
     
      const nonVoters = totalStudents.filter(student => !voters.includes(student.id));
      console.log(`Non-voters for vote ID ${votingId}:`, nonVoters);
    
      return nonVoters;
    };
    
    

    return (
        <>
            <h1 className="title"> 투표 </h1>
            <button onClick={() => setNewVotingModal(true)}> <FontAwesomeIcon icon={faPenToSquare} /> </button>
            {newVotingModal && <NewVoting setNewVotingModal={setNewVotingModal} newVotingModal={newVotingModal} />}
            {modalShow && (
                <NewVoting
                    setModalShow={setModalShow}
                    modalShow={modalShow}
                    setRere={setRere}
                    rere={rere}
                />
            )}
            <div className="voting-container">
    {Array.isArray(votingData) &&
        votingData.map((vote) => {
          
            const isEnded = !!vote.votingEnd; // 투표 종료 여부
            const today = new Date();
            const endTime = new Date(vote.votingEnd);
            const daysRemaining = Math.ceil((endTime - today) / (1000 * 60 * 60 * 24));
            // findNonVoters에서 studentId가 포함된 totalStudents를 넘겨줌
             const nonVoters = findNonVoters(vote.id, Object.values(studentInfo)); 
             {console.log(nonVoters)}
            const votedStudentIds = Object.keys(voteResults[vote.id] || {}).reduce((acc, contentsId) => {
                acc.push(...voteResults[vote.id][contentsId].voters);
                return acc;
            }, []);

            return (
                <section key={vote.id} className="voting-card">
                    <div className="vote-status">
                        {!vote.vote ? (
                          <>
                            <h3 style={{ color: "gray" }}>투표 종료</h3>
                            {nonStudentModalShow && (
                            <NonVotingModal
                                setNonStudentModalShow={setNonStudentModalShow}
                                nonVoters={nonVoters} // 필터링된 미투표자 전달
                                // votedStudentIds={votedStudentIds} // 투표한 학생들 전달
                                voteId={vote.id}
                            />
                        )}
                         {/* <ReactModal
                                    isOpen={nonStudentModalShow}
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
                                        },
                                    }}
                                > {nonVoters.length > 0 ? (
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
            )}</ReactModal> */}
                           
                            </>
                        ) : (
                          <>
                            <h6  style={{ color: "red" }}><FontAwesomeIcon icon={faCircle} /></h6>
                            <h3 style={{ color: "red" }}>진행중</h3>
                          </>
                        )}
                         {vote.vote && !isEnded && (
                          <button  onClick={() => endHandler(vote.id)}> 투표 종료</button>
                        )}
                        <div className="vote-name-container">
                            {isEnded && daysRemaining === 0 ? (
                                <p style={{ color: "red" }}><strong>오늘 마감되는 투표입니다 !</strong></p>
                            ) : (
                                isEnded && <h5 className="end-time" style={{ color: "red" }}>
                                       [ {new Date(vote.votingEnd).toLocaleString()} ]  에 자동으로 종료됩니다 !
                                   </h5>
                            )}
                        </div>
                    </div>

                    <div className="button_div">
                    <button className="two_button" onClick={() => setNonStudentModalShow(true)}>투표 안한 학생 보기</button>
                    <button className="two_button">투표 결과 알림 보내기</button>
                    </div>

                    <div className="voting-header">
                        <p className="date">
                            {new Date(vote.createdAt).toLocaleDateString()}{" "}
                            <FontAwesomeIcon icon={faUsers} />
                        </p>
                    </div>
                    <h2 className="vote-name">
                        {vote.votingName}
                    </h2>
                    <span className="vote-detail">{vote.votingDetail}</span>
                    <div className="separator"></div>
                    <ul>
                    {Array.isArray(contentsData[vote.id]) && contentsData[vote.id].length > 0 ? (
                            contentsData[vote.id].map((content, idx) => {
                                const voters = voteResults[vote.id]?.[content.contentsId]?.voters || [];
                                
                                // 각 투표 항목의 최대 투표 수 계산
                                const maxVotes = Math.max(
                                    ...contentsData[vote.id].map((c) => {
                                        const votersForContent = voteResults[vote.id]?.[c.contentsId]?.voters || [];
                                        return votersForContent.length;
                                    })
                                );

                                // 현재 콘텐츠가 최대 투표를 받은 콘텐츠인지 확인
                                const isMaxVoted = voters.length === maxVotes;
                   
                                return (
                                    <div key={idx} className="vote-item">
                                        <p 
                                            className="vote-option" 
                                            style={{ color: isMaxVoted ? "red" : "black" }} // 최대 투표 콘텐츠는 빨간색으로 표시
                                        >
                                            {content.votingContents} - {voters.length}명 투표
                                        </p>
                                        <div className="student-voters">
                                            {voters.map((studentId) => {
                                                const student = studentInfo[studentId];
                                                return (
                                                    student && (
                                                        <div key={studentId} className="student-info">
                                                            <h7>투표한 학생:</h7>
                                                            <img src={student.img} alt={student.name} className="student-img" />
                                                            <br/>
                                                            <br/>
                                                            {isMaxVoted ?  
                                                              <h3 style={{ color: "red" }}>
                                                                투표 결과  : {content.votingContents} 
                                                                </h3> 
                                                                : 
                                                                <h3>투표결과가 동점입니다 !</h3>
                                                            } 
                                                        </div>
                                                    )
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>내용이 없습니다.</p>
                        )}

                    </ul>
                </section>
            );
        })}
</div>

        </>
    );
};

export default Voting;

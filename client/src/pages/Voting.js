import { useState, useEffect } from "react";
import NewVoting from "../component/NewVoting";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faTrashCan,faPause,faUsersSlash, faBell, faCircle, faPenToSquare,faUserCheck,faHourglassStart} from "@fortawesome/free-solid-svg-icons";
import '../asset/css/Voting.css';
import NonVotingModal from "../component/NonVotingModal";
import ReactModal from "react-modal";
import { useUserData } from "../hooks/useUserData";

//올라가라 
const Voting = () => {
    const { selectedClassId } = useUserData();
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
    const [voteStudentsShow, setVoteStudentsShow] = useState(false); // 투표 한 학생들 보기
    const [activeContent, setActiveContent] = useState({});
    const [newStateValue, setNewStateValue] = useState();

    

    // 학생 정보 가져오기 (이름, 이미지)
    const findClassByStudentsName = async () => {
        try {
            const response = await axios.post(
                'http://localhost:3013/api/voting/findStudentsName',
                { classId: selectedClassId },
            );
           
            return response.data;
        } catch (error) {
            console.error('findStudentsName 중 error : ', error);
        }
    };

    // 투표 항목들에 대한 학생들의 투표 정보
    const optionSend = async (voteId) => {
        try {
            const response = await axios.post(
                `http://localhost:3013/api/voting/VoteOptionUsers`,
                { votingId: voteId, classId: selectedClassId }
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
                console.error("useEffect Error :", error);
            }
        };

        fetchInitialData();
    }, [idVoteState, newStateValue]);


    // 1. 투표 list 조회 요청
    const Send = async () => {
        try {
            const response = await axios.post(
                `http://localhost:3013/api/voting/findVoting`,
                { classId: selectedClassId }
            );
            
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

      const nonVoters = totalStudents.filter(student => !voters.includes(student.id));
    
      return nonVoters;
    };

    
    // 투표 결과 알림 handler
    const bellClickHandler = (voteId, isEnded) => {

        if(isEnded){
            alert("아직 진행중인 투표입니다. \n 종료 후에 알림을 보내주세요. ");
            return;
        }
        let result = window.confirm(
            `모든 학생들에게 투표 종료 알림이 갑니다. \n 보내시겠습니까 ?` 
        );

        if(result){
            // 투표 결과 모든 학생들에게 알림 보내는 api
            axios.post(
                `http://localhost:3013/api/alert/votingResultAlert`,
                  { votingId: voteId , classId : selectedClassId}, // 투표 고유 id
               ).then(function (response) {
                if(response.data) {
                    alert("모든 학생에게 알림을 전송했습니다 !");
                }
        })
        }
    }


    const deleteHandler = (voteId) => {
        let result = window.confirm(
            `투표 기록이 사라집니다. 정말 삭제하시겠습니까 ?` 
        );
        if(result){
            // 투표 delete api 요청
            axios.post(
                `http://localhost:3013/api/voting/deleteVoting`,
                  { votingId: voteId }, // 투표 고유 id
               ).then(function (response) {
                if(response.data) {
                    newStateValue? setNewStateValue(false) : setNewStateValue(true)
                }
                   alert("투표가 삭제되었습니다 !");
                
        })
            
        }
    }

    

    return (
        <div className="voting-total-container">
            <div className="voting-title-div">
                <h1 className="voting_title"> 학급 투표 <br/>
                </h1>
                <button className="voting_maker_icon" onClick={() => setNewVotingModal(true)}> <FontAwesomeIcon icon={faPenToSquare} /> </button>
            </div>

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
                    const votedStudentIds = Object.keys(voteResults[vote.id] || {}).reduce((acc, contentsId) => {
                        acc.push(...voteResults[vote.id][contentsId].voters);
                        return acc;
                    }, []);

            return (
                <section key={vote.id} className="voting-card">
                    <div className="vote-status">
                        {!vote.vote ? (
                          <>
                          <div className="voting-ing-horizontal-container">
                            <h6  style={{ color: "grey" }}><FontAwesomeIcon icon={faCircle} /></h6>
                            <h3 className="voting-ing-gung" style={{ color: "grey" }}>종료</h3>
                          </div>
                            <button onClick={() => deleteHandler(vote.id)} className="votging-end-button">투표 삭제  <FontAwesomeIcon icon={faTrashCan} /></button>
                            {nonStudentModalShow && (
                            <NonVotingModal
                                setNonStudentModalShow={setNonStudentModalShow}
                                nonVoters={nonVoters} // 필터링된 미투표자 전달
                                // votedStudentIds={votedStudentIds} // 투표한 학생들 전달
                                voteId={vote.id}
                            />
                        )}
                           
                            </>
                        ) : (
                          <div className="voting-ing-horizontal-container">
                            <h6  style={{ color: "red" }}><FontAwesomeIcon icon={faCircle} /></h6>
                            <h3 className="voting-ing-gung">진행중</h3>
                          </div>
                        )}
                         {vote.vote && !isEnded && (
                          <button className="end_voting_button" onClick={() => endHandler(vote.id)}> 투표 종료 <FontAwesomeIcon icon={faPause} />  </button>
                        )}
                        <div className="vote-name-container">
                            {isEnded && daysRemaining === 0 ? (
                                <p style={{ color: "red" }}><strong>오늘 마감되는 투표입니다 !</strong></p>
                            ) : (
                                isEnded && <h5 className="end-time">
                                      <FontAwesomeIcon icon={faHourglassStart} /> 종료일 :  {new Date(vote.votingEnd).toLocaleString()} 
                                   </h5>
                            )}
                        </div>
                    </div>

                    <div className="voting_button_div">
                    <button className="voting_two_button" onClick={() => setNonStudentModalShow(true)}><FontAwesomeIcon icon={faUsersSlash} /></button>
                    <button className="voting_two_button" onClick={() => bellClickHandler(vote.id, isEnded)}><FontAwesomeIcon icon={faBell} /></button>
                    </div>

                    <div className="voting-header">
                        <p className="voting-date-createdAt">
                            {new Date(vote.createdAt).toLocaleDateString()}{" "}
                        
                        </p>
                    </div>
                    <h2 className="vote-name">
                        {vote.votingName}
                    </h2>
                    <span className="vote-detail">{vote.votingDetail}</span>
                    <div className="separator"></div>
                    <ul className="voting_card_contents">
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
                                        <div className ='contents_and_user_icons'>
                                        <p 
                                            className="vote-option" 
                                            style={{ color: isMaxVoted && voters.length != "0"? "red" : "black" }} // 최대 투표 콘텐츠는 빨간색으로 표시
                                        >
                                            <FontAwesomeIcon icon={faCircleCheck} />   {content.votingContents} - {voters.length}명
                                        </p>
                                        <div className="student-voters">
                                            
                                                <button
                                                onClick={() =>
                                                    setActiveContent((prev) => ({
                                                    ...prev,
                                                    [vote.id]: prev[vote.id] === content.contentsId ? null : content.contentsId,
                                                    }))
                                                }
                                                className="voting_check_students"
                                                >
                                                <FontAwesomeIcon icon={faUserCheck} /> 
                                                </button>
                                                </div>

                                                {activeContent[vote.id] === content.contentsId && (
                                                <div className="student-voters-modal">

                                                    {voters.map((studentId) => {
                                                    const student = studentInfo[studentId];
                                                    return student ? (
                                                        <div key={studentId} className="student-info">
                                                        <img src={student.img} className="student-img" />
                                                        <span className="student-name">
                                                            {student.name}
                                                        </span>
                                                        </div>
                                                    ) : 
                                                   null
                                                    })}
                                                    
                                                </div>
                                                )}


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

</div>
    );
};


export default Voting;

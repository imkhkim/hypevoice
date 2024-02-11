import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { WorkInfo, WorkModalProps } from "./type";
import { CurrentMemberAtom } from "@/recoil/Auth";
import { axiosClient } from "@/api/axios";
import WorkTemplate from "./WorkTemplate";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import WorkModal from "./WorkModal";

// 작업물 추가 버튼
const CreateWorkButton = styled.button`
  margin-left: 40px;
  width: 110px;
  border: none;
  border-radius: 25px;
  padding: 10px 15px;
  background-color: #5b5ff4;
  color: #fff;
  cursor: pointer;
`;

// 작업물들 갯수 넘겨주기 to Voice
type WorkGridProps = {
  setWorkCount: React.Dispatch<React.SetStateAction<number>>;
};

// 작업물들 들어가는 곳
const WorksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  padding: 15px;
  margin: 15px;
  overflow-x: auto;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

// 페이지네이션용
const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 15px;
`;

export default function WorkGrid({ setWorkCount }: WorkGridProps) {
  const [activePage, setActivePage] = useState(1);
  const worksPerPage = 12;
  const indexOfLastWork = activePage * worksPerPage;
  const indexOfFirstWork = indexOfLastWork - worksPerPage;
  const currentMember = useRecoilValue(CurrentMemberAtom);
  const voiceIdString = useParams<{ voiceId: string }>();
  const voiceId = voiceIdString.voiceId
    ? parseInt(voiceIdString.voiceId)
    : null;
  const [open, setOpen] = useState(false);

  // 작업물 추가 버튼 클릭 => 모달 창 열리기
  const handleClick = () => {
    setOpen(true);
  };

  // WorkModal 컴포넌트에서 모달을 닫음
  const handleClose = () => {
    setOpen(false);
  };

  // const fetchWorks = async (): Promise<WorkInfo[]> => {
  //   try {
  //     const response = await axiosClient.get(`/api/voices/${voiceId}/works`);
  //     // 작업물이 하나도 없다면
  //     if (!response.data) {
  //       alert(
  //         "작업물이 아직 없습니다. 하입보이스에게 당신의 목소리를 들려주세요!"
  //       );
  //     } else {
  //       alert(
  //         `${response.data.length} 개의 목소리를 가진 ${currentMember.nickname}님 반갑습니다!`
  //       );
  //     }
  //     return response.data;
  //   } catch (error) {
  //     console.error(error);
  //     return [];
  //   }
  // };

  const mockFetchWorks = async (): Promise<WorkInfo[]> => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          {
            voiceId: 1,
            workId: 1,
            title: "작업물 제목",
            videoLink: "http://example.com/video1.mp4",
            photoUrl: "http://example.com/photo1.jpg",
            scriptUrl: "http://example.com/script1.txt",
            recordUrl: "http://example.com/record1.mp3",
            info: "작업물에 대한 설명입니다.",
            isRep: 1,
            CategoryInfoValue: {
              workId: 1,
              mediaClassification: "오디오드라마",
              voiceTone: "중음",
              voiceStyle: "밝은",
              gender: "남성",
              age: "청소년",
            },
          },
          {
            voiceId: 2,
            workId: 2,
            title: "작업물 제목",
            videoLink: "http://example.com/video2.mp4",
            photoUrl: "http://example.com/photo2.jpg",
            scriptUrl: "http://example.com/script2.txt",
            recordUrl: "http://example.com/record2.mp3",
            info: "작업물에 대한 설명입니다. 작업물에 대한 설명입니다. 작업물에 대한 설명입니다. 작업물에 대한 설명입니다. 작업물에 대한 설명입니다. 작업물에 대한 설명입니다. 작업물에 대한 설명입니다. 작업물에 대한 설명입니다. 작업물에 대한 설명입니다. ",
            isRep: 0,
            CategoryInfoValue: {
              workId: 2,
              mediaClassification: "외화",
              voiceTone: "저음",
              voiceStyle: "어두운",
              gender: "여성",
              age: "노년",
            },
          },
        ]);
      }, 1000)
    );
  };

  const { data: works } = useQuery({
    queryKey: ["works"],
    // queryFn: fetchWorks,
    queryFn: mockFetchWorks,
  });

  useEffect(() => {
    if (works) {
      setWorkCount(works.length);
    }
  }, [works]);

  const currentWorks = works
    ? works.slice(indexOfFirstWork, indexOfLastWork)
    : [];

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setActivePage(value);
  };

  return (
    <>
      <CreateWorkButton onClick={handleClick}>작업물 추가</CreateWorkButton>
      <WorkModal
        open={open}
        onClose={handleClose}
        role="create"
        voiceId={voiceId}
        workId={0}
      />
      <WorksGrid>
        {currentWorks ? (
          currentWorks.map((work) => (
            <WorkTemplate key={work.workId} work={work} />
          ))
        ) : (
          <p>
            아직 작업물이 없습니다. 하입보이스에서 당신의 목소리를 들려주세요!
          </p>
        )}
      </WorksGrid>
      <PaginationContainer>
        {" "}
        <Pagination
          count={Math.ceil(works ? works.length / worksPerPage : 0)}
          page={activePage}
          onChange={handlePageChange}
        />
      </PaginationContainer>
    </>
  );
}

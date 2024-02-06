import styled from "styled-components";
import SearchComponent from "./SearchComponent";

const HomeGridDiv = styled.div`
  height: 90vh;
  background-color: #f5f5f5;
`;

export default function HomeGrid() {
  console.log("홈이다!");

  return (
    <HomeGridDiv>
      <SearchComponent />
    </HomeGridDiv>
  );
}

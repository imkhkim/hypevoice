import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { axiosClient } from "@/api/axios";
import { useRecoilValue } from "recoil";
import { MyInfoVoiceId } from "@/recoil/CurrentVoiceId/MyInfoVoiceId";
import { getCookie } from "@/api/cookie";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

type VoiceDataType = {
  name: string;
  imageUrl: string;
  intro: string;
  email: string;
  phone: string;
  addInfo: string;
  likes: number;
};

const getVoiceData = async (voiceId: number): Promise<VoiceDataType> => {
  const response = await axiosClient.get(`/api/voices/${voiceId}`);
  console.log(response.data);
  return response.data;
};

const registerLike = async (
  voiceId: number,
  accessToken: string
): Promise<void> => {
  try {
    const response = await axiosClient.post(
      `/api/voices/${voiceId}/likes`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response.data);
  } catch (error) {
    alert("내 보이스의 좋아요는 누를 수 없습니다.");
    console.error(error);
  }
};

const deleteLike = async (
  voiceId: number,
  accessToken: string
): Promise<void> => {
  try {
    const response = await axiosClient.delete(`/api/voices/${voiceId}/likes`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

const checkLike = async (
  voiceId: number,
  accessToken: string
): Promise<boolean> => {
  try {
    const response = await axiosClient.get(`/api/voices/${voiceId}/likes`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};



function MyInfo() {
  const currentVoiceId = useRecoilValue(MyInfoVoiceId);
  const [favoriteCnt, setFavoriteCnt] = useState(0);
  const [currentVoice, setCurrentVoice] = useState<VoiceDataType | null>(null);

  useEffect(() => {
    const fetchVoiceData = async () => {
      try {
        const voiceData = await getVoiceData(currentVoiceId);
        setCurrentVoice(voiceData);
        setFavoriteCnt(voiceData.likes);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVoiceData();
  }, [currentVoiceId]);

  const updateLike = async () => {
    const accessToken = getCookie("access_token");
    const isLiked = await checkLike(currentVoiceId, accessToken);
    if (isLiked) {
      await deleteLike(currentVoiceId, accessToken);
    } else {
      await registerLike(currentVoiceId, accessToken);
    }
    // Refresh the favorite count and the current voice data
    const voiceData = await getVoiceData(currentVoiceId);
    setCurrentVoice(voiceData);
    setFavoriteCnt(voiceData.likes);
  }

  return (
    <>
      <Paper
        sx={{
          p: 2,
          margin: "auto",
          maxWidth: 500,
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        }}
      >
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 128 }}>
              <Img alt="profileImg" src={currentVoice?.imageUrl} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h4" component="div">
                  {currentVoice?.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Email : {currentVoice?.email}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Call : {currentVoice?.phone}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {currentVoice?.addInfo}
                </Typography>
              </Grid>
              <></>
            </Grid>
            <Grid item>
              <FavoriteIcon
                color="error"
                fontSize="large"
                onClick={updateLike}
              />
              <span>{favoriteCnt}</span>
            </Grid>
          </Grid>
        </Grid>
        <Typography
          variant="body2"
          sx={{ textAlign: "center", marginTop: "1rem" }}
        >
          {currentVoice?.intro}
        </Typography>
      </Paper>
    </>
  );
}

export default MyInfo;
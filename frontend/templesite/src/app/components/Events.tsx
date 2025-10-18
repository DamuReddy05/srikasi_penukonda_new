import React from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Container,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircleFilled";
import YouTube from "react-youtube";

const data = [
  {
    title: "e-Hundi",
    desc: "e-Hundi allows donations from people across the globe for the welfare of the sacred Srisailam. Devotees can offer their donations via internet banking.",
    button: "Donate Now",
    color: "#fddbb0",
    action: () => alert("Donate Now clicked for e-Hundi"),
  },
  // {
  //   title: "Paroksha Seva",
  //   desc: "In a world, that's filled with the essence of Shiva, one can now wholeheartedly worship Sri Mallikarjuna Swamy and Bhramarambika Devi from anywhere in the world.",
  //   button: "Book Now",
  //   color: "#fddbb0",
  //   action: () => alert("Book Now clicked for Paroksha Seva"),
  // },
  {
    title: "AnnaPrasadam",
    desc: "Offering one Annadhanam is equals to donating 1000 elephants, a crore cows, gold and land that extends until seashore; fulfilling all duties of a family.",
    button: "Donate Now",
    color: "#f28b1d",
    action: () => alert("Donate Now clicked for AnnaPrasadam"),
  },
  {
    title: "Accommodation",
    desc: "Comfortable and hygienic AC/Non AC Rooms, Cottages, Guest Houses, Hotels with all amenities to accommodate pilgrims on holy Srisailam Hills.",
    button: "Book Now",
    color: "#392ca2",
    action: () => alert("Book Now clicked for Accommodation"),
    textColor: "#fff",
  },
];

export default function SrisailaTemplate() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const videoOptions = {
    width: "100%",
    height: isMobile ? "200" : "315",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <Box>
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", sm: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems="stretch"
        >
          {data.map((item, i) => (
            <Box
              key={i}
              bgcolor={item.color}
              p={3}
              flex={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ minHeight: 250, borderRadius: 2 }}
            >
              <Card
                elevation={0}
                sx={{
                  bgcolor: "transparent",
                  color: item.textColor || "inherit",
                  width: "100%",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" mb={2}>
                    {item.desc}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={item.action}
                    color="primary"
                  >
                    {item.button}
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Stack>
      </Container>

      <Box bgcolor="#392ca2" color="#fff" py={5} px={3} mt={4}>
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box flex={1}>
              <img
                src="/images/logo.png"
                alt="Srisaila Logo"
                width={50}
                height={50}
                style={{ marginBottom: 16 }}
              />
              <Typography variant="h5" gutterBottom>
                Srisaila TV
              </Typography>
              <Typography variant="body1" mb={2}>
                Srisaila TV is a 24 x 7 Webcast devotional channel in Telugu
                which caters to the people of Hindu religion. It was launched on
                March,2017. It is from Srisaila Devasthanam Product.
              </Typography>
              <Typography variant="body2" mb={2}>
                It’s south India’s first, Lord Shiva’s devotional channel on
                Telugu. The channel telecasts fiction and non-fiction programs.
              </Typography>
              <Button
                variant="contained"
                color="warning"
                endIcon={<PlayCircleIcon />}
              >
                Watch Now
              </Button>
            </Box>

            <Box flex={1}>
              <YouTube videoId="bgyVTq7Xa64" opts={videoOptions} />
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

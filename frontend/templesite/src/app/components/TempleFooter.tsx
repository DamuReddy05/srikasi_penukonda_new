import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
  Stack,
  Link,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Image from "next/image";
import VerticalLine from "./VerticalLine";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import PhoneIcon from "@mui/icons-material/Phone";
import PrintIcon from "@mui/icons-material/Print";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

export default function TempleFooter() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box bgcolor="#362b82" color="white" py={4} width={"100%"}>
      <Container>
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          direction={isSmallScreen ? "column" : "row"}
          pl={20}
          pr={20}
        >
          <Grid item>
            <Typography variant="h6">Download Mobile App</Typography>
            <Box
              display="flex"
              gap={2}
              mt={1}
              flexDirection={isSmallScreen ? "column" : "row"}
            >
              <Image
                src="/images/google-play-badge.png"
                alt="Google Play"
                width={135}
                height={40}
              />
              <Image
                src="/images/app-store-badge.png"
                alt="App Store"
                width={135}
                height={40}
              />
            </Box>
          </Grid>
          <VerticalLine />
          <Grid item>
            <Typography variant="h6">Subscribe Newsletter</Typography>
            <Box
              display="flex"
              alignItems="center"
              mt={1}
              flexDirection={isSmallScreen ? "column" : "row"}
            >
              <TextField
                placeholder="Email Address"
                size="small"
                variant="outlined"
                fullWidth={isSmallScreen}
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  mr: isSmallScreen ? 0 : 1,
                  mb: isSmallScreen ? 1 : 0,
                  input: { padding: "10px" },
                }}
              />
              <IconButton
                sx={{
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "#ddd" },
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Box bgcolor="#efefef" color="text.primary" mt={4}>
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={6}
            justifyContent="space-between"
            py={6}
          >
            {/* Columns Section */}
            {[
              {
                title: "About",
                links: [
                  "Overview",
                  "The Temple",
                  "The Temple Story",
                  "General Information",
                ],
              },
              {
                title: "Sevas & Darshanam",
                links: [
                  "Overview",
                  "Darshanam",
                  "Paroksha Seva",
                  "Pratyaksha Seva",
                ],
              },
              {
                title: "Donations",
                links: [
                  "Overview",
                  "e-Hundi",
                  "AnnaPrasadam Trust",
                  "Agama Patasala Trust",
                  "GoSamrakshana Trust",
                  "Pranadana Trust",
                  "Srisaila TV",
                  "Swachh Srisailam",
                ],
              },
              {
                title: "Online Booking",
                links: [
                  "Overview",
                  "Pratyaksha Seva Booking",
                  "Paroksha Seva Booking",
                  "Darshanam Tickets",
                  "Donations",
                  "Accommodation",
                  "Publications",
                ],
              },
              {
                title: "Media Room",
                links: [
                  "Overview",
                  "Media Kit",
                  "Gallery",
                  "Whats New",
                  "Press",
                  "Tenders",
                  "RTI Act",
                ],
              },
              {
                title: "Support",
                links: [
                  "Overview",
                  "FAQs",
                  "Facilities to Pilgrims",
                  "Connectivity",
                  "Contact Us",
                ],
              },
            ].map((section) => (
              <Box key={section.title}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  gutterBottom
                  color="primary"
                >
                  {section.title}
                </Typography>
                <Stack spacing={1}>
                  {section.links.map((link) => (
                    <Link
                      key={link}
                      href="#"
                      underline="none"
                      color="text.secondary"
                    >
                      {link}
                    </Link>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ my: 4 }} />

          {/* Contact Section */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={4}
            flexWrap="wrap"
            py={2}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <LocationOnIcon />
              <Typography>
                Srisaila Devasthanam,
                <br />
                Srisailam – 518101, Kurnool (Dist.), Andhra Pradesh, India.
              </Typography>
            </Stack>

            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmailIcon />
                <Typography>endo​w-eosri@gov.in</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LanguageIcon />
                <Typography>www.srisailadevasthanam.org</Typography>
              </Stack>
            </Stack>

            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PhoneIcon />
                <Typography>+91-8333901351 /2 /3 /4 /5 /6</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PrintIcon />
                <Typography>+91-8524-287126</Typography>
              </Stack>
            </Stack>
          </Stack>

          <Divider sx={{ my: 4 }} />
          {/* Stats Section */}
          <Box
            sx={{
              flex: 1,
              backgroundImage: "url(images/footer-bottom-strip.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "140px",
              p: 0,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-around"
              spacing={4}
              py={2}
            >
              <Typography fontWeight={600}>
                Total Visitors{" "}
                <Box
                  component="span"
                  sx={{
                    bgcolor: "#333",
                    color: "#fff",
                    px: 1,
                    borderRadius: 1,
                  }}
                >
                  12015545
                </Box>
              </Typography>
              <Typography fontWeight={600}>
                Todays Visitors{" "}
                <Box
                  component="span"
                  sx={{
                    bgcolor: "#333",
                    color: "#fff",
                    px: 1,
                    borderRadius: 1,
                  }}
                >
                  3251
                </Box>
              </Typography>
            </Stack>
          </Box>

          {/* Bottom Row */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            //spacing={2}
            py={2}
          >
            <Typography variant="body2" color="text.secondary">
              © 2025 Srisaila Devasthanam,&nbsp;
              <Link href="#" underline="hover">
                Privacy Policy
              </Link>{" "}
              &nbsp;|&nbsp;
              <Link href="#" underline="hover">
                Terms & Conditions
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Developed by <strong>########</strong>
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton>
                <FacebookIcon />
              </IconButton>
              <IconButton>
                <InstagramIcon />
              </IconButton>
              <IconButton>
                <YouTubeIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

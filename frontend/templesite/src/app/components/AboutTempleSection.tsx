"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import Image from "next/image";

const AboutTempleSection = () => {
  return (
    <Box sx={{ flexGrow: 1, px: 2, py: 4 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems="stretch"
      >
        {/* Left Content - About */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: "url(images/about-srisailam-bg.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: { xs: 2, md: 6 },
            py: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="primary">
            About
          </Typography>
          <Typography
            variant="h4"
            fontWeight={600}
            gutterBottom
            color="primary"
          >
            Srisailam
          </Typography>
          <Typography variant="body1" color="text.primary" gutterBottom>
            Srisaila Mahakshetram is considered as Kailasa on Earth. The history
            and tradition have it that the merits earned by visiting Srisailam
            are equal to worshipping all the divine powers the universe holds.
          </Typography>
          <Typography variant="body1" color="text.primary" mb={2} mt={4}>
            Srisaila Mahakshetram is the living embodiment of ancient and
            spiritual-cultural traditions and values. Visited by all great
            saints and rulers namely, Sri Rama, Adi Shankaracharya and several
            other spiritual personalities; Srisailam is the supreme repository
            of spiritual truth.
          </Typography>
          <Button
            variant="contained"
            sx={{ width: "fit-content", mt: 2, bgcolor: "#f58220" }}
          >
            Read More →
          </Button>
        </Box>

        {/* Right Content - Sevas and Offerings */}
        <Stack direction="column" spacing={2} flex={1}>
          {/* Pratyaksha Seva */}
          <Box
            sx={{
              bgcolor: "#f58220",
              color: "#fff",
              p: 4,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Image
              src="/images/fire-icon.png"
              alt="Seva"
              width={40}
              height={40}
            />
            <Typography variant="h6" mt={2}>
              Pratyaksha Seva
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: "#fff",
                color: "#f58220",
                fontWeight: 600,
              }}
            >
              View →
            </Button>
          </Box>

          {/* Main Offerings */}
          <Box
            sx={{
              bgcolor: "#2e3192",
              color: "#fff",
              p: 4,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Image
              src="/images/offerings-icon.png"
              alt="Offerings"
              width={40}
              height={40}
            />
            <Typography variant="h6" mt={2}>
              Main Offerings
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: "#fff",
                color: "#2e3192",
                fontWeight: 600,
              }}
            >
              View →
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AboutTempleSection;

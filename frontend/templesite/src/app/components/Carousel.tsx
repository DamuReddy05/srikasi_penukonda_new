"use client";

import { useState, useEffect } from "react";
import { Box, IconButton, MobileStepper } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import Image from "next/image";

interface CarouselProps {
  images: string[];
  interval?: number;
}

export default function Carousel({ images, interval = 4000 }: CarouselProps) {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prev) => (prev - 1 + maxSteps) % maxSteps);
  };

  useEffect(() => {
    const timer = setInterval(handleNext, interval);
    return () => clearInterval(timer);
  }, [activeStep, interval]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        mx: "auto",
        position: "relative",
        maxWidth: "100%",
        padding: "10px 10px 20px",
      }}
    >
      {/* Image Container */}
      <Box
        sx={{
          height: { xs: 200, sm: 300, md: 400, lg: 500 },
          width: "100%",
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Image
          src={images[activeStep]}
          alt={`Slide ${activeStep + 1}`}
          layout="fill"
          objectFit="cover"
          sizes="100vw"
          priority
        />

        {/* Left Arrow */}
        <IconButton
          onClick={handleBack}
          sx={{
            position: "absolute",
            top: "50%",
            left: { xs: 10, sm: 20, md: 40 },
            transform: "translateY(-50%)",
            bgcolor: "rgba(255, 255, 255, 0.5)",
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.8)" },
            zIndex: 1,
          }}
        >
          <KeyboardArrowLeft />
        </IconButton>

        {/* Right Arrow */}
        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            top: "50%",
            right: { xs: 10, sm: 20, md: 40 },
            transform: "translateY(-50%)",
            bgcolor: "rgba(255, 255, 255, 0.5)",
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.8)" },
            zIndex: 1,
          }}
        >
          <KeyboardArrowRight />
        </IconButton>
      </Box>

      {/* Dots Stepper */}
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        sx={{
          justifyContent: "center",
          mt: 1,
          background: "transparent",
        }}
        nextButton={null}
        backButton={null}
      />
    </Box>
  );
}

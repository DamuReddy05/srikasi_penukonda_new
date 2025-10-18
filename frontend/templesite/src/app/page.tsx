"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Link,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MenuIcon from "@mui/icons-material/Menu";
import Carousel from "./components/Carousel";
import Events from "./components/Events";
import Gallary from "./components/Gallary";
import AboutTempleSection from "./components/AboutTempleSection";
import TempleFooter from "./components/TempleFooter";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const imageUrls = [
    "/images/img1.jpg",
    "/images/img2.jpg",
    "/images/img3.jpg",
    "/images/img4.jpg",
    "/images/img5.jpg",
    "/images/img6.jpg",
  ];

  const navLinks = [
    "About",
    "Sevas & Darshanam",
    "Donations",
    // "Online Booking",
    // "Media Room",
    // "Support",
    "Volunteer",
    // "Shop",
  ];

  return (
    <>
      <Box>
        {/* Top Bar */}
        {/* <Box
          bgcolor="#2d208e"
          color="white"
          py={1}
          px={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ xs: "column", sm: "row" }}
          textAlign={{ xs: "center", sm: "left" }}
          gap={1}
        >
          <Typography variant="body2">
            Tuesday, 15 April 2025 – 01:43 PM
          </Typography>
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Typography variant="body2">SRISAILA TV</Typography>
            <Typography variant="body2">ENGLISH</Typography>
            <Typography variant="body2">PRINT A TICKET</Typography>
            <Typography variant="body2">SIGN IN / SIGN UP</Typography>
          </Box>
        </Box> */}

        {/* Header */}
        <AppBar position="static" sx={{ bgcolor: "#f68c1f" }}>
          <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
            <Box display="flex" alignItems="center" gap={2}>
              <img
                src="https://www.srisailadevasthanam.org/static/media/Logo-circle.8bc79b53.png"
                alt="Logo"
                height={50}
                width={50}
              />
              <Box display={{ xs: "none", sm: "block" }}>
              <Typography fontSize={20} lineHeight="23px" color="#002147">
                Sri Kasi Visweswara Swamy Vari
              </Typography>
              <Typography fontSize={20} lineHeight="23px" color="#002147">
                Devasthanam - Penukonda
              </Typography>

                {/* <Typography fontSize={15} lineHeight="16px">
                Penukonda
                </Typography> */}
              </Box>
            </Box>

            {/* Desktop Navigation */}
            <Box
              display={{ xs: "none", md: "flex" }}
              gap={3}
              alignItems="center"
            >
              {navLinks.map((text) => (
                <Link key={text} color="inherit" underline="none">
                  {text}
                </Link>
              ))}
              <ShoppingCartIcon />
              <SearchIcon />
            </Box>

            {/* Mobile Menu Icon */}
            <Box display={{ xs: "flex", md: "none" }}>
              <IconButton
                color="inherit"
                onClick={() => setDrawerOpen(true)}
                edge="end"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box
            width={250}
            role="presentation"
            onClick={() => setDrawerOpen(false)}
            onKeyDown={() => setDrawerOpen(false)}
          >
            <List>
              {navLinks.map((text) => (
                <ListItem button key={text}>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
              <Divider />
              <ListItem button>
                <ShoppingCartIcon sx={{ marginRight: 1 }} />
                <ListItemText primary="Cart" />
              </ListItem>
              <ListItem button>
                <SearchIcon sx={{ marginRight: 1 }} />
                <ListItemText primary="Search" />
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* Carousel */}
        <Carousel images={imageUrls} interval={3000} />

        {/* News Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={{ xs: 2, sm: 4 }}
          py={2}
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
          borderTop="1px solid #eee"
        >
          <Typography
            variant="body1"
            fontWeight="bold"
            color="orange"
            textAlign={{ xs: "center", sm: "left" }}
          >
            Temple News
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            flexDirection={{ xs: "column", sm: "row" }}
          >
            {/* <Link href="#" underline="hover" color="primary">
              Paroksha Seva
            </Link> */}
            <Button
              variant="contained"
              sx={{ bgcolor: "#f68c1f" }}
              endIcon={<ArrowForwardIosIcon />}
            >
              View All
            </Button>
          </Box>
        </Box>
      </Box>
      {/* Events */}
      <Events />
      <AboutTempleSection />
      <Gallary />
      <TempleFooter />
    </>
  );
}

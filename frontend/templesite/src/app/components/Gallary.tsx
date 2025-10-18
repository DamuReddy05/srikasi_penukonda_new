import { Box, Typography, Button, Card, CardMedia } from "@mui/material";

const galleryImages = [
  "/images/gallery/g1.png",
  "/images/gallery/g2.png",
  "/images/gallery/g3.png",
  "/images/gallery/g4.png",
  "/images/gallery/g5.png",
  "/images/gallery/g6.png",
  "/images/gallery/g7.png",
  "/images/gallery/g8.png",
];

export default function GallerySection() {
  return (
    <Box sx={{ py: 6, px: { xs: 2, md: 6 } }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h5" color="primary" gutterBottom>
          Photo Gallery
        </Typography>
        <Typography variant="subtitle1">
          The Beauty of Sacred Srisailam
        </Typography>
      </Box>

      {/* Horizontally scrollable on small screens */}
      <Box
        sx={{
          overflowX: "auto",
          display: "flex",
          gap: 3,
          flexWrap: { xs: "nowrap", md: "wrap" },
          justifyContent: { xs: "flex-start", md: "center" },
        }}
      >
        {Array.from({ length: 4 }).map((_, colIndex) => (
          <Box
            key={colIndex}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {[0, 1].map((rowIndex) => {
              const imgIndex = colIndex * 2 + rowIndex;
              const img = galleryImages[imgIndex];

              return (
                <Card
                  key={imgIndex}
                  sx={{
                    width: { xs: 200, md: 250 },
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={img}
                    alt={`Gallery Image ${imgIndex + 1}`}
                    sx={{ objectFit: "cover" }}
                  />
                </Card>
              );
            })}
          </Box>
        ))}
      </Box>

      <Box textAlign="center" mt={5}>
        <Button variant="contained" color="warning">
          View All
        </Button>
      </Box>
    </Box>
  );
}

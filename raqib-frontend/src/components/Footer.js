import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box sx={{marginTop: 'auto', backgroundColor: '#f5f5f5', padding: 5 }}>
      <Typography variant="body2" align="center">
        © {new Date().getFullYear()} Item Management App. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;

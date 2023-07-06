import React from 'react';
import { Box, Typography } from '@mui/material';
import '../App.css'
function Footer() {
  return (
<Box className="footer-container" sx={{marginTop: 'auto', backgroundColor: '#f5f5f5', padding: 10 }}>
  <Typography variant="body2" align="center">
    © {new Date().getFullYear()} Indian Export House. All rights reserved.
  </Typography>
</Box>
  );
}

export default Footer;

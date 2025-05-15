
// Then update your Navbar.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  LibraryBooks as LibraryBooksIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import Logo from './Logo';  // Import the Logo component

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const username = localStorage.getItem('username');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (location.pathname === '/login' || !token) return null;

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        backgroundColor: 'rgba(227, 242, 253, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Logo height={70} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Search Recipes">
            <Button
              variant="text"
              startIcon={<SearchIcon />}
              onClick={() => navigate('/recipes')}
              sx={{ color: 'text.primary' }}
            >
              Search
            </Button>
          </Tooltip>

          {userRole === 'chef' && (
            <>
              <Tooltip title="Create Recipe">
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/create-recipe')}
                  sx={{ mx: 1 }}
                >
                  Create
                </Button>
              </Tooltip>

              <Tooltip title="My Recipes">
                <IconButton 
                  onClick={() => navigate('/my-recipes')}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    }
                  }}
                >
                  <LibraryBooksIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Notifications">
                <IconButton 
                  onClick={() => navigate('/notifications')}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    }
                  }}
                >
                  <Badge 
                    badgeContent={4} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: 'error.main',
                        color: 'error.contrastText',
                      }
                    }}
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </>
          )}

          <Tooltip title="Account">
            <IconButton 
              onClick={handleMenu}
              sx={{
                ml: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main',
                  width: 32,
                  height: 32,
                  fontSize: '1rem'
                }}
              >
                {username?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{ mt: 1 }}
            PaperProps={{
              elevation: 2,
              sx: {
                minWidth: 200,
                borderRadius: 2,
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
                mt: 1.5,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Signed in as
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {username}
              </Typography>
            </Box>
            <Divider />
            <MenuItem 
              onClick={() => {
                handleClose();
                handleLogout();
              }}
              sx={{ 
                color: 'error.main',
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'error.lighter',
                }
              }}
            >
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
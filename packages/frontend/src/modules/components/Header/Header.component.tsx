import React from 'react';
import { SPACES } from '../../theme';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import {
  Box,
  Menu,
  Button,
  AppBar,
  Avatar,
  Toolbar,
  Tooltip,
  MenuItem,
  Container,
  IconButton,
  Typography,
} from '@mui/material';

import { ThemeToggle } from '../../UI';
import { ROUTER_KEYS } from '../../constants';
import { AddParentForm, AddChildForm } from '..';
import { getRole, getUserName } from '../../utils';

export const Header = () => {
  const [isAddChildFormOpen, setAddChildFormOpen] = React.useState(false);
  const [isAddParentFormOpen, setAddParentFormOpen] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const role = getRole();
  const navigate = useNavigate();
  const userName = getUserName()!;

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ marginBottom: SPACES.l }}>
      <Container>
        <Toolbar disableGutters>
          <CreditCardOutlinedIcon
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
          />
          <Typography
            noWrap
            variant="h6"
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'inherit',
              letterSpacing: '.3rem',
              textDecoration: 'none',
              fontFamily: 'Anta, monospace',
              display: { xs: 'none', md: 'flex' },
            }}
          >
            Budgeting App
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              color="inherit"
              aria-haspopup="true"
              aria-controls="menu-appbar"
              onClick={handleOpenNavMenu}
              aria-label="account of current user"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              keepMounted
              id="menu-appbar"
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuItem onClick={() => navigate(ROUTER_KEYS.HOME)}>
                <Typography textAlign="center">Home</Typography>
              </MenuItem>
              {role?.includes('parent') && (
                <MenuItem onClick={() => navigate(ROUTER_KEYS.STATS_DASHBOARD)}>
                  <Typography textAlign="center">
                    Statistics dashboard
                  </Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
          <CreditCardOutlinedIcon
            sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              letterSpacing: '.3rem',
              textDecoration: 'none',
              fontFamily: 'monospace',
              display: { xs: 'flex', md: 'none' },
            }}
          >
            BA
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              variant="text"
              onClick={() => navigate(ROUTER_KEYS.HOME)}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Home
            </Button>
            {role?.includes('parent') && (
              <Button
                variant="text"
                sx={{ my: 2, color: 'white', display: 'block' }}
                onClick={() => navigate(ROUTER_KEYS.STATS_DASHBOARD)}
              >
                Statistics Dashboard
              </Button>
            )}
          </Box>
          <ThemeToggle />

          <Box sx={{ flexGrow: 0, ml: SPACES.m }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={userName} src="/static/images/avatar/.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              keepMounted
              id="menu-appbar"
              sx={{ mt: '45px' }}
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem sx={{ bgcolor: 'secondary.contrastText' }}>
                <Typography textAlign="center">
                  Logged in as {userName}
                </Typography>
              </MenuItem>
              <MenuItem onClick={() => navigate(ROUTER_KEYS.LOGIN)}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
              <MenuItem onClick={() => setAddChildFormOpen(true)}>
                <Typography textAlign="center">Add child</Typography>
              </MenuItem>
              <MenuItem onClick={() => setAddParentFormOpen(true)}>
                <Typography textAlign="center">Add parent</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
        <AddChildForm
          isOpen={isAddChildFormOpen}
          setOpen={setAddChildFormOpen}
        />
        <AddParentForm
          isOpen={isAddParentFormOpen}
          setOpen={setAddParentFormOpen}
        />
      </Container>
    </AppBar>
  );
};

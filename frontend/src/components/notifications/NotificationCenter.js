// src/components/notifications/NotificationCenter.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Badge,
  Divider,
  Box,
  Alert,
  Button,
} from '@mui/material';
import {
  Favorite as LikeIcon,
  Star as RatingIcon,
  CheckCircle as ReadIcon,
  RadioButtonUnchecked as UnreadIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      console.log('Fetching notifications...');
      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'Token exists' : 'No token');

      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Received data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch notifications');
      }

      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTestNotification = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notifications/test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to create test notification');
      }

      // Refresh notifications
      fetchNotifications();
    } catch (err) {
      console.error('Error creating test notification:', err);
      setError(err.message);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      setNotifications(notifications.map(notif =>
        notif.notification_id === notificationId
          ? { ...notif, is_read: true }
          : notif
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading notifications...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              Notifications
            </Typography>
            <Button 
              variant="contained" 
              onClick={createTestNotification}
              size="small"
            >
              Create Test Notification
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {notifications.length === 0 ? (
            <Alert severity="info">
              No notifications yet
            </Alert>
          ) : (
            <List>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.notification_id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => markAsRead(notification.notification_id)}
                      >
                        {notification.is_read ? <ReadIcon color="disabled" /> : <UnreadIcon color="primary" />}
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      {notification.type === 'like' ? (
                        <Badge color="error" variant="dot">
                          <LikeIcon color="error" />
                        </Badge>
                      ) : (
                        <Badge color="warning" variant="dot">
                          <RatingIcon color="warning" />
                        </Badge>
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.message}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textSecondary"
                          >
                            {new Date(notification.created_at).toLocaleString()}
                          </Typography>
                          <Box
                            component="span"
                            sx={{ 
                              cursor: 'pointer', 
                              color: 'primary.main',
                              ml: 2,
                              '&:hover': { textDecoration: 'underline' }
                            }}
                            onClick={() => navigate(`/recipe/${notification.recipe_id}`)}
                          >
                            View Recipe
                          </Box>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default NotificationCenter;
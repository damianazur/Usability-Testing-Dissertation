import {NotificationContainer, NotificationManager} from 'react-notifications';

export function createNotification(type, message) {
  switch (type) {
    case 'info':
      alert = NotificationManager.info(message, 'Info', 3000);
      break;
    case 'success':
      alert = NotificationManager.success(message, 'Success', 3000);
      break;
    case 'warning':
      alert = NotificationManager.warning(message, 'Warning', 3000);
      break;
    case 'error':
      alert = NotificationManager.error(message, 'Error', 5000, () => {
        console.log("Error callback");
      });
      break;
  }
}
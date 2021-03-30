import {NotificationContainer, NotificationManager} from 'react-notifications';

export function CreateNotification(type, message) {
  switch (type) {
    case 'info':
      alert = NotificationManager.info(message, 'Info', 5000);
      break;
    case 'success':
      alert = NotificationManager.success(message, 'Success', 5000);
      break;
    case 'warning':
      alert = NotificationManager.warning(message, 'Warning', 5000);
      break;
    case 'error':
      alert = NotificationManager.error(message, 'Error', 10000, () => {
        // console.log("Error callback");
      });
      break;
  }
}

export function HandleServerError(error) {
  const resMessage = (
    error.response &&
    error.response.data &&
    error.response.data.message) || 
    error.message ||
    error.toString();
  
  CreateNotification("error", error.response.data.toString());
}
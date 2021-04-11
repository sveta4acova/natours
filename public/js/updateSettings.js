import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const url = type === 'password' ? 'http://localhost:8000/api/v1/users/update-my-password' : 'http://localhost:8000/api/v1/users/update-me'
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`)
    }
  } catch(e) {
    showAlert('error', e.response.data.message);
  }
}
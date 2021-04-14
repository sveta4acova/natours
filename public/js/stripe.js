import axios from 'axios';
const stripe = Stripe('pk_test_7owdiRfoKIZ2kR5URlCRsTUu00JIRYzDVQ');
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    // 1. Get checkout session from API
    const session = await axios(
      `http://localhost:8000/api/v1/booking/checkout-session/${tourId}`
    );

    // 2. Create checkout form + charge credit card
    // тестовые данные карточки - 4242 4242 4242 4242 , cvc - любые три цифры, дата будущая любая
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (e) {
    showAlert('error', 'Payment fail. Please try again');
  }
};

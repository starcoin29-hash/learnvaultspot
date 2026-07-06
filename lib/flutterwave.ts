interface PaymentDetails {
  txRef: string;
  amount: number;
  currency?: string;
  email: string;
  name: string;
  bookTitle: string;
  redirectUrl: string;
}

interface FlutterwavePaymentResponse {
  status: string;
  message: string;
  data: {
    link: string;
  };
}

interface FlutterwaveVerifyResponse {
  status: string;
  message: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string;
    customer: {
      id: number;
      name: string;
      email: string;
      phone_number: string | null;
      created_at: string;
    };
    payment_type: string;
    status: string; // "successful" or "failed"
    created_at: string;
  };
}

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY || '';

/**
 * Initializes a payment link with Flutterwave Standard Checkout API.
 * Returns the checkout link that the customer should be redirected to.
 */
export async function initializeFlutterwavePayment(details: PaymentDetails): Promise<string> {
  const currency = details.currency || 'NGN';
  
  try {
    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: details.txRef,
        amount: details.amount,
        currency: currency,
        redirect_url: details.redirectUrl,
        customer: {
          email: details.email,
          name: details.name,
        },
        customizations: {
          title: 'Learn Vault Store',
          description: `Payment for digital book: "${details.bookTitle}"`,
          logo: `${process.env.NEXT_PUBLIC_APP_URL}/favicon.ico`,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Flutterwave payment initialization failed: ${response.statusText}. Details: ${errorText}`);
    }

    const data = (await response.json()) as FlutterwavePaymentResponse;
    if (data.status !== 'success' || !data.data.link) {
      throw new Error(`Flutterwave payment link not generated. Response: ${JSON.stringify(data)}`);
    }

    return data.data.link;
  } catch (error) {
    console.error('Error initializing Flutterwave payment:', error);
    throw error;
  }
}

/**
 * Verifies a transaction on Flutterwave using the transaction ID.
 */
export async function verifyFlutterwaveTransaction(transactionId: string): Promise<FlutterwaveVerifyResponse['data']> {
  try {
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Flutterwave verification request failed: ${response.statusText}. Details: ${errorText}`);
    }

    const data = (await response.json()) as FlutterwaveVerifyResponse;
    if (data.status !== 'success' || !data.data) {
      throw new Error(`Flutterwave transaction verification unsuccessful: ${data.message}`);
    }

    return data.data;
  } catch (error) {
    console.error('Error verifying Flutterwave transaction:', error);
    throw error;
  }
}

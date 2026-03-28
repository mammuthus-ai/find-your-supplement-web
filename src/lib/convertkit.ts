const CONVERTKIT_API_URL = 'https://api.convertkit.com/v3/forms';

// Replace these with your actual ConvertKit form IDs
const FORM_IDS = {
  quizResults: process.env.NEXT_PUBLIC_CK_QUIZ_FORM_ID || '9258584',
  leadMagnet: process.env.NEXT_PUBLIC_CK_LEADMAGNET_FORM_ID || '9258594',
};

type FormType = keyof typeof FORM_IDS;

interface SubscribeOptions {
  email: string;
  formType: FormType;
  fields?: Record<string, string>;
  tags?: string[];
}

export async function subscribeToConvertKit({ email, formType, fields }: SubscribeOptions): Promise<boolean> {
  const formId = FORM_IDS[formType];

  try {
    const res = await fetch(`${CONVERTKIT_API_URL}/${formId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.NEXT_PUBLIC_CK_API_KEY || '1m1e06xqAorPNEJV_Y8Jyg',
        email,
        fields,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

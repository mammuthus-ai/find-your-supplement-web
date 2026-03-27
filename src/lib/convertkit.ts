const CONVERTKIT_API_URL = 'https://api.convertkit.com/v3/forms';

// Replace these with your actual ConvertKit form IDs
const FORM_IDS = {
  quizResults: process.env.NEXT_PUBLIC_CK_QUIZ_FORM_ID || 'YOUR_QUIZ_FORM_ID',
  leadMagnet: process.env.NEXT_PUBLIC_CK_LEADMAGNET_FORM_ID || 'YOUR_LEADMAGNET_FORM_ID',
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

  if (formId.startsWith('YOUR_')) {
    console.warn('ConvertKit form ID not configured. Set NEXT_PUBLIC_CK_QUIZ_FORM_ID or NEXT_PUBLIC_CK_LEADMAGNET_FORM_ID.');
    return true; // Return true in dev so UI still works
  }

  try {
    const res = await fetch(`${CONVERTKIT_API_URL}/${formId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.NEXT_PUBLIC_CK_API_KEY || '',
        email,
        fields,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

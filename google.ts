import { JWT } from 'google-auth-library';

export function fetchTranslation(text: string) {
  const JWTClient = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: String(process.env.GOOGLE_PRIVATE_KEY).replace(/\\n/gm, '\n'),
    scopes: [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/cloud-translation',
    ],
  });

  return JWTClient.request<GoogleAPIResponse>({
    url: `https://translate.googleapis.com/v3/projects/${process.env.GOOGLE_PROJECT_NUMBER}/locations/us-central1:translateText`,
    method: 'POST',
    data: createGoogleAPIRequestBody(),
  });

  function createGoogleAPIRequestBody() {
    return {
      contents: text,
      mimeType: 'text/plain',
      sourceLanguageCode: 'en',
      targetLanguageCode: 'ko',
      glossaryConfig: {
        glossary: `projects/${process.env.GOOGLE_PROJECT_NUMBER}/locations/us-central1/glossaries/${process.env.GOOGLE_GLOSSARY_ID}`,
      },
    };
  }
}

interface GoogleAPIResponse {
  translations: [
    {
      translatedText: string;
    }
  ];
  glossaryTranslations: [
    {
      translatedText: string;
      glossaryConfig: {
        glossary: string;
        ignoreCase: boolean;
      };
    }
  ];
}

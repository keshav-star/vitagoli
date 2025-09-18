import { SendMailClient } from "zeptomail";

const ZEPTO_API_KEY = process.env.ZEPTO_API_KEY;
const ZEPTO_URL = "https://api.zeptomail.in/";

if (!ZEPTO_API_KEY) {
  throw new Error('Missing ZeptoMail configuration in environment variables');
}


type EmailParams = {
  to: string;
  score: number;
  recommendation: string;
};

type ZeptoEmailResponse = {
  message: string;
  request_id: string;
};

export async function sendQuizResultEmail({ to, score, recommendation }: EmailParams): Promise<ZeptoEmailResponse> {
  if (!ZEPTO_API_KEY) {
    throw new Error('ZEPTO_API_KEY is required');
  }

  try {
    const client = new SendMailClient({
      url: ZEPTO_URL,
      token: ZEPTO_API_KEY
    });

    const response = await client.sendMail({
      from: {
        address: "noreply@vitagoli.keshavsandhu.in",
        name: "Quiz Results"
      },
      to: [{
        email_address: {
          address: to,
          name: "User"
        }
      }],
      subject: "Your Quiz Results",
      htmlbody: `
        <h2>Quiz Results</h2>
        <p>Your score: ${score}</p>
        <h3>Your Personalized Recommendation:</h3>
        <p>${recommendation}</p>
      `
    });
   
    return {
      message: response.message,
      request_id: response.request_id
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to send result email: ${error.message}`);
    }
    
    throw new Error('Failed to send result email: Unknown error');
  }
}
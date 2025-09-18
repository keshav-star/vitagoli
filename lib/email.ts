import { SendMailClient } from "zeptomail";

const ZEPTO_API_KEY = process.env.ZEPTO_API_KEY;
const url = "api.zeptomail.in/";
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
  console.log(ZEPTO_API_KEY);
  const token = process.env.ZEPTO_API_KEY;
  try {
    const  client = new SendMailClient({url, token});
    const response = await client.sendMail({
    "from": 
    {
        "address": "noreply@vitagoli.keshavsandhu.in",
        "name": "noreply"
    },
    "to": 
    [
        {
        "email_address": 
            {
                "address": to,
                "name": "Keshav"
            }
        }
    ],
    "subject": "Test Email",
    "htmlbody": `
      <h2>Quiz Results</h2>
      <p>Your score: ${score}</p>
      <h3>Your Personalized Recommendation:</h3>
      <p>${recommendation}</p>
    `,
})
   
    return response.data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send result email');
  }
}
declare module 'zeptomail' {
  export class SendMailClient {
    constructor(options: { url: string; token: string });
    sendMail(options: {
      from: {
        address: string;
        name?: string;
      };
      to: {
        email_address: {
          address: string;
          name?: string;
        };
      }[];
      subject: string;
      htmlbody?: string;
      textbody?: string;
    }): Promise<{
      message: string;
      request_id: string;
      objects?: unknown[];
    }>;
  }
}
const magicLinkEmailTemplate = (token: string) =>
  `<div className="email" style="border: 1px solid black; 
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;"
    >
        <h2>Magic Link</h2>
        <p>Here is your link to log in \n\n 
        <a href="${process.env.FRONTEND_URL}/magic-login/${token}">Click here to log in</a></p>
        <p>😘, Brake Neck</p>
    </div>`;

export default magicLinkEmailTemplate;

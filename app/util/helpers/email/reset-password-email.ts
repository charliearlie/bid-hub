const resetPasswordEmailTemplate = (
  token: string
) => `<div className="email" style="border: 1px solid black; 
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;"
    >
      <h2>Password reset</h2>
      <p>It looks like you forgot your password \n\n 
      <a href="${process.env.FRONTEND_URL}/user/reset-password/${token}">Click here to change it</a></p>
      <p>😘, Brake Neck</p>
</div>`;

export default resetPasswordEmailTemplate;

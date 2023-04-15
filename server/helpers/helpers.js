export const checkOtp = (user, otp) => {
  if (!user) {
    throw new Error("Email does not exist.");
  }
  const currentOtpExpires = user.currentOtpExpires;
  if (!currentOtpExpires) {
    throw new Error("Resend OTP and try again.");
  }
  if (Number(user.currentOtp) !== Number(otp)) {
    throw new Error("OTP is incorrect.");
  }
  const OtpExpired = user.currentOtpExpires < Date.now();
  if (OtpExpired) {
    throw new Error("OTP expired");
  }
};

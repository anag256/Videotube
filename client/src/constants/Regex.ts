const USERNAME_REGEX = /^[a-z0-9_.]{5,}$/;
const PASSWORD_REGEX = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z\d])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{12,}$/;
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export { USERNAME_REGEX, PASSWORD_REGEX, EMAIL_REGEX };

// validate general user information
import { User } from "./utility.models";

class UserValidation {

  // user name length requirements
  private static readonly MIN_NAME_LENGTH = 2;
  private static readonly MAX_NAME_LENGTH = 16;
  // user password length requirements
  private static readonly MIN_PASSWORD_LENGTH = 8;
  private static readonly MAX_PASSWORD_LENGTH = 16;
  // user signature length requirements
  private static readonly MIN_SIGNATURE_LENGTH = 0;
  private static readonly MAX_SIGNATURE_LENGTH = 500;
  // error messages
  private static readonly ERROR_MESSAGES = {
    "name": {
      "empty": "Please enter your username!",
      "too_short": `Username cannot be shorter than ${this.MIN_NAME_LENGTH} characters!`,
      "special_char_detected": `Username may not contain special characters other than "_"!`,
      "too_long": `Username cannot be longer than ${this.MAX_NAME_LENGTH} characters!`
    },
    "email": {
      "already_exist": `This Email address has already been used. If you believe your Email address has been used illegally, please use the "Forgot Password" page to retrieve your account.`,
      "invalid": "This is not a valid Email address!",
      "empty": "Please enter your Email address!"
    },
    "password": {
      "empty": "Please enter your password!",
      "do_not_match": "The passwords did not match!",
      "too_short": `Password cannot be shorter than ${this.MIN_PASSWORD_LENGTH} characters!`,
      "too_long": `Password cannot be longer than ${this.MAX_PASSWORD_LENGTH} characters!`
    },
    "signature": {
      "too_short": `Signature cannot be shorter than ${this.MIN_SIGNATURE_LENGTH} characters!`,
      "too_long": `Signature cannot be longer than ${this.MAX_SIGNATURE_LENGTH} characters!`
    }
  };
  private static readonly USERNAME_RE: RegExp = /[^A-Za-z0-9_]/;
  private static readonly EMAIL_RE: RegExp = /\S+@\S+\.\S+/;

  public static isNameValid(name: string): string | null {
    // if name is empty
    if (name.length <= 0) {
      return this.ERROR_MESSAGES.name.empty;
    }

    if (name.length < this.MIN_NAME_LENGTH) {
      return this.ERROR_MESSAGES.name.too_short;
    }

    if (name.length > this.MAX_NAME_LENGTH) {
      return this.ERROR_MESSAGES.name.too_long;
    }

    // check special characters
    if (this.USERNAME_RE.test(name)) {
      return this.ERROR_MESSAGES.name.special_char_detected;
    }

    return null;
  }

  public static isEmailValid(email: string): string | null {
    if (email == null || email.length <= 0) {
      return this.ERROR_MESSAGES.email.empty;
    }
    if (!this.EMAIL_RE.test(email)) {
      return this.ERROR_MESSAGES.email.invalid;
    }
    return null;
  }

  public static isSignatureValid(signature: string): string | null {
    if (signature.length < this.MIN_SIGNATURE_LENGTH) {
      return this.ERROR_MESSAGES.signature.too_short;
    }
    if (signature.length > this.MAX_SIGNATURE_LENGTH) {
      return this.ERROR_MESSAGES.signature.too_long;
    }
    return null;
  }

  public static isPasswordValid(password: string): string | null {
    if (password.length <= 0) {
      return this.ERROR_MESSAGES.password.empty;
    }
    if (password.length < this.MIN_PASSWORD_LENGTH) {
      return this.ERROR_MESSAGES.password.too_short;
    }
    if (password.length > this.MAX_PASSWORD_LENGTH) {
      return this.ERROR_MESSAGES.password.too_long;
    }
    return null;
  }

  public static isConfirmPasswordMatching(password: string, confirmPassword: string): string | null {
    if (password != confirmPassword) {
      return this.ERROR_MESSAGES.password.do_not_match;
    }
    return null;
  }
}

// validate user registration input data
export class RegistrationValidation {
  public static check(RegistrationData: Record<string, string>): Map<string, string> {
    const errorMessages: Map<string, string> = new Map<string, string>();

    let error = UserValidation.isEmailValid(RegistrationData["email"]);
    if (error != null) {
      errorMessages.set("email", error);
    }

    error = UserValidation.isNameValid(RegistrationData["name"]);
    if (error != null) {
      errorMessages.set("name", error);
    }

    error = UserValidation.isPasswordValid(RegistrationData["password"]);
    if (error != null) {
      errorMessages.set("password", error);
    }

    error = UserValidation.isConfirmPasswordMatching(RegistrationData["password"], RegistrationData["password_confirm"]);
    if (error != null) {
      errorMessages.set("password_confirm", error);
    }

    return errorMessages;
  }
}

// validate user login input data
export class LoginValidation {
  private static readonly ERROR_MESSAGES: Record<string, string> = {
    "email_empty": "Please enter your Email address!",
    "email_cannot_find": "This Email address does not exist!",
    "password_incorrect": "Wrong password!",
    "password_empty": "Password cannot be empty!",
  };

  public static check(LoginData: Record<string, string>): Map<string, string> {
    let errorMessages: Map<string, string> = new Map<string, string>();

    if (LoginData["email"] == null || LoginData["email"].length <= 0) {
      errorMessages.set("email", this.ERROR_MESSAGES["email_empty"]);
    }

    if (LoginData["password"] == null || LoginData["password"].length <= 0) {
      errorMessages.set("password", this.ERROR_MESSAGES["password_empty"]);
    }

    return errorMessages;
  }

  public static getMessage(key: string) {
    return this.ERROR_MESSAGES[key];
  }
}

// validate user update information input data
export class UserUpdateValidation {
  public static checkInfo(UserInfoData: User): Map<string, string> {
    const errorMessages: Map<string, string> = new Map<string, string>();

    let error = UserValidation.isNameValid(UserInfoData.name);
    if (error != null) {
      errorMessages.set("name", error);
    }

    error = UserValidation.isSignatureValid(UserInfoData.signature);
    if (error != null) {
      errorMessages.set("signature", error);
    }

    return errorMessages;
  }

  public static checkPassword(PasswordData: Record<string, string>): Map<string, string> {
    const errorMessages: Map<string, string> = new Map<string, string>();

    let error = UserValidation.isPasswordValid(PasswordData["password"]);
    if (error != null) {
      errorMessages.set("password", error);
    }

    error = UserValidation.isPasswordValid(PasswordData["newPassword"]);
    if (error != null) {
      errorMessages.set("newPassword", error);
    }

    error = UserValidation.isConfirmPasswordMatching(PasswordData["newPassword"], PasswordData["passwordConfirm"]);
    if (error != null) {
      errorMessages.set("passwordConfirm", error);
    }

    return errorMessages;
  }
}


// 帖子信息预验证模块
export class PostValidation {
  private static readonly ERROR_MESSAGES: Record<string, Record<string, string>> = {
    "title": {
      "not_empty": "帖子的标题不能为空",
      "too_short": "帖子的标题不能短于{}个字符",
      "too_long": "修改本站的html代码是不对的哦"
    },
    "content": {
      "not_empty": "帖子的内容不能为空"
    }
  };
}

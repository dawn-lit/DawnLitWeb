import { Blog, Discussion, User } from "./utility.models";

// validate general user information
class UserValidation {
  // user name length requirements
  private static readonly MIN_NAME_LENGTH = 2;
  private static readonly MAX_NAME_LENGTH = 16;
  // user password length requirements
  private static readonly MIN_PASSWORD_LENGTH = 8;
  private static readonly MAX_PASSWORD_LENGTH = 16;
  // user signature length requirements
  private static readonly MIN_SIGNATURE_LENGTH = 0;
  private static readonly MAX_SIGNATURE_LENGTH = 100;
  // user about length requirements
  private static readonly MIN_ABOUT_LENGTH = 0;
  private static readonly MAX_ABOUT_LENGTH = 500;
  // name error messages
  private static readonly NAME_ERROR_MESSAGES = {
    empty: "Please enter your username!",
    too_short: `Username cannot be shorter than ${this.MIN_NAME_LENGTH} characters!`,
    special_char_detected: `Username may not contain special characters other than "_"!`,
    too_long: `Username cannot be longer than ${this.MAX_NAME_LENGTH} characters!`
  };
  // password error messages
  private static readonly PASSWORD_ERROR_MESSAGES = {
    empty: "Please enter your password!",
    do_not_match: "The passwords did not match!",
    too_short: `Password cannot be shorter than ${this.MIN_PASSWORD_LENGTH} characters!`,
    too_long: `Password cannot be longer than ${this.MAX_PASSWORD_LENGTH} characters!`
  };
  // signature error messages
  private static readonly SIGNATURE_ERROR_MESSAGES = {
    too_short: `Signature cannot be shorter than ${this.MIN_SIGNATURE_LENGTH} characters!`,
    too_long: `Signature cannot be longer than ${this.MAX_SIGNATURE_LENGTH} characters!`
  };
  // about error messages
  private static readonly ABOUT_ERROR_MESSAGES = {
    too_short: `About cannot be shorter than ${this.MIN_SIGNATURE_LENGTH} characters!`,
    too_long: `About cannot be longer than ${this.MAX_SIGNATURE_LENGTH} characters!`
  };
  // user name pattern
  private static readonly USERNAME_RE: RegExp = /[^A-Za-z0-9_]/;

  public static isNameValid(name: string): string | null {
    // if name is empty
    if (name.length <= 0) {
      return this.NAME_ERROR_MESSAGES.empty;
    }

    if (name.length < this.MIN_NAME_LENGTH) {
      return this.NAME_ERROR_MESSAGES.too_short;
    }

    if (name.length > this.MAX_NAME_LENGTH) {
      return this.NAME_ERROR_MESSAGES.too_long;
    }

    // check special characters
    if (this.USERNAME_RE.test(name)) {
      return this.NAME_ERROR_MESSAGES.special_char_detected;
    }

    return null;
  }

  public static isSignatureValid(signature: string): string | null {
    if (signature.length < this.MIN_SIGNATURE_LENGTH) {
      return this.SIGNATURE_ERROR_MESSAGES.too_short;
    }
    if (signature.length > this.MAX_SIGNATURE_LENGTH) {
      return this.SIGNATURE_ERROR_MESSAGES.too_long;
    }
    return null;
  }

  public static isAboutValid(about: string): string | null {
    if (about.length < this.MIN_ABOUT_LENGTH) {
      return this.ABOUT_ERROR_MESSAGES.too_short;
    }
    if (about.length > this.MAX_ABOUT_LENGTH) {
      return this.ABOUT_ERROR_MESSAGES.too_long;
    }
    return null;
  }

  public static isPasswordValid(password: string): string | null {
    if (password.length <= 0) {
      return this.PASSWORD_ERROR_MESSAGES.empty;
    }
    if (password.length < this.MIN_PASSWORD_LENGTH) {
      return this.PASSWORD_ERROR_MESSAGES.too_short;
    }
    if (password.length > this.MAX_PASSWORD_LENGTH) {
      return this.PASSWORD_ERROR_MESSAGES.too_long;
    }
    return null;
  }

  public static isConfirmPasswordMatching(password: string, confirmPassword: string): string | null {
    if (password != confirmPassword) {
      return this.PASSWORD_ERROR_MESSAGES.do_not_match;
    }
    return null;
  }
}

// validate user registration input data
export class RegistrationValidation {
  // email pattern
  private static readonly EMAIL_RE: RegExp = /\S+@\S+\.\S+/;
  // email error messages
  private static readonly EMAIL_ERROR_MESSAGES: Record<string, string> = {
    already_exist: `This Email address has already been used. If you believe your Email address has been used illegally, please use the "Forgot Password" page to retrieve your account.`,
    invalid: "This is not a valid Email address!",
    empty: "Please enter your Email address!"
  };

  public static isEmailValid(email: string): string | null {
    if (email == null || email.length <= 0) {
      return this.EMAIL_ERROR_MESSAGES["empty"];
    }
    if (!this.EMAIL_RE.test(email)) {
      return this.EMAIL_ERROR_MESSAGES["invalid"];
    }
    return null;
  }

  public static check(RegistrationData: Record<string, string>): Map<string, string> {
    const errorMessages: Map<string, string> = new Map<string, string>();

    let error = this.isEmailValid(RegistrationData["email"]);
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

  public static getMessage(key: string): string {
    return this.EMAIL_ERROR_MESSAGES[key];
  }
}

// validate user login input data
export class LoginValidation {
  private static readonly ERROR_MESSAGES: Record<string, string> = {
    "email_empty": "Please enter your Email address!",
    "email_cannot_find": "This Email address does not exist!",
    "password_incorrect": "Wrong password!",
    "password_empty": "Password cannot be empty!",
    "account_being_deleted": "This account has been deleted and is still in cool down. If you want to revert this, please let the admin know!"
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

    error = UserValidation.isAboutValid(UserInfoData.about);
    if (error != null) {
      errorMessages.set("about", error);
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


// validate new content input data
export class ContentValidation {
  private static readonly ERROR_MESSAGES = {
    content_empty: "Content cannot be empty!",
    title_empty: "Title cannot be empty!"
  };

  public static check(newContent: Discussion | Blog): Map<string, string> {
    const errorMessages: Map<string, string> = new Map<string, string>();
    if (newContent.content.length <= 0) {
      errorMessages.set("content", this.ERROR_MESSAGES.content_empty);
    }
    if ("title" in newContent && newContent.title.length <= 0) {
      errorMessages.set("title", this.ERROR_MESSAGES.title_empty);
    }
    return errorMessages;
  }
}

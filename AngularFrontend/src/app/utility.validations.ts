/*
* 输入信息预验证模块
*/

// 注册信息预验证模块
export class RegistrationValidation {

  // 名称长度限制
  private static readonly MIN_NAME_LENGTH = 2;
  private static readonly MAX_NAME_LENGTH = 16;

  // 密码长度限制
  private static readonly MIN_PASSWORD_LENGTH = 8;
  private static readonly MAX_PASSWORD_LENGTH = 16;

  private static readonly _RE = /\S+@\S+\.\S+/;

  private static readonly ERROR_MESSAGES = {
    "birthday": {
      "in_future": "您的生日不能在未来哦",
      "empty": "您的生日不能为空"
    },
    "email": {
      "already_exist": "这个邮箱地址已经被使用。如果您的邮箱地址被非法使用，请通过“忘记密码”找回帐号",
      "invalid": "这不是一个正确的邮箱地址",
      "empty": "您的邮箱地址不能为空"
    },
    "name": {
      "empty": "请告诉我您的昵称吧",
      "too_short": `昵称不能小于${this.MIN_NAME_LENGTH}个字符`,
      "special_char_detected": "昵称不可包含除-和_以外的特殊字符",
      "too_long": `昵称不能大于${this.MAX_NAME_LENGTH}个字符`
    },
    "password": {
      "empty": "您的密码不能为空",
      "do_not_match": "两次输入的密码不一致，请重新输入",
      "too_short": `密码不能小于${this.MIN_PASSWORD_LENGTH}个字符`,
      "too_long": `密码不能大于${this.MAX_PASSWORD_LENGTH}个字符`
    }
  };

  public static check(RegistrationData: Record<string, string>): Map<string, string> {
    const errorMessages: Map<string, string> = new Map<string, string>();

    let error = this.isEmailValid(RegistrationData["email"]);
    if (error != null) {
      errorMessages.set("email", error);
    }

    error = this.isNameValid(RegistrationData["name"]);
    if (error != null) {
      errorMessages.set("name", error);
    }

    if (RegistrationData["password"] != RegistrationData["password_confirm"]) {
      errorMessages.set("password_confirm", this.ERROR_MESSAGES.password.do_not_match);
    }
    error = this.isPasswordValid(RegistrationData["password"]);
    if (error != null) {
      errorMessages.set("password", error);

    }
    return errorMessages;

  }

  private static isEmailValid(email: string): string | null {
    if (email == null || email.length <= 0) {
      return this.ERROR_MESSAGES.email.empty;
    }
    if (!this._RE.test(email)) {
      return this.ERROR_MESSAGES.email.invalid;
    }
    return null;
  }

  private static isNameValid(name: string): string | null {
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

    return null;
  }

  private static isBirthdayValid(birthday: string): string | null {
    if (birthday == null || birthday.length <= 0) {
      return this.ERROR_MESSAGES.birthday.empty;
    }
    if (new Date(birthday) > new Date()) {
      return this.ERROR_MESSAGES.birthday.in_future;
    }

    return null;
  }

  private static isPasswordValid(password: string): string | null {
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
}

// 登录信息预验证模块
export class LoginValidation {
  public static readonly ERROR_MESSAGES: Record<string, string> = {
    "email_empty": "邮箱不能为空",
    "email_cannot_find": "邮箱不存在",
    "password_incorrect": "密码错误",
    "password_empty": "密码不能为空",

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

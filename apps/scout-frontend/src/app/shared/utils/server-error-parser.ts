export interface ErrorMap {
  [key: string]: string;
}

interface ValidationRule {
  pattern: RegExp | string;
  message: string | ((match: RegExpExecArray) => string); 
}

export class ServerErrorParser {
  private static readonly fieldRules: Record<string, ValidationRule[]> = {
    email: [
      {
        pattern: /should not be empty/i,
        message: 'Email не должен быть пустым'
      },
      {
        pattern: /must be an email/i,
        message: 'Некорректный формат email'
      }
    ],
    password: [
      {
        pattern: /should not be empty/i,
        message: 'Пароль не должен быть пустым'
      },
      {
        pattern: /must be longer than or equal to (\d+) characters/i,
        message: (match) => `Пароль должен быть не менее ${match[1]} символов`
      }
    ]
  };

  public static parse(errorMessages: string[]): ErrorMap {
    const parsedErrors: ErrorMap = {};

    const groupedRawErrors: Record<string, string[]> = {};
    for (const msg of errorMessages) {
      const matchedField = Object.keys(this.fieldRules).find(field => 
        msg.toLowerCase().includes(field.toLowerCase())
      );

      if (matchedField) {
        if (!groupedRawErrors[matchedField]) {
          groupedRawErrors[matchedField] = [];
        }
        groupedRawErrors[matchedField].push(msg);
      }
    }

    for (const [field, messages] of Object.entries(groupedRawErrors)) {
      const rules = this.fieldRules[field];
      let selectedMessage: string | null = null;

      for (const rule of rules) {
        for (const msg of messages) {
          if (rule.pattern instanceof RegExp) {
            const match = rule.pattern.exec(msg);
            if (match) {
              selectedMessage = typeof rule.message === 'function' 
                ? rule.message(match) 
                : rule.message;
              break;
            }
          } else {
            if (msg.toLowerCase().includes(rule.pattern.toLowerCase())) {
              selectedMessage = typeof rule.message === 'function'
                ? rule.message([] as any)
                : rule.message;
              break;
            }
          }
        }
        if (selectedMessage) {
          break;
        }
      }

      parsedErrors[field] = selectedMessage || messages[0];
    }

    return parsedErrors;
  }
}

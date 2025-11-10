import { FormInstance } from "element-plus";
import type { FormRules } from "element-plus";

const validatePositive = makeValidator((value) => {
  if (value === "" || value == null || String(value).trim() === "") return;
  const num = Number(value);
  if (Number.isNaN(num) || num <= 0) return "Number must be positive";
});

function validateMaxQuantity(maxQuantity: number) {
  return makeValidator((value) => {
    if (value === "" || value == null || String(value).trim() === "") return;
    const num = Number(value);
    if (Number.isNaN(num) || num <= 0) return "Number must be positive";
    if (num == maxQuantity) return `Cannot be equal to ${maxQuantity}`;
    if (num > maxQuantity) return `Cannot be greater than ${maxQuantity}`;
  });
}

export const mainFormRules: FormRules = {
  quantity: [
    {
      required: true,
      trigger: "blur",
      message: "This field can't be empty",
    },
    {
      validator: validatePositive,
      trigger: "blur",
    },
  ],
  pricePerCoinBought: [
    {
      required: true,
      trigger: "blur",
      message: "This field can't be empty",
    },
    {
      validator: validatePositive,
      trigger: "blur",
    },
  ],
  pricePerCoinSold: [
    {
      validator: validatePositive,
      trigger: "blur",
    },
  ],
  fees: [
    {
      validator: validatePositive,
      trigger: "blur",
    },
  ],
};

export function getSplitFormRules(maxQuantity: number) {
  return {
    quantity: [
      {
        required: true,
        trigger: "blur",
        message: "This field can't be empty",
      },
      {
        validator: validateMaxQuantity(maxQuantity),
        trigger: "blur",
      },
    ],
  };
}

// Функція фабрика, яка робить коректний валідатор для ElementPlus
// аргумент(функція) цієї функції повинен повертати string якщо помилка, якщо ок то undefined
function makeValidator(fn: (value: any) => string | undefined) {
  return (rule: unknown, value: any, callback: (error?: string | Error | undefined) => void) => {
    const result = fn(value);
    if (result) {
      callback(result);
    } else {
      callback();
    }
  };
}

export function submitForm(formEl: FormInstance | undefined, submitFn: () => void) {
  if (!formEl) return;

  formEl.validate((valid, fields) => {
    if (!valid && fields) {
      const firstErrorField = Object.keys(fields)[0];
      formEl.scrollToField(firstErrorField);
      return;
    }
    if (valid) {
      submitFn();
      return;
    }
    return;
  });
}

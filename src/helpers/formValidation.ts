import { FormInstance } from "element-plus";

export const mainFormRules = {
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

function validateMaxQuantity(maxQuantity: number) {
  return (rule: any, value: any, callback: any) => {
    if (value === "" || value == null || String(value).trim() === "") {
      return callback(); // пусте поле — валідно
    }

    const num = Number(value);

    if (Number.isNaN(num) || num <= 0) {
      return callback(new Error("Number must be positive"));
    }

    if (num == maxQuantity) {
      return callback(new Error(`Cannot be equal to ${maxQuantity}`));
    }

    if (num > maxQuantity) {
      return callback(new Error(`Cannot be greater than ${maxQuantity}`));
    }

    callback(); // якщо все ок
  };
}

function validatePositive(rule: any, value: any, callback: any) {
  if (value === "" || value == null || String(value).trim() === "") {
    return callback();
  }
  const num = Number(value);
  if (Number.isNaN(num) || num <= 0) {
    return callback(new Error("Number must be positive"));
  } else {
    callback();
  }
}

export function submitForm(formEl: FormInstance | undefined, submitFn: Function) {
  if (!formEl) return;

  formEl.validate((valid, fields) => {
    if (!valid && fields) {
      const firstErrorField = Object.keys(fields)[0];
      const input = document.querySelector(`[name="${firstErrorField}"]`) as HTMLInputElement;
      console.log(input);

      input?.focus();
      return;
    }
    if (valid) {
      submitFn();
      return;
    }
    return;
  });
}

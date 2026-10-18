export const numberRules = (min = 0) => ({
  required: "Bu alan gereklidir!",
  valueAsNumber: true as const,
  min: { value: min, message: `En az ${min} olmalıdır!` },
});

export const optionalNumberRules = {
  valueAsNumber: true as const,
  min: { value: 0, message: "0'dan küçük olamaz!" },
};
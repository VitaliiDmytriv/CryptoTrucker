export function getTodayDate() {
  const date = new Date();

  const year = date.getFullYear().toString();
  const month = date.getMonth().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

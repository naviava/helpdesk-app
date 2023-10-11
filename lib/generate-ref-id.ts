export function generateRefId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";

  for (let i = 0; i < 12; i++) {
    if (i === 3 || i === 8) {
      randomString += "-";
    } else {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
  }

  return randomString;
}

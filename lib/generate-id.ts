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

export function generateEmpId() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const randomNumberString = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  let randomString = "";
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    randomString += alphabet[randomIndex];
  }

  const generatedEmployeeId = `EMP-${randomNumberString}-${randomString}`;

  return generatedEmployeeId;
}

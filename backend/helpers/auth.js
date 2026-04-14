import bcrypt from "bcrypt";

async function genHashedPassword(pwd) {
  const NO_OF_ROUNDS = 10;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  return await bcrypt.hash(pwd, salt);
}

async function comparePassword(payloadPassword, dbPassword) {
  return await bcrypt.compare(payloadPassword, dbPassword);
}

const authHelper = {
  genHashedPassword,
  comparePassword,
};

export default authHelper;
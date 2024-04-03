const yup = require("yup");
const { prisma } = require("../../prisma/PrismaClient");

const LoginValidation = (req) =>
  yup.object().shape({
    username: yup
      .string()
      .required()
      .test(
        "username check",
        "username is not exists in our system",
        async (value) => {
             const user = await prisma.users.findFirst({
              where: { username: value },
            })
            return  (user==null||user==undefined)?false:true;
        }
      ),
    password: yup.string().required(),
  });

module.exports = {
  LoginValidation,
};

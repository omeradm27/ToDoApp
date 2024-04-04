const yup = require("yup");
const { prisma } = require("../../prisma/PrismaClient");
const errorOutput = require("../../utils/error-output");

const LoginValidation = (req) =>{
  const validations= {};
  
  validations.username=yup.string().required().test(
    "username check",
    "username is not exists in our system",
    async (value) => {
      const user = await prisma.users.findFirst({where: { username: value }})
      return  (user==null||user==undefined)?false:true;
    } 
  );
  validations.password=yup.string().required();
  let schema = yup.object().shape(validations);

  return schema.validate(req.body, { abortEarly: false, strict: true, }).then(() => {
		return { success: true };
	}).catch((errors) => {
		return { success: false, errors: errorOutput(errors) };
	});
}
const RegisterValidation = (req) =>{
  const validations= {};

  validations.username=yup.string().required().test(
    "username check",
    "username is already exists in our system.Please try with another username",
    async (value) => {
      const user = await prisma.users.findFirst({where: { username: value }})
      return  (user==null||user==undefined)?true:false;
    } 
  );
  validations.password=yup.string().required();
  let schema = yup.object().shape(validations);

  return schema.validate(req.body, { abortEarly: false, strict: true, }).then(() => {
		return { success: true };
	}).catch((errors) => {
		return { success: false, errors: errorOutput(errors) };
	});
}

module.exports = {
  LoginValidation,
  RegisterValidation
};

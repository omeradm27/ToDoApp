const yup = require("yup");
const { prisma } = require("../../prisma/PrismaClient");
const errorOutput = require("../../utils/error-output");


const Validation = (req) =>{
const validations= {};
validations.time=yup.string().required();
validations.text=yup.string().required();
validations.checked=yup.boolean().required();

validations.user_id=yup.number().required().test(
  "user check",
  "user is not exists in our system",
  async (value) => {
    const user = await prisma.users.findFirst({where: { id: value }})
    return  (user==null||user==undefined)?false:true;
  }
);

let schema = yup.object().shape(validations);

  return schema.validate(req.body, { abortEarly: false, strict: true, }).then(() => {
		return { success: true };
	}).catch((errors) => {
		return { success: false, errors: errorOutput(errors) };
	});
}
module.exports = {
  Validation,
};
